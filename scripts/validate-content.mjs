import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const issueDirectory = process.env.INBOX_RIOT_ISSUES_DIR ?? fileURLToPath(new URL('../src/data/issues/', import.meta.url));
const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
const { art } = JSON.parse(await readFile(new URL('../editorial/DESIGN_SYSTEM.json', import.meta.url), 'utf8'));
const trackingParameter = /^(utm_.+|fbclid|gclid|mc_cid|mc_eid|ref_src|token|auth|key|signature|session|recipient|subscriber|email)$/i;
const privateText = [
  /https?:\/\/(?:mail\.google\.com|gmail\.com)\//i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:password|passcode|api[_ -]?key|secret|cvv|one[- ]time code)\s*[:=]\s*\S+/i,
  /\b(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{12,}\b/,
  /\b[0-9a-f]{16}\b/i,
  /\bFR\d{2}(?:\s?\d{4}){5}\s?\d{3}\b/i
];

function hasCardNumber(text) {
  for (const candidate of text.match(/(?:\d[ -]?){13,19}/g) ?? []) {
    const digits = candidate.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) continue;
    let sum = 0;
    let double = false;
    for (let index = digits.length - 1; index >= 0; index--) {
      let value = Number(digits[index]);
      if (double) { value *= 2; if (value > 9) value -= 9; }
      sum += value;
      double = !double;
    }
    if (sum % 10 === 0) return true;
  }
  return false;
}

function normalizedUrl(value) {
  const url = new URL(value);
  url.searchParams.sort();
  return `${url.origin}${url.pathname.replace(/\/$/, '')}${url.search}`;
}

function canonicalUrl(value, id, kind, errors) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') errors.push(`Non-HTTPS ${kind}: ${id}`);
    if (url.hostname === 'c.gle' || /\/(?:redirect|click|track|unsubscribe)(?:\/|$)/i.test(url.pathname) || url.username || url.password || url.pathname.split('/').some((segment) => segment.length > 120)) errors.push(`Tracked redirect or private URL is not a canonical ${kind}: ${id}`);
    if ([...url.searchParams.keys()].some((key) => trackingParameter.test(key))) errors.push(`Tracking or private URL parameter: ${id}`);
    return normalizedUrl(value);
  } catch { errors.push(`Invalid ${kind} URL: ${id}`); return null; }
}

function validateImage(image, id, edition, errors) {
  if (!image) return;
  if (!image.alt?.trim() || !image.credit?.trim() || !image.rights?.trim()) errors.push(`Image needs alt text, credit, and rights: ${id}`);
  if (image.kind === 'original') {
    if (!/^assets\/[a-z0-9/_-]+\.(?:svg|png|jpe?g|webp)$/i.test(image.src ?? '') || image.src.includes('..')) errors.push(`Original image needs a local asset: ${id}`);
    if (image.motif && (!image.label?.trim() || image.label.length > 22)) errors.push(`Generated art needs a short label: ${id}`);
    if (edition > 1 && image.motif && !image.artStyle) errors.push(`Generated art needs a template and palette: ${id}`);
    if (image.artStyle) {
      if (!image.motif || !/^assets\/art\/[a-z0-9-]+\.svg$/.test(image.src ?? '')) errors.push(`Art style needs a generated SVG motif: ${id}`);
      if (!art.templates.includes(image.artStyle.template)) errors.push(`Unknown art template: ${id}`);
      if (!Object.hasOwn(art.paletteSets, image.artStyle.palette)) errors.push(`Unknown art palette: ${id}`);
    }
  } else if (image.kind === 'source') {
    canonicalUrl(image.src, id, 'source image', errors);
    if (image.motif || image.label || image.artStyle) errors.push(`Source image cannot use generated art fields: ${id}`);
  } else errors.push(`Image kind must be original or source: ${id}`);
}

