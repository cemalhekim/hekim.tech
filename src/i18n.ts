// UI strings for the three site languages. Content articles (projects, notes)
// stay English; everything hand-written on the home, experience and chrome is here.
export const LOCALES = ["en", "de", "tr"] as const
export type Lang = (typeof LOCALES)[number]
export const DEFAULT_LANG: Lang = "en"

export function localePath(lang: Lang, path: string): string {
  return lang === DEFAULT_LANG ? path : `/${lang}${path === "/" ? "/" : path}`
}

// Strip a locale prefix from a pathname: "/de/work/" -> "/work/"
export function stripLocale(pathname: string): { lang: Lang; path: string } {
  const m = pathname.match(/^\/(de|tr)(\/.*)?$/)
  if (m) return { lang: m[1] as Lang, path: m[2] || "/" }
  return { lang: "en", path: pathname }
}

// Pages that exist in every language; everything else links back to the English page
export const TRANSLATED_PATHS = ["/", "/work", "/work/"]

const en = {
  nav: { home: "Home", work: "Experience", projects: "Projects", notes: "Notes" },
  now: "Now",
  footer: { tagline: "Static site, self-hosted, no trackers.", status: "All systems nominal", top: "Back to top", terms: "Terms", privacy: "Privacy" },
  home: {
    title: "Home",
    eyebrow: "Robotics // AI automation // Agents",
    h1: "I build robots and the AI that runs them.",
    lead: "Cemal Hekim. Robotics engineer in Berlin and Düsseldorf: humanoids, lab automation cells and LLM agents that drive real hardware.",
    ctaProjects: "Projects", ctaWork: "Experience", ctaContact: "Contact",
    aboutLabel: "About",
    about: [
      "I build <b>robots</b> and the <b>software around them</b>: humanoid telemetry and teleoperation, service-robot retrofits, lab automation cells, and LLM agents that drive all of it.",
      "I am a robotics engineering intern at Vodafone's Innovation Campus in Düsseldorf and a master's student in Computational Engineering Science at TU Berlin, specialising in robotics and mechatronics. Before that: a robot cell for autonomous sample handling at BAM, recycling automation with UR10e and ABB arms at TU Berlin, welding robots at Koç Automotive, and a small automation start-up in Dubai.",
      "Most of what I make ends up as a tool I keep using: an AI-assisted CAD workflow on FreeCAD, a job-search agent, a Telegram assistant, and the home server that serves this page. I like problems where the hardware, the control loop and the model have to agree.",
    ],
    whatLabel: "What I do", whatTitle: "From joint torque to language model", module: "module",
    caps: [
      { title: "Humanoids & manipulation", text: "Telemetry, teleoperation and control stacks for humanoids and arms: Unitree H1-2, Franka Panda, UR5e/UR10e, xArm." },
      { title: "Lab & process automation", text: "Robot cells that run unattended: sample handling, 30-hour measurement campaigns, welding and QC lines." },
      { title: "AI agents on real hardware", text: "LLM agents that plan tasks, drive devices and talk to people, from a bilingual Pepper to a lab-wide agent platform." },
      { title: "Tooling & infrastructure", text: "The stack around the robots: AI-assisted CAD, web dashboards, containers and the home server that serves this page." },
    ],
    intlLabel: "Being international", intlTitle: "International Sailor",
    intlText: "Eight cities so far, from the Gulf to the Rhine. Fluent in Turkish, English and German.",
    outro: "So many coworkers and so many projects from all around the world: {cities}. Maybe yours can be the next.",
    projectsLabel: "Projects", projectsTitle: "Recent builds", allProjects: "All projects →",
    stackLabel: "Stack", stackTitle: "Tools and platforms",
    stackGroups: { languages: "Languages", robotics: "Robotics & simulation", ai: "AI & ML", vision: "Vision & speech", cad: "CAD & fabrication", embedded: "Embedded", web: "Web & apps", infra: "Infra & DevOps", tools: "Everyday tools" },
    robotsLabel: "Robots", robotsTitle: "Robots I have worked with",
    robotGroups: { industrial: "Industrial arms", cobots: "Cobots", humanoids: "Humanoids", own: "Own builds" },
    notesLabel: "Notes", notesTitle: "Recent write-ups", allNotes: "All notes →",
    contactLabel: "Contact", contactTitle: "Open to robotics work in Germany",
    contactText: "Email is the fastest channel. Happy to talk humanoids, automation cells, or agents that need to touch real hardware.",
  },
  work: { title: "Work and Education History", description: "Where I have worked and studied, newest first.", label: "History", work: "Professional Experience", education: "Engineering Education" },
}

export type Dict = typeof en

