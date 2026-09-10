---
title: "Upscaler: self-hosted Real-ESRGAN"
summary: "Image upscaling and background removal from a small web app on the home server, with the GPU work forwarded to a lab machine over the tailnet."
date: "Sep 3 2026"
draft: false
tags:
- Real-ESRGAN
- GPU
- FastAPI
- Self-hosted
org: "Personal project"
problem: "Upscaling and background removal need a GPU and a torch stack; the home server is an 8 GB laptop without a GPU."
approach: "A torch-free web container on the home server takes the upload and forwards it over Tailscale to an NVIDIA A40. There, Real-ESRGAN upscales in 512 px tiles with 32 px overlap and BiRefNet removes backgrounds. Terminal ASCII conversion stays in the web container, because the round trip would cost more than the work."
result: "A ×4 upscale of a 207×256 image takes 0.29 s on the GPU and 0.74 s end to end over HTTPS. The web image stays at 58 MB because the heavy stack only exists where the GPU is."
metrics:
- { value: "0.74 s", label: "×4 upscale, end to end" }
- { value: "58 MB", label: "torch-free web image" }
- { value: "×2 ×4 ×8", label: "upscale factors" }
---

Pick an operation (upscale, remove background or ASCII) and a scale; ×8 is a ×4 pass followed by ×2. Background removal on a 3344×1882 photo takes 2.37 to 3.44 s of GPU time.
