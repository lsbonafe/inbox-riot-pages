import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateIssue, validateDirectory } from '../scripts/validate-content.mjs';

const originalImage = { kind: 'original', src: 'assets/example-art.svg', alt: 'An illustrated mechanical hand', credit: 'Example Zine', rights: 'Original editorial artwork' };
const leadTakeaway = 'The evidence in this article supports a limited conclusion. A reader should check the method, compare it with their own situation, and decide what to test next before treating the finding as general advice.';
const clean = () => ({
  title: 'The Test Issue', date: '2026-10-30', edition: 1, dek: 'A fixture', editorNote: 'A test.',
  leadTopics: [{ id: 'clear-theme', title: 'A clear theme', claim: 'The finding changes this field.', takeaway: leadTakeaway, whyItMatters: 'It affects a real decision.', uncertainty: 'The result may not generalize.', image: originalImage, storyIds: ['real-story'] }], stories: [{
    id: 'real-story', section: 'reads', sourceLanguage: 'en', headline: 'An actual finding', sourceName: 'Example',
    sourceUrl: 'https://example.org/a-real-article', takeaways: ['A specific result, with context.'],
    whyItMatters: 'The result changes a decision.', image: originalImage
  }]
});

test('a sourced issue passes', () => assert.deepEqual(validateIssue(clean()), []));
test('primary research can be linked alongside the original article', () => {
  const issue = clean(); issue.stories[0].relatedLinks = [{ label: 'Underlying study', url: 'https://example.org/study' }];
  assert.deepEqual(validateIssue(issue), []);
});
test('related links reject tracking, private redirects, and repeated URLs', () => {
  const issue = clean(); issue.stories[0].relatedLinks = [
    { label: 'Study', url: 'https://example.org/study?utm_source=mail' },
    { label: 'Again', url: 'https://example.org/a-real-article' },
    { label: 'Tracking', url: 'https://substack.com/redirect/opaque' }
  ];
  const errors = validateIssue(issue).join(' ');
  assert.match(errors, /Tracking or private URL parameter/);
  assert.match(errors, /Duplicate link in story/);
  assert.match(errors, /canonical related link/);
});
test('unknown story treatments are rejected', () => {
  const issue = clean(); issue.stories[0].treatment = 'advertorial';
  assert.match(validateIssue(issue).join(' '), /Invalid story treatment/);
});
test('unknown reading beats are rejected', () => {
  const issue = clean(); issue.stories[0].beat = 'misc';
  assert.match(validateIssue(issue).join(' '), /Invalid story beat/);
});
test('every Read needs an original-language tag', () => {
  const issue = clean(); delete issue.stories[0].sourceLanguage;
  assert.match(validateIssue(issue).join(' '), /original-language tag/);
  issue.stories[0].sourceLanguage = 'english';
  assert.match(validateIssue(issue).join(' '), /original-language tag/);
  issue.stories[0].sourceLanguage = 'pt-BR';
  assert.deepEqual(validateIssue(issue), []);
});
test('validator can be imported by an editorial script on stdin', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-'], { input: "import './scripts/validate-content.mjs';\n", encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
test('lead topics must state uncertainty and point to published stories', () => {
  const issue = clean(); issue.leadTopics[0].uncertainty = ''; issue.leadTopics[0].storyIds = ['missing-story'];
  const errors = validateIssue(issue).join(' ');
  assert.match(errors, /needs title, claim, relevance, and uncertainty/);
  assert.match(errors, /references a missing story/);
});
test('lead topics need substantial takeaways and original art', () => {
  const issue = clean(); issue.leadTopics[0].takeaway = 'Too short.'; issue.leadTopics[0].image = undefined;
  const errors = validateIssue(issue).join(' ');
  assert.match(errors, /substantial takeaway/);
  assert.match(errors, /Most lead topics need original art/);
});
test('releases need images and source images cannot use tracked URLs', () => {
  const issue = clean();
  issue.stories.push({ id: 'release', section: 'releases', headline: 'A release', sourceName: 'Publisher', sourceUrl: 'https://example.org/release', takeaways: ['It is available.'], whyItMatters: 'Some readers may want it.' });
  assert.match(validateIssue(issue).join(' '), /Release needs an image/);
  issue.stories[1].image = { kind: 'source', src: 'https://example.org/poster.jpg?utm_source=mail', alt: 'Poster', credit: 'Publisher', rights: 'Source-hosted promotional image' };
  assert.match(validateIssue(issue).join(' '), /Tracking or private URL parameter/);
  issue.stories[1].image.src = 'https://example.org/poster.jpg';
  assert.deepEqual(validateIssue(issue), []);
});
test('reading and signal art quotas apply to every issue', () => {
  const issue = clean(); issue.stories[0].image = undefined;
  issue.stories.push({ id: 'signal', section: 'signals', headline: 'A new feature', sourceName: 'Publisher', sourceUrl: 'https://example.org/feature', takeaways: ['It is available.'], whyItMatters: 'Readers may use it.' });
  const errors = validateIssue(issue).join(' ');
  assert.match(errors, /Reading Room needs article-specific original art/);
  assert.match(errors, /Signal Desk needs original art/);
});
test('original art must exist in the public asset directory', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'inbox-riot-art-test-'));
  try {
    const issue = clean(); issue.leadTopics[0].image = { ...originalImage, src: 'assets/missing-art.svg' };
    await writeFile(join(directory, 'issue.json'), JSON.stringify(issue));
    assert.match((await validateDirectory(directory)).join(' '), /original image asset is missing/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('future generated art needs valid styles and varied treatment', () => {
  const issue = clean(); issue.edition = 2;
  const generated = (src) => ({ ...originalImage, src, motif: 'eye-lock', label: 'A TEST IMAGE' });
  issue.leadTopics[0].image = generated('assets/art/future-lead.svg');
  issue.stories[0].image = generated('assets/art/future-read.svg');
  assert.match(validateIssue(issue).join(' '), /Generated art needs a template and palette/);

  const style = { template: 'full-bleed', palette: 'copper' };
  issue.leadTopics[0].image.artStyle = style;
  issue.stories[0].image.artStyle = style;
  assert.deepEqual(validateIssue(issue), []);

  issue.stories.push({ ...issue.stories[0], id: 'second-read', sourceUrl: 'https://example.org/second-read', image: { ...generated('assets/art/future-second.svg'), artStyle: style } });
  assert.match(validateIssue(issue).join(' '), /at least two templates.*at least two palettes/s);
  issue.stories[1].image.artStyle = { template: 'cutout-field', palette: 'olive' };
  assert.deepEqual(validateIssue(issue), []);

  issue.stories[1].image.artStyle.template = 'invalid';
  assert.match(validateIssue(issue).join(' '), /Unknown art template/);
  issue.stories[1].image.artStyle = { template: 'cutout-field', palette: 'invalid' };
  assert.match(validateIssue(issue).join(' '), /Unknown art palette/);
});
test('private Gmail links are rejected', () => {
  const issue = clean(); issue.stories[0].sourceUrl = 'https://mail.google.com/mail/u/0/#all/abc';
  assert.match(validateIssue(issue).join(' '), /private data/);
});
test('email addresses and card numbers are rejected', () => {
  const issue = clean(); issue.editorNote = 'Contact alice@example.com or use 4111 1111 1111 1111';
  assert.match(validateIssue(issue).join(' '), /private data/);
});
test('tracked links and duplicate stories are rejected', () => {
  const issue = clean(); issue.stories[0].sourceUrl += '?utm_source=email';
  issue.stories.push({ ...issue.stories[0], id: 'another' });
  const errors = validateIssue(issue).join(' ');
  assert.match(errors, /Tracking/);
  assert.match(errors, /Duplicate source URL/);
});
test('email-only references work without mailbox identifiers', () => {
  const issue = clean(); delete issue.stories[0].sourceUrl;
  issue.stories[0].emailReference = 'Example Weekly, 30 October 2026';
  assert.deepEqual(validateIssue(issue), []);
});
test('an email-only reference cannot expose a Gmail message id', () => {
  const issue = clean(); delete issue.stories[0].sourceUrl;
  issue.stories[0].emailReference = 'Example Weekly, abcdef0123456789';
  assert.match(validateIssue(issue).join(' '), /private data/);
});
test('tracked redirect links must be resolved', () => {
  const issue = clean(); issue.stories[0].sourceUrl = 'https://c.gle/a-newsletter-tracking-code';
  assert.match(validateIssue(issue).join(' '), /canonical source/);
});
test('tokenized newsletter redirects cannot be published as sources', () => {
  const issue = clean(); issue.stories[0].sourceUrl = 'https://substack.com/redirect/2/eyJzdWJzY3JpYmVyIjoiYWxpY2UifQ';
  assert.match(validateIssue(issue).join(' '), /canonical source/);
});
test('a source cannot be republished in another issue', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'inbox-riot-test-'));
  try {
    await writeFile(join(directory, 'first.json'), JSON.stringify(clean()));
    const second = clean(); second.edition = 2; second.date = '2026-10-31';
    await writeFile(join(directory, 'second.json'), JSON.stringify(second));
    assert.match((await validateDirectory(directory)).join(' '), /source already published/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('query order and trailing slash do not bypass the source gate', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'inbox-riot-test-'));
  try {
    const first = clean(); first.stories[0].sourceUrl = 'https://example.org/article/?b=2&a=1';
    const second = clean(); second.edition = 2; second.date = '2026-10-31';
    second.stories[0].sourceUrl = 'https://example.org/article?a=1&b=2';
    await writeFile(join(directory, 'first.json'), JSON.stringify(first));
    await writeFile(join(directory, 'second.json'), JSON.stringify(second));
    assert.match((await validateDirectory(directory)).join(' '), /source already published/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('edition numbers and dates cannot be reused', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'inbox-riot-test-'));
  try {
    await writeFile(join(directory, 'first.json'), JSON.stringify(clean()));
    const second = clean(); second.stories[0].sourceUrl = 'https://example.org/different';
    await writeFile(join(directory, 'second.json'), JSON.stringify(second));
    assert.match((await validateDirectory(directory)).join(' '), /edition already published/);
    assert.match((await validateDirectory(directory)).join(' '), /date already published/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
