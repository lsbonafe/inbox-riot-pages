import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

declare const process: { env: Record<string, string | undefined> };

const image = z.object({
  kind: z.enum(['original', 'source']),
  src: z.string().min(1),
  alt: z.string().min(1),
  credit: z.string().min(1),
  rights: z.string().min(1),
  motif: z.string().optional(),
  label: z.string().optional(),
  artStyle: z.object({ template: z.string().min(1), palette: z.string().min(1) }).optional()
});

const story = z.object({
  id: z.string().min(1),
  section: z.enum(['reads', 'signals', 'releases', 'offers', 'noise']),
  sourceLanguage: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/).optional(),
  beat: z.enum(['engineering', 'economics', 'accountability', 'frontier', 'culture']).optional(),
  treatment: z.enum(['feature', 'brief']).optional(),
  headline: z.string().min(1),
  sourceName: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  emailReference: z.string().min(1).optional(),
  relatedLinks: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).optional(),
  takeaways: z.array(z.string().min(1)).min(1),
  whyItMatters: z.string().min(1),
  excerpt: z.string().optional(),
  image: image.optional()
}).refine((entry) => entry.section !== 'reads' || Boolean(entry.sourceLanguage), {
  message: 'Reads need a sourceLanguage tag'
}).refine((entry) => Boolean(entry.sourceUrl) !== Boolean(entry.emailReference), {
  message: 'Provide exactly one of sourceUrl or emailReference'
});

const issues = defineCollection({
  loader: glob({ base: process.env.INBOX_RIOT_ISSUES_DIR ?? './src/data/issues', pattern: '*.json' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    edition: z.number().int().positive(),
    dek: z.string().min(1),
    editorNote: z.string().min(1),
    leadTopics: z.array(z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string().min(1),
      claim: z.string().min(1),
      takeaway: z.string().min(160),
      whyItMatters: z.string().min(1),
      uncertainty: z.string().min(1),
      image: image.optional(),
      storyIds: z.array(z.string().min(1)).min(1)
    })).min(1).max(5),
    stories: z.array(story).min(1)
  })
});

export const collections = { issues };
