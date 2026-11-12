import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo: z.string(), // "owner/name"
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

const studies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, studies };
