import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    papers: z
      .array(
        z.object({
          title: z.string(),
          authors: z.string().optional(),
          venue: z.string().optional(),
          year: z.union([z.string(), z.number()]).optional(),
          url: z.string().optional(),
        })
      )
      .default([]),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
    heroKicker: z.string().optional(),
  }),
});

export const collections = { blog };
