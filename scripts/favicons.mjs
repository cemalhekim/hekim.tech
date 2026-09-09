// Fetches favicons for stack entries that have no Simple Icons mark and stores
// them as 64x64 PNGs in public/icons/<slug>.png.
// Run: node scripts/favicons.mjs   (reads the list below; re-run to refresh)
import sharp from "sharp"
import { writeFileSync, mkdirSync, existsSync } from "node:fs"

// slug -> site to take the favicon from
const SITES = JSON.parse(process.argv[2] ?? "{}")

const UA = "Mozilla/5.0 (X11; Linux x86_64) hekim.tech favicon fetch"

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res
}

// Find the best icon link in the page head, prefer large PNG/SVG, fall back to /favicon.ico
async function iconCandidates(site) {
  const out = []
  try {
    const html = await (await get(site)).text()
    const head = html.slice(0, 200000)
    const links = [...head.matchAll(/<link[^>]+>/gi)].map((m) => m[0])
    for (const l of links) {
      const rel = (l.match(/rel=["']([^"']+)["']/i)?.[1] ?? "").toLowerCase()
      if (!/icon/.test(rel)) continue
      if (rel.includes("mask-icon")) continue // monochrome Safari masks render as black blobs
      const href = l.match(/href=["']([^"']+)["']/i)?.[1]
      if (!href || href.includes("safari-pinned-tab")) continue
      const sizes = l.match(/sizes=["'](\d+)x/i)?.[1]
      const score = (rel.includes("apple") ? 180 : Number(sizes ?? 0)) + (href.endsWith(".svg") ? 500 : 0)
      out.push({ url: new URL(href, site).href, score })
    }
  } catch (e) {
    console.warn(`  page fetch failed for ${site}: ${e.message}`)
  }
  out.sort((a, b) => b.score - a.score)
  out.push({ url: new URL("/favicon.ico", site).href, score: -1 })
  // Google's favicon service as a last resort
  out.push({ url: `https://www.google.com/s2/favicons?domain=${new URL(site).hostname}&sz=128`, score: -2 })
  return out
}

mkdirSync("public/icons", { recursive: true })
const results = {}
for (const [slug, site] of Object.entries(SITES)) {
  const target = `public/icons/${slug}.png`
  if (existsSync(target) && !process.env.FORCE) {
    results[slug] = "kept"
    continue
  }
  let done = false
  for (const c of await iconCandidates(site)) {
    try {
      const buf = Buffer.from(await (await get(c.url)).arrayBuffer())
      const png = await sharp(buf, { density: 256 }).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
      writeFileSync(target, png)
      results[slug] = c.url
      done = true
      break
    } catch (e) {
      // try the next candidate
    }
  }
  if (!done) results[slug] = "FAILED"
}
console.log(JSON.stringify(results, null, 2))