const de: Dict = {
  nav: { home: "Start", work: "Erfahrung", projects: "Projekte", notes: "Notizen" },
  now: "Heute",
  footer: { tagline: "Statische Seite, selbst gehostet, keine Tracker.", status: "Alle Systeme normal", top: "Nach oben", terms: "Nutzungsbedingungen", privacy: "Datenschutz" },
  home: {
    title: "Start",
    eyebrow: "Robotik // KI-Automatisierung // Agenten",
    h1: "Ich baue Roboter und die KI, die sie steuert.",
    lead: "Cemal Hekim. Robotik-Ingenieur in Berlin und Düsseldorf: Humanoide, Laborautomatisierung und LLM-Agenten, die echte Hardware bewegen.",
    ctaProjects: "Projekte", ctaWork: "Erfahrung", ctaContact: "Kontakt",
    aboutLabel: "Über mich",
    about: [
      "Ich baue <b>Roboter</b> und die <b>Software drumherum</b>: Telemetrie und Teleoperation für Humanoide, Retrofits von Servicerobotern, Automatisierungszellen im Labor und LLM-Agenten, die all das steuern.",
      "Ich bin Robotik-Praktikant am Innovation Campus von Vodafone in Düsseldorf und Masterstudent in Computational Engineering Science an der TU Berlin mit Schwerpunkt Robotik und Mechatronik. Davor: eine Roboterzelle für autonomes Probenhandling an der BAM, Recycling-Automatisierung mit UR10e- und ABB-Armen an der TU Berlin, Schweißroboter bei Koç Automotive und ein kleines Automatisierungs-Start-up in Dubai.",
      "Das meiste, was ich baue, wird zu einem Werkzeug, das ich weiter benutze: ein KI-gestützter CAD-Workflow auf FreeCAD, ein Agent für die Jobsuche, ein Telegram-Assistent und der Homeserver, der diese Seite ausliefert. Ich mag Probleme, bei denen Hardware, Regelkreis und Modell zusammenpassen müssen.",
    ],
    whatLabel: "Was ich mache", whatTitle: "Vom Gelenkmoment bis zum Sprachmodell", module: "Modul",
    caps: [
      { title: "Humanoide & Manipulation", text: "Telemetrie, Teleoperation und Regelungs-Stacks für Humanoide und Arme: Unitree H1-2, Franka Panda, UR5e/UR10e, xArm." },
      { title: "Labor- & Prozessautomatisierung", text: "Roboterzellen, die unbeaufsichtigt laufen: Probenhandling, 30-Stunden-Messkampagnen, Schweiß- und QC-Linien." },
      { title: "KI-Agenten auf echter Hardware", text: "LLM-Agenten, die Aufgaben planen, Geräte steuern und mit Menschen sprechen, vom zweisprachigen Pepper bis zur laborweiten Agentenplattform." },
      { title: "Tooling & Infrastruktur", text: "Der Stack um die Roboter herum: KI-gestütztes CAD, Web-Dashboards, Container und der Homeserver, der diese Seite ausliefert." },
    ],
    intlLabel: "International unterwegs", intlTitle: "International Sailor",
    intlText: "Bisher acht Städte, vom Golf bis zum Rhein. Fließend Türkisch, Englisch und Deutsch.",
    outro: "So viele Kolleginnen, Kollegen und Projekte aus aller Welt: {cities}. Vielleicht ist deins das nächste.",
    projectsLabel: "Projekte", projectsTitle: "Neueste Builds", allProjects: "Alle Projekte →",
    stackLabel: "Stack", stackTitle: "Tools und Plattformen",
    stackGroups: { languages: "Sprachen", robotics: "Robotik & Simulation", ai: "KI & ML", vision: "Bildverarbeitung & Sprache", cad: "CAD & Fertigung", embedded: "Embedded", web: "Web & Apps", infra: "Infra & DevOps", tools: "Alltagswerkzeuge" },
    robotsLabel: "Roboter", robotsTitle: "Roboter, mit denen ich gearbeitet habe",
    robotGroups: { industrial: "Industrieroboter", cobots: "Cobots", humanoids: "Humanoide", own: "Eigenbauten" },
    notesLabel: "Notizen", notesTitle: "Neueste Beiträge", allNotes: "Alle Notizen →",
    contactLabel: "Kontakt", contactTitle: "Offen für Robotik-Jobs in Deutschland",
    contactText: "E-Mail ist der schnellste Weg. Gern über Humanoide, Automatisierungszellen oder Agenten, die echte Hardware anfassen müssen.",
  },
  work: { title: "Beruflicher und akademischer Werdegang", description: "Wo ich gearbeitet und studiert habe, neueste zuerst.", label: "Werdegang", work: "Berufserfahrung", education: "Ingenieurausbildung" },
}

