---
title: "Franka Emika Panda retrofit"
summary: "A Panda the lab considered unusable, driven again through its own Desk API and later libfranka, with a teach pendant in the browser."
date: "Aug 22 2026"
draft: false
tags:
- Franka Emika
- Manipulation
- FastAPI
- React
- Python
org: "Vodafone 5G Lab, Düsseldorf"
problem: "The lab's Panda was considered unusable: only the vendor's Desk browser UI worked, and the real-time control interface was unreachable because the cable sat in the wrong port on the arm base."
approach: "I extracted Desk's own web API from the robot's JavaScript bundles, 106 endpoints, and drove the arm through it without the real-time interface. After moving the cable to the control box, a franky / libfranka driver followed. Both sit behind one 19-method driver contract, under a FastAPI backend with 30 Hz WebSocket state and a small program interpreter."
result: "The arm first moved under my software through the Desk API, and three days later through libfranka. Forward kinematics match the robot's own end-effector pose within 0.1 mm, hold-to-jog is clean in all six Cartesian directions, and every program step type ran on the live arm."
metrics:
- { value: "106", label: "Desk API endpoints" }
- { value: "0.1 mm", label: "FK vs robot" }
- { value: "42", label: "unit tests" }
---

The browser UI works like a teach pendant: jog the arm, drag a ghost of it to teach waypoints, and build programs from movej, movel, waypoint, loop, if and until-contact steps. A simulation driver behind the same contract lets the UI and the interpreter run without the arm.
