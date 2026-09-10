// Publications, theses and conference appearances for the home page, newest first.
// Facts from the vault Resume/ notes (TU Berlin Reincarnate § Publications, BAM Lab
// Automation, Vareint Engineering Services). The corrosion manuscript is a draft with no
// journal named, so it may only ever say "in preparation". Titles stay in the original.
import type { Lang } from "@i18n"

export type PublicationKind = "paper" | "thesis" | "manuscript" | "ack" | "conferences"
export type Publication = {
  year: string
  kind: PublicationKind
  title: string
  venue: string
  note: Record<Lang, string>
  href?: string
}

export const PUBLICATIONS: Publication[] = [
  {
    year: "2025",
    kind: "paper",
    title: "Beyond Corrosion: Autonomous Real-Time Detection of Structural Cracks and Degradation Using Robotic Sensing and Digital Twins",
    venue: "NDTCE 2025, Izmir",
    note: {
      en: "Co-author. My part is the wall-climbing inspection robot that carries the RGB, thermal and gas sensors.",
      de: "Mitautor. Mein Teil ist der wandkletternde Inspektionsroboter, der RGB-, Wärmebild- und Gassensorik trägt.",
      tr: "Ortak yazar. Benim payım RGB, termal ve gaz sensörlerini taşıyan duvar tırmanan muayene robotu.",
    },
    href: "https://www.reincarnate-project.eu/beyond-corrosion-ai-robotics-for-smarter-infrastructure-inspection-at-ndtce-2025/",
  },
  {
    year: "2025",
    kind: "thesis",
    title: "LLM-Guided Robot Control System for On-Demand Task Planning and Execution in Self-Driving Environments",
    venue: "TU Berlin · BAM",
    note: {
      en: "A local LLM agent drives a UFactory xArm 6 lab cell; 148 of 150 simulated requests executed correctly.",
      de: "Ein lokaler LLM-Agent steuert eine Laborzelle mit UFactory xArm 6; 148 von 150 simulierten Anfragen korrekt ausgeführt.",
      tr: "Yerel bir LLM ajanı UFactory xArm 6 laboratuvar hücresini sürüyor; 150 simüle istekten 148'i doğru yürütüldü.",
    },
  },
  {
    year: "2026",
    kind: "manuscript",
    title: "Design of a “frugal” Automated Long-Term Corrosion Testing Setup Based on a Modified FDM 3D Printer",
    venue: "BAM",
    note: {
      en: "First author. A converted FDM printer measured 8 samples for 28 days unattended, with 224 of 224 electrical contacts made.",
      de: "Erstautor. Ein umgebauter FDM-Drucker hat 8 Proben 28 Tage lang unbeaufsichtigt gemessen, 224 von 224 Kontaktierungen erfolgreich.",
      tr: "Birinci yazar. Dönüştürülmüş bir FDM yazıcı 8 numuneyi 28 gün boyunca gözetimsiz ölçtü; 224 temasın 224'ü başarılı.",
    },
  },
  {
    year: "2024",
    kind: "ack",
    title: "Robotic Disassembly and Window Upgrading",
    venue: "35. Forum Bauinformatik, Hamburg",
    note: {
      en: "Thanked by name for the robotic automation: UR10e disassembly with a custom 3D-printed gripper.",
      de: "Namentlich gedankt für die Roboterautomatisierung: Demontage mit einem UR10e und einem eigens gedruckten Greifer.",
      tr: "Robotik otomasyon için adıyla teşekkür edildi: UR10e ile söküm, özel tasarım 3B baskı tutucu.",
    },
    href: "https://doi.org/10.15480/882.13535",
  },
  {
    year: "2022–23",
    kind: "conferences",
    title: "Vareint Engineering Services",
    venue: "Dubai",
    note: {
      en: "Represented the start-up at five-plus industry conferences; three customer contracts signed.",
      de: "Das Start-up auf mehr als fünf Branchenkonferenzen vertreten; drei Kundenverträge abgeschlossen.",
      tr: "Girişimi beşten fazla sektör konferansında temsil ettim; üç müşteri sözleşmesi imzalandı.",
    },
  },
]
