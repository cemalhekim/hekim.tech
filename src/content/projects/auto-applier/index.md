---
title: "auto-applier: local-first job search agent"
summary: "Daily job scan, fit evaluation and tailored applications, with the scan on my own server and an apply loop that fills and submits forms in a real browser."
date: "Sep 4 2026"
draft: false
tags:
- Agents
- Claude
- Next.js
- Self-hosted
org: "Personal project, based on santifer/career-ops"
problem: "Finding robotics roles across dozens of applicant-tracking systems and job boards, judging the fit and tailoring each application by hand does not scale."
approach: "A fork of career-ops with my own LinkedIn provider and pagination fixes for several job portals scans the market daily and shows it in a Next.js UI; both run in Docker on the home server and reach Claude through a shared CLI runner, so no credentials live in the app. On the workstation, an apply loop in a real Chrome profile prefills a form, has a separate read-only checker review it, then submits and logs the confirmation."
result: "A scan reads about 15,000 postings from 68 companies and 39 boards, 2,105 offers from 534 companies after filters. On its first night the apply loop submitted 4 applications with on-site confirmation, at 3 to 5 minutes each."
metrics:
- { value: "~15,000", label: "postings per scan" }
- { value: "2,105", label: "offers after filters" }
- { value: "3–5 min", label: "per application" }
---

Each application gets a CV PDF written for that posting, and a cover letter only when the form asks for one. Validation errors from the applicant-tracking system are handed to an agent fallback instead of failing the run.
