// Renders public/open-graph.jpg (1200x630) from an inline SVG with sharp.
// Run: node scripts/og.mjs
import sharp from "sharp"
import { writeFileSync } from "node:fs"

const W = 1200
const H = 630
const accent = "#22d3ee"

const gridLines = []
for (let x = 0; x <= W; x += 48) gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`)
for (let y = 0; y <= H; y += 48) gridLines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" />`)

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="v" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="${W}" height="${H}" fill="url(#v)"/></mask>
    <radialGradient id="halo">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#070a0f"/>
  <g stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" mask="url(#m)">${gridLines.join("")}</g>

  <!-- manipulator glyph, right side -->
  <g transform="translate(760 90) scale(17)" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 21h9"/><path d="M8.5 21v-4"/><path d="M8.5 17 12 9"/><path d="M12 9l7-3"/><path d="M19 6l1.5-2.5M19 6l2.5 1"/>
  </g>
  <g fill="${accent}" transform="translate(760 90) scale(17)">
    <circle cx="8.5" cy="17" r="1.4"/><circle cx="12" cy="9" r="1.4"/><circle cx="19" cy="6" r="1.2"/>
  </g>
  <circle cx="1083" cy="192" r="120" fill="url(#halo)"/>

  <g font-family="DejaVu Sans Mono, Menlo, monospace">
    <circle cx="86" cy="150" r="6" fill="${accent}"/>
    <text x="104" y="156" font-size="20" fill="${accent}" letter-spacing="4">ROBOTICS // AI AUTOMATION // AGENTS</text>
  </g>
  <g font-family="DejaVu Sans, Helvetica, Arial, sans-serif" fill="#ffffff">
    <text x="80" y="290" font-size="76" font-weight="700">I build robots</text>
    <text x="80" y="376" font-size="76" font-weight="700">and the AI that runs them.</text>
    <text x="80" y="450" font-size="28" fill="#ffffff" fill-opacity="0.7">Cemal Hekim · Robotics engineer · Berlin / Düsseldorf</text>
  </g>
  <g font-family="DejaVu Sans Mono, Menlo, monospace" font-size="20" fill="${accent}">
    <text x="80" y="560">hekim.tech</text>
  </g>
</svg>`

writeFileSync("/tmp/og.svg", svg)
const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile("public/open-graph.jpg")
console.log(`wrote public/open-graph.jpg ${buf.width}x${buf.height} ${buf.size} bytes`)
