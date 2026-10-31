import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadInstance, validateInstance } from '../config/instance.mjs';

const example = JSON.parse(readFileSync(new URL('../config/example.json', import.meta.url), 'utf8'));

test('synthetic instance has every required field', () => {
  assert.deepEqual(validateInstance(example), []);
});

test('site identity and URL are required rather than using a personal fallback', () => {
  const invalid = structuredClone(example);
  delete invalid.identity.location;
  invalid.site.origin = 'http://example.test';
  invalid.identity.portraitSrc = '../private.png';
  assert.match(validateInstance(invalid).join('\n'), /identity.location/);
  assert.match(validateInstance(invalid).join('\n'), /HTTPS origin/);
  assert.match(validateInstance(invalid).join('\n'), /local asset/);
  assert.throws(() => loadInstance('config/does-not-exist.json'), /ENOENT/);
});

test('explicit instance config can be loaded', () => {
  const loaded = loadInstance(fileURLToPath(new URL('../config/example.json', import.meta.url)));
  assert.equal(loaded.site.title, 'Example Zine');
});
