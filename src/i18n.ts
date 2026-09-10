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
export const TRANSLATED_PATHS = ["/", "/history", "/history/"]

const en = {
  nav: { home: "Home", work: "History", projects: "Projects" },
  now: "Now",
  footer: { tagline: "Static site, self-hosted, no trackers.", status: "All systems nominal", top: "Back to top", terms: "Terms", privacy: "Privacy" },
  home: {
    title: "Home",
    eyebrow: "Robotics // AI automation // Agents",
    h1: "I build robots and the AI that runs them.",
    lead: "Cemal Hekim. Robotics engineer in Berlin and Düsseldorf: humanoids, lab automation cells and LLM agents that drive real hardware.",
    ctaProjects: "Projects", ctaWork: "History",
    aboutLabel: "About",
    about: [
      "I am a robotics engineer and a master's student in Computational Engineering Science at TU Berlin, focusing on robotics and mechatronics; I did my bachelor's there too, with a thesis that connected a local language model to a robot arm in a lab cell. I work on the parts that decide whether a robot is usable: kinematics, control and safety limits for industrial arms and humanoids, simulation in MuJoCo and Gazebo before the real robot moves, and the Python, C++ and ROS 2 code in between. At Vodafone's 5G lab in Düsseldorf I build telemetry, safe control and voice interaction for a Unitree H1-2 humanoid and a SoftBank Pepper. Before that I automated corrosion measurements at BAM, recycling processes with UR10e and ABB arms at TU Berlin and ABB spot-welding cells in automotive production, and co-founded a small automation company in Dubai.",
    ],
    whatLabel: "What I do", whatTitle: "From joint torque to language model", module: "module",
    caps: [
      { title: "Humanoids & manipulation", text: "Telemetry, teleoperation and control stacks for humanoids and arms: Unitree H1-2, Franka Panda, UR5e/UR10e, xArm." },
      { title: "Lab & process automation", text: "Robot cells that run unattended: sample handling, 28-day measurement campaigns, welding and QC lines." },
      { title: "AI agents on real hardware", text: "LLM agents that plan tasks, drive devices and talk to people, from a bilingual Pepper to a lab-wide agent platform." },
      { title: "Tooling & infrastructure", text: "The stack around the robots: AI-assisted CAD, web dashboards, containers and the home server that serves this page." },
    ],
    intlLabel: "Being international", intlTitle: "International Sailor",
    intlText: "Eight cities so far, from the Gulf to the Rhine. Fluent in Turkish, English and German.",
    outro: "So many coworkers and so many projects from all around the world: {cities}. Maybe yours can be the next.",
    projectsLabel: "Projects", projectsTitle: "Recent builds", allProjects: "All projects →",
    stackLabel: "Stack", stackTitle: "Tools and platforms",
    stackGroups: { languages: "Languages", robotics: "Robotics & simulation", ai: "AI & ML", vision: "Vision & speech", cad: "CAD & fabrication", embedded: "Embedded", web: "Web & apps", infra: "Infra & DevOps", tools: "Everyday tools" },
    logosLabel: "Worked, studied and built with",
    availability: "Available from April 2027 · full-time robotics roles",
    ctaCall: "Book a call",
    callSubject: "Call request via hekim.tech",
    callBody: "Hi Cemal,\n\nI would like to talk about:\n\nTimes that work for me (with time zone):\n",
    callNote: "Video or phone. Send a few time slots and a line on the topic.",
    numbersLabel: "In numbers",
    pubsLabel: "Publications & talks", pubsTitle: "Papers, theses and conferences",
    pubKinds: { paper: "Conference paper", thesis: "Bachelor's thesis", manuscript: "Manuscript in preparation", ack: "Acknowledgement", conferences: "Industry conferences" },
    numbers: { orgs: "companies & institutions", robots: "robot models, hands-on", roles: "roles in 3 countries" },
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
  nav: { home: "Start", work: "Werdegang", projects: "Projekte" },
  now: "Heute",
  footer: { tagline: "Statische Seite, selbst gehostet, keine Tracker.", status: "Alle Systeme normal", top: "Nach oben", terms: "Nutzungsbedingungen", privacy: "Datenschutz" },
  home: {
    title: "Start",
    eyebrow: "Robotik // KI-Automatisierung // Agenten",
    h1: "Ich baue Roboter und die KI, die sie steuert.",
    lead: "Cemal Hekim. Robotik-Ingenieur in Berlin und Düsseldorf: Humanoide, Laborautomatisierung und LLM-Agenten, die echte Hardware bewegen.",
    ctaProjects: "Projekte", ctaWork: "Werdegang",
    aboutLabel: "Über mich",
    about: [
      "Ich bin Robotik-Ingenieur und studiere im Master Computational Engineering Science an der TU Berlin mit Schwerpunkt Robotik und Mechatronik; auch meinen Bachelor habe ich dort gemacht, mit einer Abschlussarbeit, die ein lokales Sprachmodell mit einem Roboterarm in einer Laborzelle verbunden hat. Ich arbeite an den Teilen, die entscheiden, ob ein Roboter brauchbar ist: Kinematik, Regelung und Sicherheitsgrenzen für Industriearme und Humanoide, Simulation in MuJoCo und Gazebo, bevor sich der echte Roboter bewegt, und der Python-, C++- und ROS-2-Code dazwischen. Im 5G-Labor von Vodafone in Düsseldorf baue ich Telemetrie, abgesicherte Steuerung und Sprachinteraktion für einen Unitree-H1-2-Humanoiden und einen SoftBank Pepper. Davor habe ich an der BAM Korrosionsmessungen automatisiert, an der TU Berlin Recyclingprozesse mit UR10e- und ABB-Armen und in der Automobilfertigung ABB-Punktschweißzellen, und in Dubai eine kleine Automatisierungsfirma mitgegründet.",
    ],
    whatLabel: "Was ich mache", whatTitle: "Vom Gelenkmoment bis zum Sprachmodell", module: "Modul",
    caps: [
      { title: "Humanoide & Manipulation", text: "Telemetrie, Teleoperation und Regelungs-Stacks für Humanoide und Arme: Unitree H1-2, Franka Panda, UR5e/UR10e, xArm." },
      { title: "Labor- & Prozessautomatisierung", text: "Roboterzellen, die unbeaufsichtigt laufen: Probenhandling, 28-tägige Messkampagnen, Schweiß- und QC-Linien." },
      { title: "KI-Agenten auf echter Hardware", text: "LLM-Agenten, die Aufgaben planen, Geräte steuern und mit Menschen sprechen, vom zweisprachigen Pepper bis zur laborweiten Agentenplattform." },
      { title: "Tooling & Infrastruktur", text: "Der Stack um die Roboter herum: KI-gestütztes CAD, Web-Dashboards, Container und der Homeserver, der diese Seite ausliefert." },
    ],
    intlLabel: "International unterwegs", intlTitle: "International Sailor",
    intlText: "Bisher acht Städte, vom Golf bis zum Rhein. Fließend Türkisch, Englisch und Deutsch.",
    outro: "So viele Kolleginnen, Kollegen und Projekte aus aller Welt: {cities}. Vielleicht ist deins das nächste.",
    projectsLabel: "Projekte", projectsTitle: "Neueste Builds", allProjects: "Alle Projekte →",
    stackLabel: "Stack", stackTitle: "Tools und Plattformen",
    stackGroups: { languages: "Sprachen", robotics: "Robotik & Simulation", ai: "KI & ML", vision: "Bildverarbeitung & Sprache", cad: "CAD & Fertigung", embedded: "Embedded", web: "Web & Apps", infra: "Infra & DevOps", tools: "Alltagswerkzeuge" },
    logosLabel: "Gearbeitet, studiert und entwickelt mit",
    availability: "Ab April 2027 verfügbar · Vollzeit in der Robotik",
    ctaCall: "Gespräch vereinbaren",
    callSubject: "Gesprächsanfrage über hekim.tech",
    callBody: "Hallo Cemal,\n\nIch möchte gern sprechen über:\n\nMögliche Termine (mit Zeitzone):\n",
    callNote: "Video oder Telefon. Schick ein paar Zeitfenster und eine Zeile zum Thema.",
    numbersLabel: "In Zahlen",
    pubsLabel: "Publikationen & Vorträge", pubsTitle: "Paper, Abschlussarbeiten und Konferenzen",
    pubKinds: { paper: "Konferenzbeitrag", thesis: "Bachelorarbeit", manuscript: "Manuskript in Vorbereitung", ack: "Danksagung", conferences: "Branchenkonferenzen" },
    numbers: { orgs: "Unternehmen & Institutionen", robots: "Robotermodelle im Einsatz", roles: "Stationen in 3 Ländern" },
    robotsLabel: "Roboter", robotsTitle: "Roboter, mit denen ich gearbeitet habe",
    robotGroups: { industrial: "Industrieroboter", cobots: "Cobots", humanoids: "Humanoide", own: "Eigenbauten" },
    notesLabel: "Notizen", notesTitle: "Neueste Beiträge", allNotes: "Alle Notizen →",
    contactLabel: "Kontakt", contactTitle: "Offen für Robotik-Jobs in Deutschland",
    contactText: "E-Mail ist der schnellste Weg. Gern über Humanoide, Automatisierungszellen oder Agenten, die echte Hardware anfassen müssen.",
  },
  work: { title: "Beruflicher und akademischer Werdegang", description: "Wo ich gearbeitet und studiert habe, neueste zuerst.", label: "Werdegang", work: "Berufserfahrung", education: "Ingenieurausbildung" },
}

const tr: Dict = {
  nav: { home: "Ana sayfa", work: "Geçmiş", projects: "Projeler" },
  now: "Şimdi",
  footer: { tagline: "Statik site, kendi sunucumda, izleyici yok.", status: "Tüm sistemler normal", top: "Yukarı", terms: "Koşullar", privacy: "Gizlilik" },
  home: {
    title: "Ana sayfa",
    eyebrow: "Robotik // Yapay zekâ otomasyonu // Ajanlar",
    h1: "Robotlar ve onları çalıştıran yapay zekâyı yapıyorum.",
    lead: "Cemal Hekim. Berlin ve Düsseldorf'ta robotik mühendisi: insansı robotlar, laboratuvar otomasyon hücreleri ve gerçek donanımı süren LLM ajanları.",
    ctaProjects: "Projeler", ctaWork: "Geçmiş",
    aboutLabel: "Hakkımda",
    about: [
      "Robotik mühendisiyim ve TU Berlin'de robotik ve mekatronik odaklı Computational Engineering Science yüksek lisansı yapıyorum; lisansımı da orada, yerel bir dil modelini bir laboratuvar hücresindeki robot kola bağlayan bir tezle tamamladım. Bir robotun işe yarayıp yaramayacağını belirleyen kısımlarda çalışıyorum: endüstriyel kollar ve insansı robotlar için kinematik, kontrol ve güvenlik sınırları, gerçek robot hareket etmeden önce MuJoCo ve Gazebo'da simülasyon ve aradaki Python, C++ ve ROS 2 kodu. Vodafone'un Düsseldorf'taki 5G laboratuvarında bir Unitree H1-2 insansı robotu ve bir SoftBank Pepper için telemetri, güvenli kontrol ve sesli etkileşim geliştiriyorum. Öncesinde BAM'da korozyon ölçümlerini, TU Berlin'de UR10e ve ABB kollarıyla geri dönüşüm süreçlerini ve otomotiv üretiminde ABB punta kaynak hücrelerini otomatikleştirdim; Dubai'de de küçük bir otomasyon şirketinin kurucu ortağı oldum.",
    ],
    whatLabel: "Ne yapıyorum", whatTitle: "Eklem torkundan dil modeline", module: "modül",
    caps: [
      { title: "İnsansı robotlar ve manipülasyon", text: "İnsansı robotlar ve kollar için telemetri, uzaktan kumanda ve kontrol yığınları: Unitree H1-2, Franka Panda, UR5e/UR10e, xArm." },
      { title: "Laboratuvar ve süreç otomasyonu", text: "Gözetimsiz çalışan robot hücreleri: numune taşıma, 28 günlük ölçüm kampanyaları, kaynak ve kalite kontrol hatları." },
      { title: "Gerçek donanımda yapay zekâ ajanları", text: "Görev planlayan, cihazları süren ve insanlarla konuşan LLM ajanları; iki dilli Pepper'dan laboratuvar çapında bir ajan platformuna." },
      { title: "Araçlar ve altyapı", text: "Robotların etrafındaki yığın: yapay zekâ destekli CAD, web panelleri, konteynerler ve bu sayfayı sunan ev sunucusu." },
    ],
    intlLabel: "Uluslararası", intlTitle: "International Sailor",
    intlText: "Şimdiye kadar sekiz şehir, Körfez'den Ren'e. Akıcı Türkçe, İngilizce ve Almanca.",
    outro: "Dünyanın dört bir yanından bir sürü iş arkadaşı ve proje: {cities}. Belki bir sonraki seninkidir.",
    projectsLabel: "Projeler", projectsTitle: "Son yapılanlar", allProjects: "Tüm projeler →",
    stackLabel: "Yığın", stackTitle: "Araçlar ve platformlar",
    stackGroups: { languages: "Diller", robotics: "Robotik ve simülasyon", ai: "Yapay zekâ ve ML", vision: "Görü ve konuşma", cad: "CAD ve üretim", embedded: "Gömülü", web: "Web ve uygulamalar", infra: "Altyapı ve DevOps", tools: "Günlük araçlar" },
    logosLabel: "Çalıştığım ve okuduğum kurumlar",
    availability: "Nisan 2027'den itibaren müsait · tam zamanlı robotik pozisyonları",
    ctaCall: "Görüşme ayarla",
    callSubject: "hekim.tech üzerinden görüşme talebi",
    callBody: "Merhaba Cemal,\n\nKonuşmak istediğim konu:\n\nBana uyan zamanlar (saat dilimiyle):\n",
    callNote: "Görüntülü ya da telefonla. Birkaç uygun zaman ve konuyu anlatan bir satır göndermen yeterli.",
    numbersLabel: "Rakamlarla",
    pubsLabel: "Yayınlar ve konuşmalar", pubsTitle: "Makaleler, tezler ve konferanslar",
    pubKinds: { paper: "Konferans bildirisi", thesis: "Lisans tezi", manuscript: "Hazırlanan makale", ack: "Teşekkür", conferences: "Sektör konferansları" },
    numbers: { orgs: "şirket ve kurum", robots: "üzerinde çalıştığım robot modeli", roles: "pozisyon, 3 ülkede" },
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
