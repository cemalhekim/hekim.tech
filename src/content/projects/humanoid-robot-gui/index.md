---
title: "Humanoid telemetry & XR operator dashboard"
summary: "Live telemetry, control and an XR operator view for a Unitree H1-2 humanoid, with a MuJoCo loop to tune the high-level controller off-robot."
date: "Aug 15 2026"
draft: false
tags:
- Humanoid
- Unitree H1-2
- ROS 2
- MuJoCo
- XR
---

A ground station for a Unitree H1-2: joint and IMU telemetry, battery and thermal state, arm replay and a cascade of high-level controllers, all in one operator GUI. The XR view mirrors the robot's pose for the operator.

To tune the arm-replay cascade without wearing out the real robot, the same controller runs against a MuJoCo model of the H1-2 in a simulation loop, so parameter sweeps happen on a laptop and only the final set goes to hardware.

Built at Vodafone's 5G lab in Düsseldorf.
