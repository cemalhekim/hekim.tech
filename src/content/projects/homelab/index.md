---
title: "Homelab: the server behind this site"
summary: "An old laptop turned Debian home server: Docker stacks behind Caddy, everything on a Tailscale network, only this site exposed through Cloudflare Tunnel."
date: "Sep 8 2026"
draft: false
tags:
- Docker
- Caddy
- Tailscale
- Cloudflare
- Self-hosted
---

Nextcloud, Forgejo, Paperless, a Matrix homeserver bridging WhatsApp and Telegram, bookmarks, audiobooks, an AI Telegram bot and a few of my own apps, each as a compose stack with one reverse-proxy entry. Nothing listens on the internet; the private network carries everything, and this portfolio is the single public page, served as static files through an outbound tunnel.
