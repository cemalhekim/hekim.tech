import { defineCollection, z } from "astro:content"

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
    de: z.string().optional(),
    tr: z.string().optional(),
  }),
})

const education = defineCollection({
  type: "content",
  schema: z.object({
    school: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
    muted: z.boolean().optional(),
    degrees: z.array(
      z.object({
        title: z.string(),
        dateStart: z.coerce.date().optional(),
        dateEnd: z.union([z.coerce.date(), z.string()]).optional(),
        muted: z.boolean().optional(),
      }),
    ),
    de: z.string().optional(),
    tr: z.string().optional(),
  }),
})

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
  }),
})

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
})

const legal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
})

export const collections = { work, education, blog, projects, legal }
