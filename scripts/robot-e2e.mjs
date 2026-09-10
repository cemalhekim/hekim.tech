// End-to-end check of the hero robot in the real rendered scene: steps through every
// planned frame and measures on the rendered meshes (finger links, cube, floor), then
// fails if the grasp, lift, carry or release is off. Needs a running build and Chrome:
//   npm run build && npx astro preview --port 4329 &   then   npm run robot:check
// CHROME=/path/to/chrome and URL=... override the defaults; key frames go to OUT (default /tmp).
import { chromium } from "playwright-core"
const URL_ = process.env.URL ?? "http://localhost:4329/"
const OUT = process.env.OUT ?? "/tmp"
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader"] })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
p.on("pageerror", (e) => errors.push(String(e)))
p.on("console", (m) => m.type() === "error" && errors.push(m.text()))
await p.goto(URL_ + "?robotdebug", { waitUntil: "networkidle" })
await p.waitForFunction(() => window.__heroRobot?.robot && !document.getElementById("robot-canvas").classList.contains("opacity-0"), null, { timeout: 30000 })

const result = await p.evaluate(() => {
  const H = window.__heroRobot
  const { THREE, world, cube, frames, robot } = H
  H.stop()
  H.seek(0)
  const S = world.scale.x
  const box = (o) => new THREE.Box3().setFromObject(o)
  // scene → robot frame (mm): x = (X − wx)/S, y = −Z/S, z = Y/S
  const toRobot = (v) => [((v.x - world.position.x) / S) * 1000, (-v.z / S) * 1000, (v.y / S) * 1000]
  const boxRobot = (o) => { const bb = box(o); const a = toRobot(bb.min), c = toRobot(bb.max); return { min: a.map((v, i) => Math.min(v, c[i])), max: a.map((v, i) => Math.max(v, c[i])) } }
  const L = robot.links.fer_leftfinger, R = robot.links.fer_rightfinger, tcp = robot.links.fer_hand_tcp
  const meshLinks = Object.values(robot.links).filter((l) => l.children.some((c) => c.userData.visual))
  const out = { grasps: [], releases: [], minLinkZ: Infinity, minFingerZ: Infinity, minCubeZ: Infinity, penetrationBeforeGrasp: 0, holdDrift: 0, fingerSymmetry: 0 }
  let prevHold = 0, holdRef = null
  const tcpPos = new THREE.Vector3(), cubePos = new THREE.Vector3()
  for (let i = 0; i < frames.length; i++) {
    H.applyFrame(i)
    world.updateMatrixWorld(true)
    const hold = frames[i][8]
    const c = boxRobot(cube), l = boxRobot(L), r = boxRobot(R)
    out.minCubeZ = Math.min(out.minCubeZ, c.min[2])
    out.minFingerZ = Math.min(out.minFingerZ, l.min[2], r.min[2])
    for (const link of meshLinks) out.minLinkZ = Math.min(out.minLinkZ, boxRobot(link).min[2])
    // mimic joint: both fingers the same distance from the TCP axis
    tcp.getWorldPosition(tcpPos)
    const t = toRobot(tcpPos)
    out.fingerSymmetry = Math.max(out.fingerSymmetry, Math.abs((l.min[1] + l.max[1]) / 2 + (r.min[1] + r.max[1]) / 2 - 2 * t[1]))
    if (hold === 1 && prevHold === 0) {
      // Finger pads vs cube faces along the closing axis (robot Y), in mm
      const [lo, hi] = l.max[1] < r.min[1] ? [l, r] : [r, l]
      out.grasps.push({
        frame: i,
        gapLow: +(c.min[1] - lo.max[1]).toFixed(2), // + gap, − penetration
        gapHigh: +(hi.min[1] - c.max[1]).toFixed(2),
        cubeBetween: lo.max[1] <= c.min[1] + 1.5 && hi.min[1] >= c.max[1] - 1.5,
        padDepthBelowCubeTop: +(c.max[2] - Math.min(l.min[2], r.min[2])).toFixed(1),
        fingerOverCubeX: +(Math.min(l.max[0], c.max[0]) - Math.max(l.min[0], c.min[0])).toFixed(1),
        cubeOnFloor: +c.min[2].toFixed(2),
      })
      holdRef = null
    }
    if (hold === 1) {
      cube.getWorldPosition(cubePos)
      const d = tcpPos.distanceTo(cubePos) / S * 1000
      if (holdRef === null) holdRef = d
      out.holdDrift = Math.max(out.holdDrift, Math.abs(d - holdRef))
      // lifted: cube must leave the floor together with the hand
    }
    if (hold === 0 && prevHold === 1) {
      const cc = toRobot(cube.getWorldPosition(cubePos))
      out.releases.push({ frame: i, center: cc.map((v) => +v.toFixed(2)), bottom: +c.min[2].toFixed(2) })
    }
    if (hold === 0 && out.grasps.length === out.releases.length) {
      // Open fingers descending around the free cube: AABB overlap depth must stay ≈ 0
      for (const f of [l, r]) {
        const ov = [0, 1, 2].map((k) => Math.min(f.max[k], c.max[k]) - Math.max(f.min[k], c.min[k]))
        if (ov.every((v) => v > 0)) out.penetrationBeforeGrasp = Math.max(out.penetrationBeforeGrasp, Math.min(...ov))
      }
    }
    prevHold = hold
  }
  // Lift check: 20 frames after each grasp the cube must be off the floor
  out.lift = out.grasps.map((g) => { H.seek(g.frame + 20); world.updateMatrixWorld(true); return +boxRobot(cube).min[2].toFixed(1) })
  return out
})
console.log(JSON.stringify(result, null, 1))
console.log("page errors:", errors.length ? errors : "none")
const fails = []
if (errors.length) fails.push("page errors")
if (result.grasps.length !== 2 || result.releases.length !== 2) fails.push("expected two grasps and two releases")
for (const g of result.grasps) {
  if (!g.cubeBetween) fails.push(`frame ${g.frame}: cube not between the fingers`)
  if (Math.abs(g.gapLow) > 1 || Math.abs(g.gapHigh) > 1) fails.push(`frame ${g.frame}: pads ${g.gapLow} / ${g.gapHigh} mm from the cube faces`)
  if (g.padDepthBelowCubeTop < 25) fails.push(`frame ${g.frame}: fingers only ${g.padDepthBelowCubeTop} mm down the cube`)
}
if (result.lift.some((z) => z < 50)) fails.push(`cube not lifted: ${result.lift}`)
const targets = [[500, -220], [500, 220]]
result.releases.forEach((r, k) => {
  if (Math.hypot(r.center[0] - targets[k][0], r.center[1] - targets[k][1]) > 1 || Math.abs(r.bottom) > 1) fails.push(`release ${k}: ${r.center} bottom ${r.bottom}`)
})
if (result.holdDrift > 0.1) fails.push(`cube slips in the hand by ${result.holdDrift} mm`)
if (result.minLinkZ < -1 || result.minCubeZ < -1) fails.push("robot or cube below the floor")
if (result.penetrationBeforeGrasp > 1) fails.push(`fingers pass ${result.penetrationBeforeGrasp} mm into the free cube`)
if (fails.length) { console.error("FAIL\n" + fails.join("\n")); await b.close(); process.exit(1) }
console.log("OK: grasp, lift, carry and release verified on the rendered scene")

// Key frames, close-up on the gripper and the default hero view
const shots = [["approach", 95], ["grasp", 125], ["lift", 150], ["carry", 185], ["place", 235], ["release", 250]]
for (const [name, f] of shots) {
  await p.evaluate(({ f, close }) => {
    const H = window.__heroRobot
    H.seek(f)
    const { THREE, world } = H
    const cam = new THREE.PerspectiveCamera(35, 1440 / 900, 0.01, 50)
    const S = world.scale.x
    // look at the midpoint between the pads from the front-right, slightly above
    const tgt = new THREE.Vector3(world.position.x + 0.5 * S, 0.08 * S, 0)
    cam.position.set(tgt.x + 0.75 * S, 0.35 * S, 0.55 * S)
    cam.lookAt(tgt)
    H.render(cam)
  }, { f, close: true })
  await p.locator("#robot-canvas").screenshot({ path: `${OUT}/robot-${name}.png` })
}
await p.evaluate(() => { const H = window.__heroRobot; H.seek(185); H.render() })
await p.screenshot({ path: `${OUT}/robot-hero.png` })
await b.close()
