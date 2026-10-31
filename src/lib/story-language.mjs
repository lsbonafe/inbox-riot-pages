export function originalLanguageBadge(language) {
  if (!language || language.split('-')[0].toLowerCase() === 'en') return null;
  return `ORIGINAL / ${language.toUpperCase()}`;
}
