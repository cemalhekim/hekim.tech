---
title: "Humanoid telemetry & guarded control dashboard"
summary: "Browser dashboard, guarded arm control and LLM tools for a Unitree H1-2 humanoid, with controller gains tuned in a MuJoCo twin before they reach the robot."
date: "May 18 2026"
draft: false
tags:
- Humanoid
- Unitree H1-2
- DDS
- MuJoCo
- XR
org: "Vodafone 5G Lab, Düsseldorf"
problem: "The lab's H1-2 could only be run from the vendor remote. XR teleoperation, LLM tools and pose replay all needed the same arm-command topic without fighting over it, and the arm controller oscillated on downward moves."
approach: "A single-file Python server subscribes to the robot's DDS topics, rebuilds a 30 Hz snapshot of 27 motors, IMU and hands, and streams it to a browser dashboard with a URDF twin. Every motion endpoint passes a six-layer safety interlock in front of a 120 Hz closed-loop arm controller. Controller gains were searched in a MuJoCo twin that speaks the robot's DDS dialect."
result: "The offline test suite grew from 124 to 273 tests and gates a push-to-deploy that reaches the robot in about 60 s. In the twin, the tuned gain set cut oscillating motions from 68 to 0 on a common 282-motion set; that set runs on the robot."
metrics:
- { value: "124 → 273", label: "offline tests" }
- { value: "68 → 0", label: "oscillating twin motions" }
- { value: "~60 s", label: "push-to-robot deploy" }
---

A ground station for a Unitree H1-2: joint and IMU telemetry, per-motor temperatures, hand state and the head camera in one browser page, with a three.js twin of the robot next to the live data.

Motion goes through one owner of the arm-command topic. Before the dashboard moves anything it suspends the XR teleoperation publishers, clamps every joint against its limits, ends each session after 90 s in a safe hold, and ramps back to a neutral pose when the data goes stale. The same guarded path serves pose replay and ten LLM tools, which are also exposed over MCP.

For XR, Unitree's upstream teleoperation stack lets the robot follow the operator's hand tracking; I integrated it with the dashboard and added a watchdog for a lost headset.

Gain tuning ran in a MuJoCo model of the H1-2 on the lab GPU host: random search and CMA-ES over 17 gain multipliers on a bank of 1,000 motions, so only a finished set had to be tried on hardware.
