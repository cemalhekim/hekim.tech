---
title: "Pepper: bilingual LLM voice assistant and tour robot"
summary: "A 2016 SoftBank Pepper turned into a German/English voice assistant and showroom guide, with speech recognition and a local LLM moved off the robot."
date: "Jul 14 2026"
draft: false
tags:
- Pepper
- NAOqi
- LLM
- Speech
- AprilTag
org: "Vodafone 5G Lab, Düsseldorf"
problem: "The robot runs NAOqi on a 32-bit Atom with about 364 MB free on a read-only root and Python 2.7 as its only NAOqi interpreter. Its first LLM assistant took about 5.6 s from the end of a question to the first syllable of the answer."
approach: "All the thinking moved to the lab GPU host: faster-whisper for speech recognition and a pinned qwen3:8b on Ollama. The robot was stripped to a hardware driver, from 49 to 13 packages, reached through a reverse SSH tunnel. Python 3 talks to NAOqi through libqi built from source instead of qicli subprocesses."
result: "Like-for-like turn latency fell from about 5.6 s to about 2.9 s, summed from separately measured stages and compared against 70 logged turns. A single robot call dropped from 534 ms to 1.7 ms."
metrics:
- { value: "5.6 → 2.9 s", label: "voice turn latency" }
- { value: "534 → 1.7 ms", label: "robot call latency" }
- { value: "46 → 94 %", label: "STT keyword recall" }
---

Pepper's original NAOqi stack was kept only for motors, sensors and its own speech output; perception and dialogue moved to an external machine. The assistant has eleven tools for gestures, head movement, tablet text and switching language, and speaks through the robot's own animated speech.

A 1,630-line tour engine runs station presentations, QR cards and questions and answers in German and English. For moving between stations the robot localises itself on AprilTags; tag localisation error went from 172 mm to 23 mm over the course of the work.

The keyword recall figure comes from a synthetic noisy test corpus, not from live visitors.
