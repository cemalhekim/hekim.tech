---
title: "Cejanics (forge): AI-assisted mechanical CAD on FreeCAD"
summary: "An MCP server inside FreeCAD that lets a language model build, constrain and check parts in a live session, shipped as a branded FreeCAD with a chat panel."
date: "Jul 18 2026"
draft: false
tags:
- FreeCAD
- MCP
- Agents
- CAD
- Python
org: "Co-developed, based on neka-nat/freecad-mcp"
problem: "CAD is slow to drive by hand, and a language model that changes geometry without checking it produces parts that are subtly wrong."
approach: "A fork of neka-nat/freecad-mcp runs as an addon inside FreeCAD and exposes the kernel as MCP tools: constrained sketches, features, fasteners, gears, FEM runs, undo milestones and turntable renders the model can look at. Every changing call is one undo step. A build workflow, a constraint cookbook and a vision check loop keep the model honest."
result: "The server exposes 35 tools and passed 19 of 19 headless API checks and 11 of 11 GUI integration tests. In a live session it built a two-joint robot arm with a gripper, all five sketches fully constrained."
metrics:
- { value: "35", label: "MCP tools" }
- { value: "19/19", label: "headless API checks" }
- { value: "11/11", label: "GUI integration tests" }
---

The project started as forge and was renamed Cejanics in July 2026; it is built together with a co-developer. My parts are the repository setup, the one-click installer, the branding, the in-app chat panel that drives headless Claude Code, the Linux port and the Spatial View, which opens the current model on a Vision Pro from a QR code.
