// Minimal URDF → three.js builder for the hero robot. Handles what fer.urdf uses: fixed,
// revolute and prismatic joints with origin (xyz, rpy) and axis, mimic joints, and visual
// meshes loaded through a callback. Replaces urdf-loader, whose bundled Collada/STL loaders
// would add ~100 KB gzip for meshes this site never loads. The joint parsing matches
// scripts/robot-trajectory.mjs, so the planner and the renderer share one kinematic model.
import * as THREE from "three"

type Joint = {
  name: string
  type: string
  parent: string
  child: string
  xyz: number[]
  rpy: number[]
  axis: THREE.Vector3
  mimic?: { joint: string; multiplier: number; offset: number }
  motion: THREE.Object3D
  value: number
}

export type Robot = {
  root: THREE.Object3D
  links: Record<string, THREE.Object3D>
  setJointValue: (name: string, value: number) => void
  jointValue: (name: string) => number
}

const nums = (s: string | undefined, fallback: string) => (s ?? fallback).trim().split(/\s+/).map(Number)

export function buildRobot(urdf: string, loadMesh: (path: string, parent: THREE.Object3D) => void): Robot {
  const doc = new DOMParser().parseFromString(urdf, "application/xml")
  const links: Record<string, THREE.Object3D> = {}
  for (const el of Array.from(doc.querySelectorAll("robot > link"))) {
    const link = new THREE.Object3D()
    link.name = el.getAttribute("name") ?? ""
    for (const vis of Array.from(el.querySelectorAll("visual"))) {
      const file = vis.querySelector("geometry > mesh")?.getAttribute("filename")
      if (!file) continue
      const holder = new THREE.Object3D()
      holder.userData.visual = true
      const o = vis.querySelector("origin")
      const [x, y, z] = nums(o?.getAttribute("xyz") ?? undefined, "0 0 0")
      const [r, p, w] = nums(o?.getAttribute("rpy") ?? undefined, "0 0 0")
      holder.position.set(x, y, z)
      holder.rotation.set(r, p, w, "ZYX")
      link.add(holder)
      loadMesh(file, holder)
    }
    links[link.name] = link
  }

  const joints: Record<string, Joint> = {}
  for (const el of Array.from(doc.querySelectorAll("robot > joint"))) {
    const o = el.querySelector("origin")
    const mimic = el.querySelector("mimic")
    const j: Joint = {
      name: el.getAttribute("name") ?? "",
      type: el.getAttribute("type") ?? "fixed",
      parent: el.querySelector("parent")?.getAttribute("link") ?? "",
      child: el.querySelector("child")?.getAttribute("link") ?? "",
      xyz: nums(o?.getAttribute("xyz") ?? undefined, "0 0 0"),
      rpy: nums(o?.getAttribute("rpy") ?? undefined, "0 0 0"),
      axis: new THREE.Vector3(...nums(el.querySelector("axis")?.getAttribute("xyz") ?? undefined, "1 0 0")).normalize(),
      mimic: mimic ? { joint: mimic.getAttribute("joint") ?? "", multiplier: Number(mimic.getAttribute("multiplier") ?? 1), offset: Number(mimic.getAttribute("offset") ?? 0) } : undefined,
      motion: new THREE.Object3D(),
      value: 0,
    }
    // parent link → joint frame (origin; URDF rpy = Rz·Ry·Rx = three Euler order "ZYX") → motion → child link
    const frame = new THREE.Object3D()
    frame.name = j.name
    frame.position.set(j.xyz[0], j.xyz[1], j.xyz[2])
    frame.rotation.set(j.rpy[0], j.rpy[1], j.rpy[2], "ZYX")
    frame.add(j.motion)
    links[j.parent]?.add(frame)
    if (links[j.child]) j.motion.add(links[j.child])
    joints[j.name] = j
  }

  const childLinks = new Set(Object.values(joints).map((j) => j.child))
  const root = Object.values(links).find((l) => !childLinks.has(l.name)) ?? new THREE.Object3D()

  function set(j: Joint, v: number) {
    j.value = v
    if (j.type === "revolute" || j.type === "continuous") j.motion.quaternion.setFromAxisAngle(j.axis, v)
    else if (j.type === "prismatic") j.motion.position.copy(j.axis).multiplyScalar(v)
    for (const m of Object.values(joints)) if (m.mimic?.joint === j.name) set(m, v * m.mimic.multiplier + m.mimic.offset)
  }

  return {
    root,
    links,
    setJointValue: (name, v) => joints[name] && set(joints[name], v),
    jointValue: (name) => joints[name]?.value ?? 0,
  }
}
