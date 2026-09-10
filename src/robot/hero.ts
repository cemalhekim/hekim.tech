// Hero scene for RobotHero.astro, loaded as its own chunk so three.js, the glTF loader and
// the trajectory never block the rest of the page. See the component for what it shows.
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { buildRobot, type Robot } from "./urdf"
import plan from "./fer-trajectory.json"

type Frame = number[] // q1..q7, finger joint (m), hold flag
const FRAMES = plan.frames as Frame[]
const HZ = plan.hz
const CUBE = plan.cube
const S = 3.3 // scene units per metre, keeps the old camera framing

export function init() {
  const canvasEl = document.getElementById("robot-canvas") as HTMLCanvasElement | null
  const heroEl = document.getElementById("robot-hero")
  if (!canvasEl || !heroEl) return
  const canvas: HTMLCanvasElement = canvasEl
  const hero: HTMLElement = heroEl
  if (canvas.dataset.ready === "1") return
  canvas.dataset.ready = "1"

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const isDark = () => document.documentElement.classList.contains("dark")

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)

  // Robot frame (URDF, Z up, metres) inside the Y-up scene
  const world = new THREE.Group()
  world.rotation.x = -Math.PI / 2
  world.scale.setScalar(S)
  scene.add(world)

  const glow = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 1.1, roughness: 0.35 })
  const glowLight = new THREE.MeshStandardMaterial({ color: 0x0891b2, emissive: 0x0891b2, emissiveIntensity: 0.6, roughness: 0.35 })
  const padMat = new THREE.MeshStandardMaterial({ color: 0xcfd6de, metalness: 0.1, roughness: 0.6 })

  // Cube and the two pads it travels between (positions from the plan)
  const startPad = new THREE.Vector3(...(plan.start as [number, number, number]))
  const otherPad = new THREE.Vector3(startPad.x, -startPad.y, startPad.z)
  const cube = new THREE.Mesh(new THREE.BoxGeometry(CUBE, CUBE, CUBE), glow)
  cube.castShadow = true
  world.add(cube)
  for (const p of [startPad, otherPad]) {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.066, 0.004, 40), padMat)
    pad.rotation.x = Math.PI / 2 // cylinder axis to +Z
    pad.position.set(p.x, p.y, -0.002) // top face flush with the floor the cube stands on
    pad.receiveShadow = true
    world.add(pad)
  }
  const resetCube = () => {
    world.attach(cube)
    cube.position.set(startPad.x, startPad.y, CUBE / 2)
    cube.quaternion.identity()
  }
  resetCube()

  // Floor grid and shadow catcher
  const grid = new THREE.GridHelper(30, 60, 0x22d3ee, 0x22d3ee)
  const gridMat = grid.material as THREE.LineBasicMaterial
  gridMat.transparent = true
  gridMat.opacity = 0.09
  scene.add(grid)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.3 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Lights
  const hemi = new THREE.HemisphereLight(0xeef3f8, 0x0b1016, 1.5)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xffffff, 2.6)
  key.position.set(4, 7, 4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  // Shadow frustum sized to the arm's reach around its offset base
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 7, bottom: -5, far: 30 })
  key.shadow.bias = -0.0005
  scene.add(key)
  const rim = new THREE.PointLight(0x22d3ee, 14, 12, 2)
  rim.position.set(-3, 2.5, -2)
  scene.add(rim)

  function applyTheme() {
    const dark = isDark()
    cube.material = dark ? glow : glowLight
    padMat.color.set(dark ? 0x1f262f : 0xcfd6de)
    gridMat.opacity = dark ? 0.09 : 0.14
    gridMat.color.set(dark ? 0x22d3ee : 0x0891b2)
    rim.intensity = dark ? 14 : 4
    hemi.intensity = dark ? 1.2 : 1.6
    scene.fog = new THREE.Fog(dark ? 0x070a0f : 0xf6f8fa, 9, 20)
    renderOnce()
  }
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

  // ---------- robot from URDF ----------
  let robot: Robot | null = null
  let tcp: THREE.Object3D | null = null
  const BASE = "/robot/fer/"
  const manager = new THREE.LoadingManager()
  const gltf = new GLTFLoader(manager)
  gltf.setMeshoptDecoder(MeshoptDecoder)
  fetch(BASE + "fer.urdf")
    .then((r) => r.text())
    .then((text) => {
      const r = buildRobot(text, (file, parent) => {
        gltf.load(BASE + file, (g) => {
          g.scene.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) {
              o.castShadow = true
              o.receiveShadow = true
            }
          })
          parent.add(g.scene)
        })
      })
      robot = r
      world.add(r.root)
      tcp = r.links["fer_hand_tcp"]
    })
  manager.onLoad = () => {
    if (!robot) return
    seek(reduceMotion ? 180 : 0)
    canvas.classList.remove("opacity-0")
    renderOnce()
    updateHud(1)
    if (!reduceMotion && visible) start()
  }

  // ---------- playback ----------
  const jointNames = plan.joints as string[]
  let t = 0 // seconds into the loop
  let holding = false
  const releases: { at: number[]; t: number }[] = []

  function sample(time: number): Frame {
    const n = FRAMES.length
    const f = (((time * HZ) % n) + n) % n
    const i = Math.floor(f)
    const a = FRAMES[i]
    const b = FRAMES[(i + 1) % FRAMES.length]
    const k = f - i
    // Do not blend across the loop seam or a grip change
    if (i === FRAMES.length - 1 || a[8] !== b[8]) return a
    return a.map((v, n) => (n === 8 ? v : v + (b[n] - v) * k))
  }

  function apply(fr: Frame) {
    if (!robot || !tcp) return
    for (let n = 0; n < 7; n++) robot.setJointValue(jointNames[n], fr[n])
    robot.setJointValue("fer_finger_joint1", fr[7])
    world.updateMatrixWorld(true)
    const hold = fr[8] === 1
    if (hold && !holding) tcp.attach(cube)
    if (!hold && holding) {
      world.attach(cube)
      releases.push({ at: cube.position.toArray(), t })
    }
    holding = hold
  }

  function seek(frameIdx: number) {
    resetCube()
    holding = false
    for (let i = 0; i <= frameIdx; i++) apply(FRAMES[i])
    t = frameIdx / HZ
  }

  let lastFrame = 0
  function advance(dt: number) {
    t += dt
    const idx = Math.floor(t * HZ)
    if (idx >= FRAMES.length) {
      // Loop: the plan ends with the cube back on the start pad
      t -= FRAMES.length / HZ
      resetCube()
      holding = false
    }
    lastFrame = idx % FRAMES.length
    apply(sample(t))
  }

  // HUD
  const jointEls = Array.from(hero.querySelectorAll<HTMLElement>("[data-joint]"))
  const tcpX = hero.querySelector<HTMLElement>('[data-tcp="x"]')
  const tcpY = hero.querySelector<HTMLElement>('[data-tcp="y"]')
  const tcpZ = hero.querySelector<HTMLElement>('[data-tcp="z"]')
  const tcpG = hero.querySelector<HTMLElement>('[data-tcp="grip"]')
  const fmtDeg = (r: number) => {
    const d = (r * 180) / Math.PI
    return (d >= 0 ? "+" : "-") + Math.abs(d).toFixed(1).padStart(5, "0") + "°"
  }
  const fmtM = (v: number) => (v >= 0 ? "+" : "-") + Math.abs(v).toFixed(3) + " m"
  const tcpPos = new THREE.Vector3()
  let hudTimer = 0
  function updateHud(dt: number) {
    hudTimer += dt
    if (hudTimer < 0.1 || !robot || !tcp) return
    hudTimer = 0
    for (let i = 0; i < jointEls.length; i++) jointEls[i].textContent = fmtDeg(robot.jointValue(jointNames[i]))
    tcp.getWorldPosition(tcpPos)
    world.worldToLocal(tcpPos) // robot frame: X forward, Y left, Z up
    if (tcpX) tcpX.textContent = fmtM(tcpPos.x)
    if (tcpY) tcpY.textContent = fmtM(tcpPos.y)
    if (tcpZ) tcpZ.textContent = fmtM(tcpPos.z)
    if (tcpG) tcpG.textContent = `${Math.round(robot.jointValue("fer_finger_joint1") * 2000)} mm`
  }

  // Camera: arm right of centre on wide screens, centred and dimmed on narrow ones
  const target = new THREE.Vector3(0.7, 1.3, 0)
  let camRadius = 9.5
  let pointerX = 0
  let pointerY = 0
  window.addEventListener("pointermove", (e) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1
    pointerY = (e.clientY / window.innerHeight) * 2 - 1
  }, { passive: true })

  function layout() {
    const w = hero.clientWidth
    const h = hero.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const wide = w >= 768
    world.position.x = wide ? 2.0 : 0
    target.set(wide ? 1.1 : 1.1, wide ? 1.1 : 1.0, 0)
    camRadius = wide ? 8.2 : 11
    camera.fov = wide ? 32 : 40
    canvas.style.filter = wide ? "" : "opacity(0.45)"
    camera.updateProjectionMatrix()
  }

  let camAngle = 0
  function updateCamera(dt: number) {
    camAngle += (pointerX * 0.25 - camAngle) * Math.min(1, dt * 3)
    const a = 0.75 + camAngle
    camera.position.set(target.x + Math.sin(a) * camRadius, 3.2 - pointerY * 0.3, Math.cos(a) * camRadius)
    camera.lookAt(target)
  }

  function renderOnce() {
    updateCamera(1)
    renderer.render(scene, camera)
  }

  let running = false
  let visible = false
  let last = performance.now()
  let raf = 0
  function frame(now: number) {
    if (!running) return
    // rAF timestamps can precede the performance.now() taken in start(), so clamp at 0
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
    last = now
    advance(dt)
    updateCamera(dt)
    updateHud(dt)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }
  function start() {
    if (running || reduceMotion || !robot) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      visible = e.isIntersecting && !document.hidden
      ;(visible ? start : stop)()
    }
  }, { threshold: 0.05 })
  io.observe(hero)
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : visible && start()))

  new ResizeObserver(() => {
    layout()
    renderOnce()
  }).observe(hero)

  layout()
  applyTheme()

  if (new URLSearchParams(location.search).has("robotdebug")) {
    Object.assign(window, {
      __heroRobot: {
        THREE, world, cube, releases, frames: FRAMES, hz: HZ,
        get robot() { return robot },
        get holding() { return holding },
        get frame() { return lastFrame },
        seek: (i: number) => { stop(); seek(i); renderOnce() },
        applyFrame: (i: number) => apply(FRAMES[i]),
        render: (cam?: THREE.Camera) => renderer.render(scene, cam ?? camera),
        camera, scene,
        stop,
      },
    })
  }
}

