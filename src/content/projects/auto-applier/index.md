---
title: "auto-applier: local-first job search agent"
summary: "Daily job scan, fit evaluation and tailored application drafts, running on my own server with a small web UI."
date: "Sep 4 2026"
draft: false
tags:
- Agents
- Claude
- Next.js
- Self-hosted
---

A pipeline that scans job boards every morning, scores each posting against my CV variants, and drafts a tailored cover letter and CV selection for the ones worth applying to. Everything runs in Docker on the home server; the LLM calls go through a shared CLI runner so the web app never holds API credentials.
