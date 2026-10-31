import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInstance } from '../config/instance.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const design = JSON.parse(await readFile(join(root, 'editorial/DESIGN_SYSTEM.json'), 'utf8'));
const instance = loadInstance();
const { palette, type } = design;
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const faviconLetter = escapeXml(instance.identity.wordmarkAccent[0].toUpperCase());
const declarations = [
  ...Object.entries(palette).map(([key, value]) => `  --${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value};`),
  ...Object.entries(type).map(([key, value]) => `  --font-${key}: ${value};`)
];
await writeFile(join(root, 'src/styles/design-tokens.css'), `/* Generated from editorial/DESIGN_SYSTEM.json. */\n:root {\n${declarations.join('\n')}\n}\n`);
await writeFile(join(root, 'public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title"><title id="title">${escapeXml(instance.site.title)}</title><rect width="64" height="64" fill="${palette.cyan}"/><path d="M4 4h12v56H4z" fill="${palette.ink}"/><path d="M16 4v56M17 4v5h2v5h-2v6h2v5h-2v6h2v5h-2v7h2v5h-2v8h2" fill="none" stroke="${palette.paper}" stroke-width="2"/><text x="25" y="44" fill="${palette.ink}" font-family="Georgia,serif" font-size="35" font-style="italic" font-weight="bold">${faviconLetter}</text></svg>\n`);
console.log('Rendered design tokens and favicon.');
