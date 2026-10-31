import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { renderArt } from '../scripts/render-original-art.mjs';

const root = new URL('../', import.meta.url);
const read = async (path) => readFile(new URL(path, root), 'utf8');

test('one palette drives site tokens, favicon, and issue artwork', async () => {
  for (const script of ['scripts/render-design-system.mjs', 'scripts/render-original-art.mjs']) {
    const result = spawnSync(process.execPath, [new URL(script, root).pathname], { encoding: 'utf8', env: { ...process.env, INBOX_RIOT_CONFIG: new URL('config/example.json', root).pathname } });
    assert.equal(result.status, 0, result.stderr);
  }
  const { palette } = JSON.parse(await read('editorial/DESIGN_SYSTEM.json'));
  const css = await read('src/styles/design-tokens.css');
  const favicon = await read('public/favicon.svg');
  const art = renderArt({ motif: 'eye-lock', label: 'TEST', alt: 'A synthetic eye' }, 'synthetic-eye');
  for (const [key, color] of Object.entries(palette)) {
    const token = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    assert.ok(css.includes(`--${token}: ${color};`), `CSS token ${token} drifted`);
  }
  assert.ok(favicon.includes(palette.cyan));
  assert.ok(favicon.includes(palette.ink));
  assert.ok(art.includes(palette.cyan));
  assert.ok(art.includes(palette.ink));
  assert.doesNotMatch(art, /ORIGINAL ART/);
});

test('existing art stays stable while new templates and palettes vary', async () => {
  const image = { motif: 'eye-lock', label: 'TEST', alt: 'A synthetic eye' };
  const legacy = renderArt(image, 'synthetic-eye');
  assert.doesNotMatch(legacy, /data-template=/);

  const { art } = JSON.parse(await read('editorial/DESIGN_SYSTEM.json'));
  const variants = art.templates.flatMap((template) => Object.keys(art.paletteSets).map((palette) => renderArt({
    ...image,
    artStyle: { template, palette }
  }, `future-${template}-${palette}`)));
  assert.equal(new Set(variants).size, art.templates.length * Object.keys(art.paletteSets).length);
  for (const svg of variants) {
    assert.match(svg, /<svg[^>]+data-template=/);
    assert.doesNotMatch(svg, /M0 0h104l-5 34/);
    assert.doesNotMatch(svg, /undefined/);
  }
  assert.throws(() => renderArt({ ...image, artStyle: { template: 'unknown', palette: 'copper' } }, 'future'), /Unknown art template/);
  assert.throws(() => renderArt({ ...image, artStyle: { template: 'full-bleed', palette: 'unknown' } }, 'future'), /Unknown art palette/);
});

test('landing identity comes from instance config', async () => {
  const index = await read('src/pages/index.astro');
  const layout = await read('src/layouts/Site.astro');
  const storyImage = await read('src/components/StoryImage.astro');
  assert.match(index, /loadInstance/);
  assert.doesNotMatch(index + layout, /LUCAS|MONTPELLIER|lsbonafe/i);
  assert.doesNotMatch(storyImage, /ORIGINAL ART/);
});
