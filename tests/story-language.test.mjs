import test from 'node:test';
import assert from 'node:assert/strict';
import { originalLanguageBadge } from '../src/lib/story-language.mjs';

test('only non-English Reads need a short original-language badge', () => {
  assert.equal(originalLanguageBadge('en'), null);
  assert.equal(originalLanguageBadge('en-GB'), null);
  assert.equal(originalLanguageBadge('pt-BR'), 'ORIGINAL / PT-BR');
  assert.equal(originalLanguageBadge('fr'), 'ORIGINAL / FR');
});
