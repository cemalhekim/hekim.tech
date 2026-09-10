// Offline motion planner for the hero robot: a Franka Emika Panda (FER) with Franka Hand,
// kinematics read from public/robot/fer/fer.urdf. It plans a pick-and-place loop the way a
// robot program would (movej above the cube, movel straight down, close the fingers to the
// cube width, movel up, movej over, movel down, open, movel up, home), solves every Cartesian
// sample with 7-DOF damped-least-squares IK, checks the result and writes
// src/robot/fer-trajectory.json, which the browser only plays back.
//
//   node scripts/robot-trajectory.mjs          plan, verify, write
//
// Frames: URDF/robot frame, Z up, metres. The cube stands on the floor plane z = 0, like
// the robot base. The script exits non-zero if any check fails, so a bad plan never ships.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const URDF = readFileSync(new URL("../public/robot/fer/fer.urdf", import.meta.url), "utf8")
const OUT = new URL("../src/robot/fer-trajectory.json", import.meta.url)

// ---------- URDF joints ----------
const nums = (s) => s.trim().split(/\s+/).map(Number)
const joints = [...URDF.matchAll(/<joint name="([^"]+)" type="(\w+)">([\s\S]*?)<\/joint>/g)].map(([, name, type, body]) => {
  const attr = (tag, a) => body.match(new RegExp(`<${tag}[^>]*\\b${a}="([^"]+)"`))?.[1]
  return {
    name, type,
    parent: attr("parent", "link"), child: attr("child", "link"),
    xyz: nums(attr("origin", "xyz") ?? "0 0 0"), rpy: nums(attr("origin", "rpy") ?? "0 0 0"),
    axis: nums(attr("axis", "xyz") ?? "1 0 0"),
    lower: Number(attr("limit", "lower") ?? 0), upper: Number(attr("limit", "upper") ?? 0),
    mimic: attr("mimic", "joint"),
  }
})
const byChild = new Map(joints.map((j) => [j.child, j]))
const ARM = Array.from({ length: 7 }, (_, i) => joints.find((j) => j.name === `fer_joint${i + 1}`))

// ---------- 4×4 math (row-major arrays of 16) ----------
const I4 = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
function mul(a, b) {
  const r = new Array(16).fill(0)
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) r[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j]
  return r
}
function fromRpyXyz([r, p, y], [x, yy, z]) {
  const cr = Math.cos(r), sr = Math.sin(r), cp = Math.cos(p), sp = Math.sin(p), cy = Math.cos(y), sy = Math.sin(y)
  // URDF: R = Rz(yaw) · Ry(pitch) · Rx(roll)
  return [
    cy * cp, cy * sp * sr - sy * cr, cy * sp * cr + sy * sr, x,
    sy * cp, sy * sp * sr + cy * cr, sy * sp * cr - cy * sr, yy,
    -sp, cp * sr, cp * cr, z,
    0, 0, 0, 1,
  ]
}
function axisAngle([x, y, z], a) {
  const c = Math.cos(a), s = Math.sin(a), t = 1 - c
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0, t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0, t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0, 0, 0, 0, 1]
}
const translate = ([x, y, z]) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1]
const pos = (T) => [T[3], T[7], T[11]]
const col = (T, c) => [T[c], T[4 + c], T[8 + c]]
const apply = (T, [x, y, z]) => [T[0] * x + T[1] * y + T[2] * z + T[3], T[4] * x + T[5] * y + T[6] * z + T[7], T[8] * x + T[9] * y + T[10] * z + T[11]]
const sub = (a, b) => a.map((v, i) => v - b[i])
const add = (a, b) => a.map((v, i) => v + b[i])
const scale = (a, k) => a.map((v) => v * k)
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0)
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => Math.hypot(...a)

// ---------- forward kinematics ----------
// World transform of a link for arm angles q[7] and finger opening d (each finger, metres)
function fk(link, q, d) {
  const chain = []
  for (let l = link; byChild.has(l); l = byChild.get(l).parent) chain.unshift(byChild.get(l))
  let T = I4()
  const frames = []
  for (const j of chain) {
    T = mul(T, fromRpyXyz(j.rpy, j.xyz))
    const armIdx = ARM.indexOf(j)
    if (armIdx >= 0) {
      frames.push({ idx: armIdx, T })
      T = mul(T, axisAngle(j.axis, q[armIdx]))
    } else if (j.type === "prismatic") {
      T = mul(T, translate(scale(j.axis, d)))
    }
  }
  return { T, frames }
}

