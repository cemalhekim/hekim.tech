---
title: "Upscaler: self-hosted Real-ESRGAN"
summary: "A small web app for image upscaling; the UI runs on the home server, the GPU work on a lab machine over the tailnet."
date: "Sep 1 2026"
draft: false
tags:
- Real-ESRGAN
- GPU
- FastAPI
- Self-hosted
---

Upload an image, pick a model, get the upscaled result. The interesting part is the split: the web UI lives on a low-power home server while inference is forwarded to a GPU box on the private network, so the heavy dependency stack only exists where the GPU is.
