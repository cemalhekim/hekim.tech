// Companies and institutions shown in the two-row logo marquee under the home hero:
// employers (src/content/work), universities (src/content/education), BAM project
// partners and the organisations behind CV projects and certificates (vault Resume/ notes).
// logo: file in public/logos, drawn as a one-colour CSS mask so it follows the theme
// (raster files carry the logo only in their alpha channel, brightness mapped to opacity);
// ratio: width / height of that file's viewBox or pixels; brand: hover colour in the
// light theme; scale: size multiplier for compact marks or small type; wordmark: two
// text lines set next to a mark that carries no name. Entries without a logo render as text.
export type Affiliation = {
  name: string
  logo?: string
  ratio?: number
  brand?: string
  scale?: number
  wordmark?: [string, string]
}

// Row 1: industry and employers. Row 2: universities, research and projects.
export const AFFILIATION_ROWS: Affiliation[][] = [
  [
    { name: "Vodafone", logo: "vodafone.svg", ratio: 4.035, brand: "#e60000" },
    { name: "Bundesanstalt für Materialforschung und -prüfung (BAM)", logo: "bam.png", ratio: 1.406, brand: "#00283a", scale: 1.7 },
    { name: "Mercedes-Benz", logo: "mercedes-benz.svg", ratio: 8.69, brand: "#000000" },
    { name: "Atotech, an MKS brand", logo: "atotech.svg", ratio: 4.925, brand: "#e20030" },
    { name: "Bosch", logo: "bosch.svg", ratio: 4.465, brand: "#ea0016" },
    { name: "MKS Instruments", logo: "mks.svg", ratio: 3.245, brand: "#305c98" },
    { name: "Koç Oto", logo: "kocoto.png", ratio: 4.744, brand: "#7ac011" },
    { name: "Rosenxt", logo: "rosenxt.svg", ratio: 6.935, brand: "#2bb8be" },
    { name: "Vareint Engineering Services", logo: "vareint.png", ratio: 1.048, brand: "#c52a2a", wordmark: ["Vareint", "Engineering Services"] },
    { name: "TEKNOFEST", logo: "teknofest.png", ratio: 1.34, brand: "#d4141c", scale: 1.35 },
    { name: "The Construct" },
  ],
  [
    { name: "Technische Universität Berlin", logo: "tu-berlin.png", ratio: 2.878, brand: "#c50e1f" },
    { name: "Fraunhofer IPK", logo: "fraunhofer-ipk.png", ratio: 3.66, brand: "#179c7d" },
    { name: "Politecnico di Milano", logo: "polimi.svg", ratio: 3.5, brand: "#102c53" },
    { name: "Fraunhofer IFAM", logo: "fraunhofer-ifam.png", ratio: 3.784, brand: "#179c7d" },
    { name: "NTNU", logo: "ntnu.svg", ratio: 5.425, brand: "#00509e" },
    { name: "EU-MACE, COST Action CA22123", logo: "eu-mace.png", ratio: 1.655, brand: "#259782", scale: 1.2 },
    { name: "DHBW Mannheim", logo: "dhbw.png", ratio: 2.057, brand: "#c90119", scale: 1.5 },
    { name: "Reincarnate (Horizon Europe)", logo: "reincarnate.png", ratio: 4.72, brand: "#16a34a" },
    { name: "ENHANCE Alliance" },
    { name: "Türkisch-Deutsche Universität", logo: "tau.png", ratio: 4.35, brand: "#3b555e" },
    { name: "Corvus Aerospace", logo: "corvus.png", ratio: 1, brand: "#0047ab", scale: 1.1, wordmark: ["Corvus", "Aerospace"] },
    { name: "Başkent Üniversitesi", logo: "baskent.svg", ratio: 1.14, brand: "#dd2027", scale: 1.35 },
  ],
]
