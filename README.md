# hekim.tech

Personal site of Cemal Hekim, built with Astro on the [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) theme (MIT). Static output only.

- Content: `src/content/{projects,work,blog,legal}` (Markdown/MDX, schema in `src/content/config.ts`)
- Site texts, nav and socials: `src/consts.ts`; hero and about copy: `src/pages/index.astro`
- `npm run dev` for a local preview, `./deploy.sh` to build and rsync `dist/` to `asuspro-homeserver:/srv/data/www` (served by Caddy behind Cloudflare Tunnel; see `cemos/integrations/cloudflare/`)
- Upstream theme is the `upstream` git remote; merge it when it moves (currently Astro 4)