// ---------- IK: damped least squares with a null-space pull to the ready pose ----------
const READY = [0, -Math.PI / 4, 0, (-3 * Math.PI) / 4, 0, Math.PI / 2, Math.PI / 4]
function solve6(A, b) {
  const n = 6, M = A.map((row, i) => [...row, b[i]])
  for (let c = 0; c < n; c++) {
    let p = c
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r
    ;[M[c], M[p]] = [M[p], M[c]]
    for (let r = 0; r < n; r++) {
      if (r === c) continue
      const f = M[r][c] / M[c][c]
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]
    }
  }
  return M.map((row, i) => row[n] / row[i])
}
function ik(target, seed) {
  const q = [...seed]
  const pT = pos(target), R = [col(target, 0), col(target, 1), col(target, 2)]
  for (let it = 0; it < 400; it++) {
    const { T, frames } = fk("fer_hand_tcp", q, 0)
    const p = pos(T)
    const ep = sub(pT, p)
    const eo = scale(add(add(cross(col(T, 0), R[0]), cross(col(T, 1), R[1])), cross(col(T, 2), R[2])), 0.5)
    const e = [...ep, ...eo]
    if (norm(ep) < 1e-6 && norm(eo) < 1e-6) return { q, ep: norm(ep), eo: norm(eo) }
    // Geometric Jacobian (6×7)
    const J = frames.map(({ T: Tj, idx }) => {
      const z = apply([...Tj.slice(0, 3), 0, ...Tj.slice(4, 7), 0, ...Tj.slice(8, 11), 0, 0, 0, 0, 1], ARM[idx].axis)
      return [...cross(z, sub(p, pos(Tj))), ...z]
    })
    const lambda2 = 1e-4
    const JJt = Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => J.reduce((s, Jc) => s + Jc[r] * Jc[c], 0) + (r === c ? lambda2 : 0)))
    const y = solve6(JJt, e)
    const dqTask = J.map((Jc) => dot(Jc, y))
    // Null space: (I − J⁺J)·k(q_ready − q), J⁺ ≈ Jᵀ(JJᵀ+λ²I)⁻¹
    const z0 = READY.map((r, i) => 0.05 * (r - q[i]))
    const w = solve6(JJt, Array.from({ length: 6 }, (_, r) => J.reduce((s, Jc, i) => s + Jc[r] * z0[i], 0)))
    const dqNull = z0.map((v, i) => v - dot(J[i], w))
    for (let i = 0; i < 7; i++) {
      const j = ARM[i]
      q[i] = Math.min(j.upper - 0.05, Math.max(j.lower + 0.05, q[i] + dqTask[i] + dqNull[i]))
    }
  }
  const { T } = fk("fer_hand_tcp", q, 0)
  return { q, ep: norm(sub(pT, pos(T))), eo: NaN }
}

// ---------- the task ----------
const CUBE = 0.05 // edge, metres
const OPEN = 0.04 // finger joint at full opening (80 mm between pads)
const GRIP = CUBE / 2 // finger joint when the pads touch the cube
const HOVER = 0.12 // TCP height above the grasp point for approach and transport
const A = [0.5, 0.22, 0] // cube bottom centre, pick side
const B = [0.5, -0.22, 0] // cube bottom centre, place side
// TCP pointing straight down, pads closing along world Y: x = +X, z = −Z, y = z × x = −Y
const down = (p) => [1, 0, 0, p[0], 0, -1, 0, p[1], 0, 0, -1, p[2], 0, 0, 0, 1]
const grasp = (c) => down([c[0], c[1], c[2] + CUBE / 2])
const above = (c) => down([c[0], c[1], c[2] + CUBE / 2 + HOVER])

const HZ = 30
const quintic = (t) => t * t * t * (10 - 15 * t + 6 * t * t)
const frames = [] // [q1..q7, d, hold]
let q = [...READY], d = OPEN, hold = 0
const residuals = []
const push = () => frames.push([...q, d, hold])

