import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Cemal Hekim",
  DESCRIPTION: "Robotics engineer in Berlin and Düsseldorf. Humanoids, lab automation cells and LLM agents that drive real hardware.",
  AUTHOR: "Cemal Hekim",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work and Education History",
  DESCRIPTION: "Where I have worked and studied, newest first.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Notes",
  DESCRIPTION: "Write-ups on robots, agents and the homelab that runs this site.",
}

// Projects Page
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Robots, retrofits, agents and tools I have built.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search notes and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { TEXT: "Home", HREF: "/" },
  { TEXT: "Experience", HREF: "/work" },
  { TEXT: "Projects", HREF: "/projects" },
  { TEXT: "Notes", HREF: "/blog" },
]

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Email",
    ICON: "email",
    TEXT: "cemal@hekim.tech",
    HREF: "mailto:cemal@hekim.tech",
  },
  {
    NAME: "GitHub",
    ICON: "github",
    TEXT: "cemalhekim",
    HREF: "https://github.com/cemalhekim",
  },
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "cemalhekim",
    HREF: "https://www.linkedin.com/in/cemalhekim/",
  },
]
