import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const issueDir = process.env.INBOX_RIOT_ISSUES_DIR ?? fileURLToPath(new URL('../src/data/issues/', import.meta.url));
const images = new Map();
for (const name of (await readdir(issueDir)).filter((file) => file.endsWith('.json'))) {
  const issue = JSON.parse(await readFile(join(issueDir, name), 'utf8'));
  for (const story of issue.stories) if (story.image?.kind === 'source') images.set(story.image.src, story.id);
}

const failures = [];
await Promise.all([...images].map(async ([url, id]) => {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-31' },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) failures.push(`${id}: image returned ${response.status} ${response.headers.get('content-type') ?? 'unknown type'}`);
    await response.body?.cancel();
  } catch (error) { failures.push(`${id}: ${error.message}`); }
}));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Verified ${images.size} public source images.`);