const tr: Dict = {
  nav: { home: "Ana sayfa", work: "Deneyim", projects: "Projeler", notes: "Notlar" },
  now: "Şimdi",
  footer: { tagline: "Statik site, kendi sunucumda, izleyici yok.", status: "Tüm sistemler normal", top: "Yukarı", terms: "Koşullar", privacy: "Gizlilik" },
  home: {
    title: "Ana sayfa",
    eyebrow: "Robotik // Yapay zekâ otomasyonu // Ajanlar",
    h1: "Robotlar ve onları çalıştıran yapay zekâyı yapıyorum.",
    lead: "Cemal Hekim. Berlin ve Düsseldorf'ta robotik mühendisi: insansı robotlar, laboratuvar otomasyon hücreleri ve gerçek donanımı süren LLM ajanları.",
    ctaProjects: "Projeler", ctaWork: "Deneyim", ctaContact: "İletişim",
    aboutLabel: "Hakkımda",
    about: [
      "<b>Robotlar</b> ve <b>etrafındaki yazılımı</b> yapıyorum: insansı robotlar için telemetri ve uzaktan kumanda, servis robotu dönüşümleri, laboratuvar otomasyon hücreleri ve hepsini süren LLM ajanları.",
      "Vodafone'un Düsseldorf'taki Innovation Campus'ünde robotik mühendisliği stajyeriyim ve TU Berlin'de Computational Engineering Science yüksek lisansı yapıyorum; odağım robotik ve mekatronik. Öncesinde: BAM'da otonom numune taşıma için bir robot hücresi, TU Berlin'de UR10e ve ABB kollarıyla geri dönüşüm otomasyonu, Koç Otomotiv'de kaynak robotları ve Dubai'de küçük bir otomasyon girişimi.",
      "Yaptıklarımın çoğu kullanmaya devam ettiğim birer araca dönüşüyor: FreeCAD üzerinde yapay zekâ destekli bir CAD akışı, bir iş arama ajanı, bir Telegram asistanı ve bu sayfayı sunan ev sunucusu. Donanımın, kontrol döngüsünün ve modelin uyuşmak zorunda olduğu problemleri seviyorum.",
    ],
    whatLabel: "Ne yapıyorum", whatTitle: "Eklem torkundan dil modeline", module: "modül",
    caps: [
      { title: "İnsansı robotlar ve manipülasyon", text: "İnsansı robotlar ve kollar için telemetri, uzaktan kumanda ve kontrol yığınları: Unitree H1-2, Franka Panda, UR5e/UR10e, xArm." },
      { title: "Laboratuvar ve süreç otomasyonu", text: "Gözetimsiz çalışan robot hücreleri: numune taşıma, 30 saatlik ölçüm kampanyaları, kaynak ve kalite kontrol hatları." },
      { title: "Gerçek donanımda yapay zekâ ajanları", text: "Görev planlayan, cihazları süren ve insanlarla konuşan LLM ajanları; iki dilli Pepper'dan laboratuvar çapında bir ajan platformuna." },
      { title: "Araçlar ve altyapı", text: "Robotların etrafındaki yığın: yapay zekâ destekli CAD, web panelleri, konteynerler ve bu sayfayı sunan ev sunucusu." },
    ],
    intlLabel: "Uluslararası", intlTitle: "International Sailor",
    intlText: "Şimdiye kadar sekiz şehir, Körfez'den Ren'e. Akıcı Türkçe, İngilizce ve Almanca.",
    outro: "Dünyanın dört bir yanından bir sürü iş arkadaşı ve proje: {cities}. Belki bir sonraki seninkidir.",
    projectsLabel: "Projeler", projectsTitle: "Son yapılanlar", allProjects: "Tüm projeler →",
    stackLabel: "Yığın", stackTitle: "Araçlar ve platformlar",
    stackGroups: { languages: "Diller", robotics: "Robotik ve simülasyon", ai: "Yapay zekâ ve ML", vision: "Görü ve konuşma", cad: "CAD ve üretim", embedded: "Gömülü", web: "Web ve uygulamalar", infra: "Altyapı ve DevOps", tools: "Günlük araçlar" },
    robotsLabel: "Robotlar", robotsTitle: "Çalıştığım robotlar",
    robotGroups: { industrial: "Endüstriyel kollar", cobots: "Cobotlar", humanoids: "İnsansı robotlar", own: "Kendi yaptıklarım" },
    notesLabel: "Notlar", notesTitle: "Son yazılar", allNotes: "Tüm notlar →",
    contactLabel: "İletişim", contactTitle: "Almanya'da robotik işlerine açığım",
    contactText: "En hızlı kanal e-posta. İnsansı robotlar, otomasyon hücreleri ya da gerçek donanıma dokunması gereken ajanlar hakkında konuşmaktan memnun olurum.",
  },
  work: { title: "İş ve Eğitim Geçmişi", description: "Çalıştığım ve okuduğum yerler, yeniden eskiye.", label: "Geçmiş", work: "Profesyonel Deneyim", education: "Mühendislik Eğitimi" },
}

export const DICT: Record<Lang, Dict> = { en, de, tr }
export const LANG_LABEL: Record<Lang, string> = { en: "EN", de: "DE", tr: "TR" }