function dwell(sec) { for (let i = 0; i < Math.round(sec * HZ); i++) push() }
function movej(qTarget, sec) {
  const q0 = [...q], n = Math.round(sec * HZ)
  for (let i = 1; i <= n; i++) { const s = quintic(i / n); q = q0.map((v, k) => v + (qTarget[k] - v) * s); push() }
}
function movel(Tfrom, Tto, sec) {
  const p0 = pos(Tfrom), p1 = pos(Tto), n = Math.round(sec * HZ)
  for (let i = 1; i <= n; i++) {
    const s = quintic(i / n)
    const r = ik(down(add(p0, scale(sub(p1, p0), s))), q)
    residuals.push(r.ep)
    q = r.q
    push()
  }
}
function gripper(to, sec) {
  const d0 = d, n = Math.round(sec * HZ)
  for (let i = 1; i <= n; i++) { d = d0 + (to - d0) * quintic(i / n); push() }
}
const solveAt = (T) => { const r = ik(T, q); residuals.push(r.ep); return r.q }

const events = []
function trip(from, to) {
  movej(solveAt(above(from)), 1.7)
  movel(above(from), grasp(from), 1.1)
  gripper(GRIP, 0.45)
  hold = 1; events.push({ frame: frames.length, type: "attach", at: from })
  dwell(0.15)
  movel(grasp(from), above(from), 1.0)
  movej(solveAt(above(to)), 1.9)
  movel(above(to), grasp(to), 1.1)
  hold = 0; events.push({ frame: frames.length, type: "detach", at: to })
  gripper(OPEN, 0.45)
  dwell(0.1)
  movel(grasp(to), above(to), 1.0)
  movej(READY, 1.7)
  dwell(0.6)
}
dwell(0.4)
trip(A, B)
trip(B, A)

// ---------- verification against the URDF kinematics ----------
const fails = []
const check = (ok, msg) => { if (!ok) fails.push(msg) }
check(Math.max(...residuals) < 1e-4, `IK residual ${Math.max(...residuals).toExponential(2)} m`)
frames.forEach((f, i) => ARM.forEach((j, k) => check(f[k] >= j.lower && f[k] <= j.upper, `frame ${i} joint ${k + 1} outside limits`)))
// Largest joint step between frames (continuity, rad)
let maxStep = 0
for (let i = 1; i < frames.length; i++) for (let k = 0; k < 7; k++) maxStep = Math.max(maxStep, Math.abs(frames[i][k] - frames[i - 1][k]))
check(maxStep < 0.08, `joint jump ${maxStep.toFixed(3)} rad between frames`)

