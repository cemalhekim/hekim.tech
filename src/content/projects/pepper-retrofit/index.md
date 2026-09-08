---
title: "Pepper: bilingual LLM voice assistant and tour robot"
summary: "Retrofit of a SoftBank Pepper into a Turkish/German/English voice assistant and guided-tour robot driven by a local LLM."
date: "Jun 20 2026"
draft: false
tags:
- Pepper
- LLM
- Speech
- ROS 2
- Navigation
---

Pepper's original NAOqi stack was kept only for motors and sensors; perception, dialogue and navigation moved to an external machine. Speech goes through Whisper, the dialogue policy is a local LLM with tool calls for movement and tablet content, and speech synthesis comes back over the network.

The tour mode uses a ROS 2 navigation stack benchmarked on a separate SLAM lab (slam_toolbox in Gazebo) before it ran on the real robot. The whole thing switches language mid-conversation, which is what visitors actually do.