export function validateIssue(issue) {
  const errors = [];
  if (!Array.isArray(issue.stories) || issue.stories.length === 0) return ['Issue has no stories'];
  const ids = new Set();
  const urls = new Set();
  for (const story of issue.stories) {
    if (!story.id || !/^[a-z0-9-]+$/.test(story.id)) errors.push('Story has an invalid public id');
    if (ids.has(story.id)) errors.push(`Duplicate story id: ${story.id}`);
    ids.add(story.id);
    if (story.treatment && !['feature', 'brief'].includes(story.treatment)) errors.push(`Invalid story treatment: ${story.id}`);
    if (story.beat && !['engineering', 'economics', 'accountability', 'frontier', 'culture'].includes(story.beat)) errors.push(`Invalid story beat: ${story.id}`);
    if (story.section === 'reads' && !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(story.sourceLanguage ?? '')) errors.push(`Read needs a valid original-language tag: ${story.id}`);
    if (!story.takeaways?.length) errors.push(`No takeaways: ${story.id}`);
    if (Boolean(story.sourceUrl) === Boolean(story.emailReference)) errors.push(`Exactly one source required: ${story.id}`);
    const storyUrls = new Set();
    if (story.sourceUrl) {
      const canonical = canonicalUrl(story.sourceUrl, story.id, 'source', errors);
      if (canonical) {
        if (urls.has(canonical)) errors.push(`Duplicate source URL: ${story.id}`);
        urls.add(canonical);
        storyUrls.add(canonical);
      }
    }
    if (story.relatedLinks !== undefined && !Array.isArray(story.relatedLinks)) errors.push(`Related links must be a list: ${story.id}`);
    for (const link of Array.isArray(story.relatedLinks) ? story.relatedLinks : []) {
      if (!link?.label?.trim()) errors.push(`Related link needs a label: ${story.id}`);
      const canonical = canonicalUrl(link?.url, story.id, 'related link', errors);
      if (canonical && storyUrls.has(canonical)) errors.push(`Duplicate link in story: ${story.id}`);
      if (canonical) storyUrls.add(canonical);
    }
    validateImage(story.image, story.id, issue.edition, errors);
    if (story.image?.kind === 'source' && !story.sourceUrl) errors.push(`Source image needs a public story source: ${story.id}`);
  }
  if (!Array.isArray(issue.leadTopics) || issue.leadTopics.length < 1 || issue.leadTopics.length > 5) errors.push('Need 1–5 lead topics');
  const topicIds = new Set();
  for (const topic of issue.leadTopics ?? []) {
    if (!topic || !/^[a-z0-9-]+$/.test(topic.id ?? '')) errors.push('Lead topic has an invalid id');
    if (topicIds.has(topic.id)) errors.push(`Duplicate lead topic: ${topic.id}`);
    topicIds.add(topic.id);
    if (!topic.title?.trim() || !topic.claim?.trim() || !topic.whyItMatters?.trim() || !topic.uncertainty?.trim()) errors.push(`Lead topic needs title, claim, relevance, and uncertainty: ${topic.id}`);
    if (!topic.takeaway?.trim() || topic.takeaway.trim().length < 160) errors.push(`Lead topic needs a substantial takeaway: ${topic.id}`);
    validateImage(topic.image, topic.id, issue.edition, errors);
    if (topic.image?.kind === 'source') errors.push(`Lead topic art must be original: ${topic.id}`);
    if (!topic.storyIds?.length) errors.push(`Lead topic has no supporting stories: ${topic.id}`);
    if (new Set(topic.storyIds ?? []).size !== (topic.storyIds ?? []).length) errors.push(`Lead topic repeats a story: ${topic.id}`);
    for (const storyId of topic.storyIds ?? []) if (!ids.has(storyId)) errors.push(`Lead topic references a missing story: ${topic.id} → ${storyId}`);
  }
  const originalCount = (entries) => entries.filter((entry) => entry.image?.kind === 'original').length;
  const leads = issue.leadTopics ?? [];
  const generatedArt = [...leads, ...issue.stories].filter((entry) => entry.image?.kind === 'original' && entry.image.motif);
  if (issue.edition > 1 && generatedArt.length >= 3) {
    if (new Set(generatedArt.map((entry) => entry.image.artStyle?.template)).size < 2) errors.push('Issue art needs at least two templates');
    if (new Set(generatedArt.map((entry) => entry.image.artStyle?.palette)).size < 2) errors.push('Issue art needs at least two palettes');
  }
  if (originalCount(leads) < Math.ceil(leads.length * .75)) errors.push('Most lead topics need original art');
  const reads = issue.stories.filter((story) => story.section === 'reads');
  if (reads.length && originalCount(reads) < Math.min(8, Math.ceil(reads.length / 20))) errors.push('Reading Room needs article-specific original art');
  const signals = issue.stories.filter((story) => story.section === 'signals');
  if (signals.length && originalCount(signals) < Math.ceil(signals.length / 2)) errors.push('Signal Desk needs original art');
  for (const story of issue.stories.filter((entry) => entry.section === 'releases')) if (!story.image) errors.push(`Release needs an image: ${story.id}`);
  const text = JSON.stringify(issue);
  if (privateText.some((pattern) => pattern.test(text)) || hasCardNumber(text)) errors.push('Issue contains possible private data');
  return errors;
}

async function listFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(path));
    else result.push(path);
  }
  return result;
}

export async function validateDirectory(directory = issueDirectory, artifactDirectory) {
  const errors = [];
  const files = (await listFiles(directory)).filter((file) => file.endsWith('.json'));
  const publishedSources = new Map();
  const publishedEditions = new Map();
  const publishedDates = new Map();
  for (const file of files) {
    try {
      const issue = JSON.parse(await readFile(file, 'utf8'));
      errors.push(...validateIssue(issue).map((error) => `${relative(directory, file)}: ${error}`));
      for (const [map, value, label] of [[publishedEditions, issue.edition, 'edition'], [publishedDates, issue.date, 'date']]) {
        if (map.has(value)) errors.push(`${relative(directory, file)}: ${label} already published in ${map.get(value)}`);
        else map.set(value, relative(directory, file));
      }
      for (const entry of [...(issue.leadTopics ?? []), ...(issue.stories ?? [])]) {
        if (entry.image?.kind !== 'original' || !/^assets\/[a-z0-9/_-]+\.(?:svg|png|jpe?g|webp)$/i.test(entry.image.src ?? '')) continue;
        try { await access(resolve(publicDirectory, entry.image.src)); }
        catch { errors.push(`${relative(directory, file)}: original image asset is missing: ${entry.id}`); }
      }
      for (const story of issue.stories ?? []) {
        const key = story.sourceUrl
          ? `url:${normalizedUrl(story.sourceUrl)}`
          : `email:${story.sourceName?.trim().toLowerCase()}|${story.emailReference?.trim().toLowerCase()}`;
        if (publishedSources.has(key)) errors.push(`${relative(directory, file)}: source already published in ${publishedSources.get(key)}`);
        else publishedSources.set(key, relative(directory, file));
      }
    } catch (error) { errors.push(`${relative(directory, file)}: ${error.message}`); }
  }
  if (artifactDirectory) {
    for (const file of (await listFiles(artifactDirectory)).filter((path) => /\.(html|json|js|css|svg)$/.test(path))) {
      const content = await readFile(file, 'utf8');
      if (privateText.some((pattern) => pattern.test(content)) || hasCardNumber(content)) errors.push(`${relative(artifactDirectory, file)}: possible private data in build artifact`);
    }
  }
  return errors;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const errors = await validateDirectory(issueDirectory, process.argv[2]);
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Content validation passed.');
}
