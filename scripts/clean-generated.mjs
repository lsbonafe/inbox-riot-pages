import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

for (const directory of ['../.astro/', '../dist/', '../node_modules/.astro/']) {
  await rm(fileURLToPath(new URL(directory, import.meta.url)), { recursive: true, force: true });
}
