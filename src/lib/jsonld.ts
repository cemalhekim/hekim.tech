// schema.org structured data for the home page: who the site is about (Person), the site
// itself (WebSite) and the page as his profile (ProfilePage). Search engines read it for
// name queries; nothing here is rendered.
import { SITE, SOCIALS } from "@consts"
import type { Lang } from "@i18n"

const ORIGIN = "https://hekim.tech"
const PERSON_ID = `${ORIGIN}/#person`

export function personJsonLd(lang: Lang, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE.AUTHOR,
        givenName: "Cemal",
        familyName: "Hekim",
        url: `${ORIGIN}/`,
        email: "mailto:cemal@hekim.tech",
        jobTitle: "Robotics Engineer",
        description: SITE.DESCRIPTION,
        worksFor: { "@type": "Organization", name: "Vodafone GmbH", url: "https://www.vodafone.de" },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Technische Universität Berlin", url: "https://www.tu.berlin" },
          { "@type": "CollegeOrUniversity", name: "Türkisch-Deutsche Universität", url: "https://www.tau.edu.tr" },
        ],
        homeLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" } },
        knowsLanguage: ["tr", "en", "de"],
        knowsAbout: [
          "Robotics",
          "Humanoid robots",
          "Industrial automation",
          "Laboratory automation",
          "LLM agents",
          "ROS 2",
          "Computer vision",
          "Mechatronics",
        ],
        sameAs: SOCIALS.filter((s) => s.HREF.startsWith("https://")).map((s) => s.HREF),
      },
      {
        "@type": "WebSite",
        "@id": `${ORIGIN}/#website`,
        url: `${ORIGIN}/`,
        name: SITE.TITLE,
        inLanguage: ["en", "de", "tr"],
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        url: pageUrl,
        inLanguage: lang,
        mainEntity: { "@id": PERSON_ID },
        isPartOf: { "@id": `${ORIGIN}/#website` },
      },
    ],
  }
}
