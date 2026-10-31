import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const issueDir = process.env.INBOX_RIOT_ISSUES_DIR ?? join(root, 'src/data/issues');
const { palette, art } = JSON.parse(await readFile(join(root, 'editorial/DESIGN_SYSTEM.json'), 'utf8'));
const colors = [palette.ochre, palette.oxblood, palette.paper, palette.cyanDeep];
const motifs = {
  'eye-lock': `<path d="M25 155Q200-5 375 155Q200 315 25 155Z" fill="{{paper}}"/><circle cx="200" cy="155" r="65" fill="{{ochre}}"/><circle cx="200" cy="155" r="26" fill="{{ink}}"/><path d="M280 208v-35q0-35 34-35t34 35v35" fill="none"/><rect x="269" y="202" width="91" height="76" fill="{{oxblood}}"/><path d="M314 220v38"/>`,
  'server-bill': `<g fill="{{paper}}"><rect x="22" y="37" width="125" height="264"/><rect x="158" y="37" width="125" height="264"/></g><path d="M39 88h90m-90 50h90m-90 50h90m-90 50h90m48-150h90m-90 50h90m-90 50h90m-90 50h90" fill="none"/><g fill="{{oxblood}}"><circle cx="56" cy="62" r="9"/><circle cx="192" cy="62" r="9"/></g><path d="M316 44h83v227l-17-12-16 12-17-12-16 12-17-12Z" fill="{{ochre}}"/><path d="M332 92h52m-52 43h52m-52 43h52m-52 43h37" fill="none"/>`,
  'tower-alert': `<path d="m75 305 95-248 96 248Z" fill="{{paper}}"/><path d="M105 226h130M126 170h88M149 112h42M171 57V8m-57 78Q41 39 21 93m260-7q73-47 94 7M94 53Q22 5 0 58m302-5q72-48 98 5" fill="none"/><path d="M298 175h86l-43 101Z" fill="{{oxblood}}"/><path d="M341 192v38m0 22v3" fill="none" stroke="{{paper}}" stroke-width="12"/>`,
  'open-book': `<path d="M28 60q89-42 174 5v237q-92-47-174-7Zm174 5q87-47 172-5v235q-81-40-172 7Z" fill="{{paper}}"/><path d="M202 65v237M52 108q65-22 123 7M52 154q65-22 123 7M229 115q57-27 117-7M229 161q57-27 117-7" fill="none"/><circle cx="200" cy="31" r="21" fill="{{oxblood}}"/><path d="m200-12-2-20m-34 34-18-15m92 15 17-15m-17 42 24-1" fill="none"/>`,
  'broken-network': `<path d="M53 81 173 47l68 85 111-65M53 81l45 171 143-120 111 120m-254 0 150 20 104-20" fill="none"/><g fill="{{paper}}"><circle cx="53" cy="81" r="27"/><circle cx="173" cy="47" r="27"/><circle cx="241" cy="132" r="27"/><circle cx="352" cy="67" r="27"/><circle cx="98" cy="252" r="27"/><circle cx="352" cy="252" r="27"/></g><path d="m195 211 31-31m-2 35 30-29" stroke="{{oxblood}}" stroke-width="17"/>`,
  'incident-screen': `<rect x="30" y="27" width="340" height="226" fill="{{paper}}"/><path d="M56 148h52l26-62 35 119 39-64 27 28 29-52 25 31h53" fill="none" stroke="{{oxblood}}" stroke-width="12"/><path d="M155 253v50m90-50v50m-126 0h163" fill="none"/><circle cx="327" cy="64" r="16" fill="{{ochre}}"/>`,
  'metric-ruler': `<path d="M42 40v251h324" fill="none"/><path d="M55 235 123 200l67 10 70-92 87-40" fill="none" stroke="{{oxblood}}" stroke-width="15"/><path d="m335 75 20 4-9 22" fill="none" stroke="{{oxblood}}"/><path d="M69 292v-23m53 23v-23m53 23v-23m53 23v-23m53 23v-23m53 23v-23M42 248h25M42 188h25M42 128h25M42 68h25" fill="none"/><rect x="192" y="35" width="94" height="65" fill="{{ochre}}" transform="rotate(-8 192 35)"/>`,
  'border-tower': `<path d="m65 302 89-247 88 247Z" fill="{{paper}}"/><path d="M111 184h85m-57-74h30M154 55V10m-91 262 180-1" fill="none"/><path d="M254 175h133M254 219h133M254 263h133" fill="none" stroke-dasharray="18 13"/><path d="M302 34 365 143H239Z" fill="{{oxblood}}"/><path d="M302 65v40m0 16v2" stroke="{{paper}}" stroke-width="13"/>`,
  'warning-face': `<path d="M96 66q105-58 206 0v122q-10 98-103 117-89-20-103-117Z" fill="{{paper}}"/><path d="M131 135h40m58 0h40m-105 89q35-23 71 0" fill="none"/><path d="M283 24h95v111h-35l-30 31v-31h-30Z" fill="{{oxblood}}"/><path d="M330 49v43m0 20v3" stroke="{{paper}}" stroke-width="13"/>`,
  'cost-scale': `<path d="M204 26v259M95 285h219M98 96h212M112 96 55 208h111Zm196 0-57 112h111Z" fill="none"/><path d="M55 208q53 48 111 0m85 0q56 48 111 0" fill="{{ochre}}"/><circle cx="204" cy="52" r="25" fill="{{oxblood}}"/><path d="M181 247h46" fill="none"/><text x="82" y="184" font-size="37" stroke="none" fill="{{ink}}">$</text><text x="273" y="184" font-size="37" stroke="none" fill="{{ink}}">?</text>`,
  'typewriter': `<path d="M93 5h212v129H93Z" fill="{{paper}}"/><path d="M118 46h162m-162 31h126m-126 31h146" fill="none"/><path d="M60 132h280l43 165H17Z" fill="{{oxblood}}"/><path d="M53 183h291m-263 51h240" fill="none"/><g fill="{{paper}}"><circle cx="92" cy="208" r="12"/><circle cx="139" cy="208" r="12"/><circle cx="186" cy="208" r="12"/><circle cx="233" cy="208" r="12"/><circle cx="280" cy="208" r="12"/></g>`,
  'poem-eye': `<path d="M68 18h249l22 260-31-14-29 14-31-14-31 14-30-14-31 14-30-14-31 14Z" fill="{{paper}}"/><path d="M103 70h153m-153 34h111m-111 34h166m-166 34h122" fill="none"/><path d="M149 229q54-58 111 0-57 58-111 0Z" fill="{{ochre}}"/><circle cx="205" cy="229" r="18" fill="{{oxblood}}"/>`,
  'curated-list': `<g fill="{{paper}}"><path d="M27 42h265v228H27Z"/><path d="M76 15h265v228h-34V36H76Z"/></g><path d="M66 96h24m23 0h131M66 143h24m23 0h131M66 190h24m23 0h131" fill="none"/><path d="m280 119 37 36 62-83" fill="none" stroke="{{oxblood}}" stroke-width="17"/>`,
  'agent-chat': `<path d="M22 40h240v167h-72l-42 43v-43H22Z" fill="{{paper}}"/><path d="M165 109h225v167h-75l-41 38v-38H165Z" fill="{{ochre}}"/><path d="M64 95h151m-151 51h109m43 28h132m-132 47h79" fill="none"/><circle cx="239" cy="69" r="15" fill="{{oxblood}}"/>`,
  'control-dial': `<circle cx="197" cy="159" r="121" fill="{{paper}}"/><circle cx="197" cy="159" r="72" fill="{{ochre}}"/><path d="M197 159 247 81" stroke="{{oxblood}}" stroke-width="18"/><path d="M197 12v30M93 54l21 20M48 159h29m16 106 21-20m187 20-21-20m65-86h28M301 54l-21 20" fill="none"/><path d="M37 304h325" stroke-dasharray="22 12"/>`
};

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function renderVariantArt(image, id, shape) {
  const { template, palette: paletteName } = image.artStyle;
  if (!art.templates.includes(template)) throw new Error(`Unknown art template for ${id}: ${template}`);
  const color = Object.hasOwn(art.paletteSets, paletteName) ? art.paletteSets[paletteName] : undefined;
  if (!color) throw new Error(`Unknown art palette for ${id}: ${paletteName}`);
  const motif = shape
    .replaceAll('{{paper}}', color.light)
    .replaceAll('{{ochre}}', color.mid)
    .replaceAll('{{oxblood}}', color.accent)
    .replaceAll('{{ink}}', color.dark);
  const subject = (transform) => `<g transform="${transform}" stroke="${color.dark}" stroke-width="8" stroke-linejoin="bevel" stroke-linecap="square">${motif}</g>`;
  const layouts = {
    'full-bleed': `<rect width="720" height="460" fill="${color.background}"/><circle cx="602" cy="56" r="255" fill="${color.mid}" opacity=".8"/><path d="M0 383q310-108 720 17v60H0Z" fill="${color.light}" opacity=".82"/>${subject('translate(136 36) scale(1.12)')}<path d="m24 36 87 21m-73 21 62 14m526 279 67 24" fill="none" stroke="${color.accent}" stroke-width="7"/>`,
    'split-paper': `<rect width="720" height="460" fill="${color.background}"/><path d="M0 0h338l28 460H0Z" fill="${color.light}"/><path d="M336 0 364 460" fill="none" stroke="${color.dark}" stroke-width="3" stroke-dasharray="18 9" opacity=".55"/><circle cx="115" cy="96" r="47" fill="${color.mid}"/>${subject('translate(252 68) rotate(6 200 150)')}<path d="M44 324h220m-220 20h146m-146 20h196" fill="none" stroke="${color.accent}" stroke-width="9"/>`,
    'cutout-field': `<rect width="720" height="460" fill="${color.background}"/><path d="M78 35 587 8l100 378-556 60Z" fill="${color.light}"/><path d="m114 51 398-28 124 363-424 40Z" fill="${color.mid}" opacity=".35"/>${subject('translate(167 76) rotate(-9 200 150)')}<path d="m37 102 61-24m-42 51 72-29m487 309 69-24" fill="none" stroke="${color.accent}" stroke-width="8"/>`,
    'night-window': `<rect width="720" height="460" fill="${color.dark}"/><rect x="39" y="38" width="642" height="384" fill="${color.background}"/><ellipse cx="535" cy="179" rx="142" ry="116" fill="${color.light}" opacity=".68"/>${subject('translate(161 72) scale(1.03)')}<path d="M38 365h644M86 61h120m-120 17h88" fill="none" stroke="${color.accent}" stroke-width="8"/>`
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" role="img" aria-labelledby="title desc" data-template="${template}" data-palette="${paletteName}">
<title id="title">${escapeXml(image.label.toUpperCase())}</title><desc id="desc">${escapeXml(image.alt)}</desc>
<defs><pattern id="print" width="17" height="19" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.1" fill="${color.dark}" opacity=".2"/><circle cx="14" cy="13" r=".8" fill="${color.light}" opacity=".5"/></pattern></defs>
${layouts[template]}
<rect width="720" height="460" fill="url(#print)"/>
</svg>\n`;
}

export function renderArt(image, id) {
  const shape = motifs[image.motif];
  if (!shape) throw new Error(`Unknown art motif for ${id}: ${image.motif}`);
  if (!image.label || image.label.length > 22) throw new Error(`Art label must be 1–22 characters: ${id}`);
  if (image.artStyle) return renderVariantArt(image, id, shape);
  const motif = shape
    .replaceAll('{{paper}}', palette.paper)
    .replaceAll('{{ochre}}', palette.ochre)
    .replaceAll('{{oxblood}}', palette.oxblood)
    .replaceAll('{{ink}}', palette.ink);
  const accent = colors[[...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length];
  const label = escapeXml(image.label.toUpperCase());
  const alt = escapeXml(image.alt);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" role="img" aria-labelledby="title desc">
<title id="title">${label}</title><desc id="desc">${alt}</desc>
<defs><pattern id="print" width="19" height="17" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.1" fill="${palette.ink}" opacity=".18"/><circle cx="14" cy="13" r=".8" fill="${palette.paper}" opacity=".45"/></pattern></defs>
<rect width="720" height="460" fill="${palette.cyan}"/>
<path d="M0 0h104l-5 34 7 38-5 36 8 45-6 41 7 46-7 40 5 44-7 43 6 44-5 49H0Z" fill="${palette.ink}"/>
<path d="M117 67 690 29v365l-573 42Z" fill="${accent}" opacity=".34"/>
<rect width="720" height="460" fill="url(#print)"/>
<path d="m153 78 34-19m-20 31 42-24M591 378l40 20m-20-31 42 18" fill="none" stroke="${palette.ink}" stroke-width="4" opacity=".7"/>
<g transform="translate(190 73) rotate(-3 200 150)" stroke="${palette.ink}" stroke-width="8" stroke-linejoin="bevel" stroke-linecap="square">${motif}</g>
</svg>\n`;
}

async function renderAllArt() {
  let rendered = 0;
  const generatedPaths = new Set();
  for (const name of (await readdir(issueDir)).filter((file) => file.endsWith('.json'))) {
    const issue = JSON.parse(await readFile(join(issueDir, name), 'utf8'));
    for (const entry of [...issue.leadTopics, ...issue.stories]) {
      const image = entry.image;
      if (image?.kind !== 'original' || !image.motif) continue;
      if (!/^assets\/art\/[a-z0-9-]+\.svg$/.test(image.src)) throw new Error(`Generated art path is unsafe: ${entry.id}`);
      if (generatedPaths.has(image.src)) throw new Error(`Generated art path is reused: ${image.src}`);
      generatedPaths.add(image.src);
      const path = join(root, 'public', image.src);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, renderArt(image, entry.id));
      rendered++;
    }
  }
  console.log(`Rendered ${rendered} original editorial illustrations.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) await renderAllArt();
