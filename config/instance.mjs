import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const required = [
  'site.title', 'site.description', 'site.origin', 'site.base', 'site.language',
  'identity.wordmarkFirst', 'identity.wordmarkAccent', 'identity.editorName',
  'identity.location', 'identity.established', 'identity.portraitSrc', 'identity.portraitAlt',
  'copy.mastheadNote', 'copy.footerLabel', 'copy.footerNote', 'copy.spineVolume',
  'copy.heroTopLeft', 'copy.heroTopRight', 'copy.heroEyebrow', 'copy.heroHeadlineFirst',
  'copy.heroHeadlineSecond', 'copy.heroDek', 'copy.portraitCaption',
  'copy.heroBottomLeft', 'copy.heroBottomRight'
];

export function validateInstance(config) {
  const errors = [];
  for (const path of required) {
    const value = path.split('.').reduce((item, key) => item?.[key], config);
    if (typeof value !== 'string' || !value.trim()) errors.push(`Missing instance config: ${path}`);
  }
  if (config?.site?.origin) {
    try {
      const url = new URL(config.site.origin);
      if (url.protocol !== 'https:' || url.origin !== config.site.origin || url.username || url.password) errors.push('site.origin must be an HTTPS origin');
    } catch { errors.push('site.origin must be an HTTPS origin'); }
  }
  if (config?.site?.base && !/^\/[a-zA-Z0-9/_-]*$/.test(config.site.base)) errors.push('site.base must be a URL path');
  if (config?.site?.language && !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(config.site.language)) errors.push('site.language must be a language tag');
  if (config?.identity?.portraitSrc && !/^assets\/[a-z0-9/_-]+\.(?:svg|png|jpe?g|webp)$/i.test(config.identity.portraitSrc)) errors.push('identity.portraitSrc must be a local asset');
  for (const [edition, cover] of Object.entries(config?.covers ?? {})) {
    if (!/^\d+$/.test(edition) || !/^assets\/[a-z0-9/_-]+\.(?:svg|png|jpe?g|webp)$/i.test(cover?.src ?? '') || !cover?.alt?.trim()) errors.push(`Invalid issue cover: ${edition}`);
  }
  return errors;
}

export function loadInstance(path = process.env.INBOX_RIOT_CONFIG) {
  if (!path) throw new Error('INBOX_RIOT_CONFIG must point to an explicit instance JSON file');
  const config = JSON.parse(readFileSync(resolve(path), 'utf8'));
  const errors = validateInstance(config);
  if (errors.length) throw new Error(errors.join('\n'));
  return config;
}