// Cube follows the TCP while held; simulate exactly what the browser does
const fingerTip = (link, f) => apply(fk(link, f.slice(0, 7), f[7]).T, [0, 0, 0.054])
const pad = (link, f) => pos(fk(link, f.slice(0, 7), f[7]).T)
let cube = translate([A[0], A[1], CUBE / 2]) // upright at A
let offset = null
const log = []
let minTip = Infinity, minCubeBottom = Infinity
frames.forEach((f, i) => {
  const tcp = fk("fer_hand_tcp", f.slice(0, 7), f[7]).T
  if (f[8] === 1 && !offset) {
    // attach: offset = tcp⁻¹ · cube (tcp is a rigid transform, invert via transpose)
    const Rt = [tcp[0], tcp[4], tcp[8], tcp[1], tcp[5], tcp[9], tcp[2], tcp[6], tcp[10]]
    const tp = pos(tcp)
    const inv = [Rt[0], Rt[1], Rt[2], -(Rt[0] * tp[0] + Rt[1] * tp[1] + Rt[2] * tp[2]), Rt[3], Rt[4], Rt[5], -(Rt[3] * tp[0] + Rt[4] * tp[1] + Rt[5] * tp[2]), Rt[6], Rt[7], Rt[8], -(Rt[6] * tp[0] + Rt[7] * tp[1] + Rt[8] * tp[2]), 0, 0, 0, 1]
    offset = mul(inv, cube)
    const c = pos(cube)
    const l = pad("fer_leftfinger", f), r = pad("fer_rightfinger", f)
    // Pads must touch the cube faces (±CUBE/2 along Y) and sit centred over it
    log.push({ event: "grasp", frame: i, leftPadY: +(l[1] - c[1]).toFixed(5), rightPadY: +(r[1] - c[1]).toFixed(5), padX: +(l[0] - c[0]).toFixed(5), tipZ: +fingerTip("fer_leftfinger", f)[2].toFixed(4) })
    check(Math.abs(Math.abs(l[1] - c[1]) - CUBE / 2) < 5e-4 && Math.abs(Math.abs(r[1] - c[1]) - CUBE / 2) < 5e-4, `grasp: pads not on the cube faces (${(l[1] - c[1]).toFixed(4)}, ${(r[1] - c[1]).toFixed(4)})`)
    check(Math.sign(l[1] - c[1]) !== Math.sign(r[1] - c[1]), "grasp: both pads on the same side of the cube")
    check(Math.abs(l[0] - c[0]) < 5e-4 && Math.abs(r[0] - c[0]) < 5e-4, "grasp: pads not centred over the cube")
    // Pad overlap with the cube height: fingertips below the cube top by at least 25 mm
    check(c[2] + CUBE / 2 - fingerTip("fer_leftfinger", f)[2] > 0.025, "grasp: fingers too shallow on the cube")
  }
  if (f[8] === 1) cube = mul(tcp, offset)
  if (f[8] === 0 && offset) {
    offset = null
    const c = pos(cube)
    log.push({ event: "release", frame: i, cube: c.map((v) => +v.toFixed(5)) })
  }
  // Before the grasp, while the open fingers descend around the cube, keep them clear of it
  if (f[8] === 0 && !offset) {
    const c = pos(cube)
    for (const link of ["fer_leftfinger", "fer_rightfinger"]) {
      const p = pad(link, f)
      const tip = fingerTip(link, f)
      const insideXY = Math.abs(p[0] - c[0]) < CUBE / 2 + 0.011 && Math.abs(p[1] - c[1]) < CUBE / 2 - 1e-4
      if (insideXY && tip[2] < c[2] + CUBE / 2) fails.push(`frame ${i}: ${link} would pass through the cube`)
    }
  }
  minTip = Math.min(minTip, fingerTip("fer_leftfinger", f)[2], fingerTip("fer_rightfinger", f)[2])
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) minCubeBottom = Math.min(minCubeBottom, apply(cube, [sx * CUBE / 2, sy * CUBE / 2, sz * CUBE / 2])[2])
})
const releases = log.filter((l) => l.event === "release")
check(releases.length === 2, `expected 2 releases, got ${releases.length}`)
for (const [k, r] of releases.entries()) {
  const target = k === 0 ? B : A
  check(Math.hypot(r.cube[0] - target[0], r.cube[1] - target[1]) < 5e-4, `release ${k}: cube ${r.cube} not at ${target}`)
  check(Math.abs(r.cube[2] - CUBE / 2) < 5e-4, `release ${k}: cube not resting on the floor (z ${r.cube[2]})`)
}
check(minTip > 0.005, `fingertips reach ${minTip.toFixed(4)} m, below 5 mm above the floor`)
check(minCubeBottom > -1e-4, `cube goes ${(-minCubeBottom * 1000).toFixed(2)} mm into the floor`)

console.log(JSON.stringify({ frames: frames.length, seconds: +(frames.length / HZ).toFixed(1), maxIkResidual: Math.max(...residuals), maxJointStep: +maxStep.toFixed(4), minFingertipZ: +minTip.toFixed(4), minCubeBottom: +minCubeBottom.toFixed(5), log }, null, 1))
if (fails.length) {
  console.error(`\n${fails.length} check(s) failed:\n` + [...new Set(fails)].slice(0, 20).join("\n"))
  process.exit(1)
}

mkdirSync(new URL("../src/robot/", import.meta.url), { recursive: true })
writeFileSync(OUT, JSON.stringify({
  source: "scripts/robot-trajectory.mjs",
  hz: HZ,
  cube: CUBE,
  start: A,
  joints: ARM.map((j) => j.name),
  frames: frames.map((f) => [...f.slice(0, 7).map((v) => +v.toFixed(5)), +f[7].toFixed(5), f[8]]),
}))
console.log("wrote", OUT.pathname)
