---
title: "UR5e as a motorized monitor holder"
summary: "A Universal Robots UR5e holding a desk monitor, switching between sitting, standing and portrait poses from what happens on the Mac next to it."
date: "Jul 30 2026"
draft: false
tags:
- UR5e
- Universal Robots
- RTDE
- macOS
org: "Vodafone 5G Lab, Düsseldorf"
problem: "Moving a desk monitor between sitting and standing height, and between landscape and portrait, is manual. A UR5e in the lab was free to do it, and to serve as a base for follow-up projects."
approach: "A Python package on the Mac reads the arm's state over RTDE, powers it through the dashboard server and sends URScript moves. A window-list watcher that needs no accessibility permission turns native fullscreen in an editor, terminal or PDF viewer into a portrait pose and a rotated display, and back on exit."
result: "Fullscreen detection works live, four poses are taught, and moves are capped at 2.0 rad/s as a comfort ceiling. The holder is one of three robots in the lab's one-tap wake and sleep routine."
metrics:
- { value: "4", label: "taught poses" }
- { value: "2.0 rad/s", label: "speed ceiling" }
- { value: "3", label: "robots, one sleep tap" }
---

A menu bar app adds pose buttons and hotkeys, plus an "Away" park that swings the arm 180° at reduced speed and puts Pepper to sleep on a background thread with a 4 s timeout, so a dead peer can never block the arm.
