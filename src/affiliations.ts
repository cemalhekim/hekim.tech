// Companies and institutions shown in the logo marquee under the home hero:
// employers (src/content/work), universities (src/content/education) and the
// organisations behind CV projects and certificates (vault Resume/ notes).
// logo: file in public/logos, drawn as a one-colour CSS mask so it follows the theme;
// ratio: width / height of that file's viewBox or pixels; brand: hover colour in the
// light theme; scale: size multiplier for compact marks with fine detail.
// Entries without a logo render as a text wordmark.
export type Affiliation = { name: string; logo?: string; ratio?: number; brand?: string; scale?: number }

export const AFFILIATIONS: Affiliation[] = [
  { name: "Vodafone", logo: "vodafone.svg", ratio: 4.035, brand: "#e60000" },
  { name: "Bundesanstalt für Materialforschung und -prüfung (BAM)", logo: "bam.svg", ratio: 2.48, brand: "#0f2127" },
  { name: "Technische Universität Berlin", logo: "tu-berlin.svg", ratio: 1.365, brand: "#c50e1f" },
  { name: "Mercedes-Benz", logo: "mercedes-benz.svg", ratio: 8.69, brand: "#000000" },
  { name: "Koc Automotive" },
  { name: "Bosch", logo: "bosch.svg", ratio: 4.465, brand: "#ea0016" },
  { name: "Fraunhofer IPK", logo: "fraunhofer-ipk.png", ratio: 3.66, brand: "#179c7d" },
  { name: "Vareint Engineering Services" },
  { name: "Politecnico di Milano", logo: "polimi.svg", ratio: 3.5, brand: "#102c53" },
  { name: "NTNU", logo: "ntnu.svg", ratio: 5.425, brand: "#00509e" },
  { name: "ENHANCE Alliance" },
  { name: "Reincarnate (Horizon Europe)", logo: "reincarnate.png", ratio: 4.72, brand: "#16a34a" },
  { name: "Türkisch-Deutsche Universität", logo: "tau.png", ratio: 4.35, brand: "#3b555e" },
  { name: "Corvus Aerospace" },
  { name: "TEKNOFEST", logo: "teknofest.png", ratio: 1.34, brand: "#d4141c", scale: 1.35 },
  { name: "Başkent Üniversitesi", logo: "baskent.svg", ratio: 1.14, brand: "#dd2027", scale: 1.35 },
  { name: "The Construct" },
]
