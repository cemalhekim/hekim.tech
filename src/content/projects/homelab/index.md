---
title: "Homelab: the server behind this site"
summary: "An old laptop turned Debian home server: Docker stacks behind Caddy, everything on a Tailscale network, only this site exposed through Cloudflare Tunnel."
date: "Sep 1 2026"
draft: false
tags:
- Docker
- Caddy
- Tailscale
- Cloudflare
- Self-hosted
org: "Personal project"
problem: "My self-hosted services lived on laptops that were often offline, so they only existed while a lid was open."
approach: "An old Asus laptop with 8 GB of RAM and one disk runs headless Debian with every service as a compose stack. Every backend binds to localhost and Caddy is the single front door, with private *.hekim.tech names that point at the tailnet address. A hypervisor was ruled out because it would take half the memory; heavy compute goes to a GPU host instead."
result: "It hosts Nextcloud, Forgejo, Paperless, a Matrix homeserver bridging WhatsApp and Telegram, bookmarks, audiobooks and my own apps. A cleanup audit brought disk use from 98 to 74 GB."
metrics:
- { value: "8 GB", label: "RAM for everything" }
- { value: "98 → 74 GB", label: "disk after audit" }
- { value: "11", label: "private hekim.tech names" }
---

Nothing listens on the internet. The private network carries everything, and this portfolio is the single public page, served as static files through an outbound Cloudflare Tunnel.
