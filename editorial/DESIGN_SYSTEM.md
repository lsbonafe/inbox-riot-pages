# Zine design system

The zine should feel like a found underground record sleeve: electric cyan paper, nearly black ink, faded ochre, warm cream, occasional oxblood, visible print wear, a torn edge, and an elegant italic serif headline. Its attitude is wry, tired, curious, and a little decadent. Use the reference for its texture, color relationships, typography, and mood. Choose original subjects and compositions that serve each story.

`DESIGN_SYSTEM.json` is the source of palette and type tokens. `npm run design:render` turns those tokens into site CSS and the favicon; `npm run art:render` reads the same palette for generated illustrations. Every manual or AI-created image brief must read this file and `ART_DIRECTION.md` before artwork is made. Composition, mood, and constraints in this document apply to the landing page, every issue, new illustrations, icons, and future generated assets.

The core palette anchors the site. The named `art.paletteSets` add copper, lilac, olive, and slate grounds that harmonize with its cyan, ink, cream, ochre, and oxblood. Original images can shift among these sets; a consistent print texture and dark ink keep them in one family. Do not turn the core palette into a mandatory five-color recipe for every illustration.

## Composition

- Use asymmetry, one dominant visual, plenty of quiet space, and a dark spine or torn-paper edge when it serves the composition. The page should feel collected and edited, not filled with stickers.
- Vary the crop, subject scale, framing, and background from story to story. A black left spine is one option, never the default frame for a whole issue. Adjacent original images should not reuse the same composition and background color without an editorial reason.
- Let the portrait and issue imagery carry character. Headlines are large italic serif; labels, dates, credits, and navigation use compact mono type. Readable long copy stays in the reading serif.
- Texture should resemble worn printed paper. Keep it subtle enough that text and source links remain clear at mobile sizes.
- Handwriting is for short, static marginal notes only. Never set paragraphs, section introductions, takeaways, or the editor's note in handwriting.
- Use the configured editor name sparingly on the landing page. The configured portrait is the landing-page image; do not invent another likeness or symbolic avatar.
- The place mark comes from `config/site.json` in the private instance. Scheduling time zones are separate from the printed location.

## Image rules

- Make article art only when a specific scene, object, or diagram adds meaning to that article. Use the shared palette and worn print treatment. Vary the composition and avoid a repeated branded frame on every image.
- The caption should credit third-party images. Original work does not need a visible "original art" label or repeated site credit; its rights and credit remain in the issue data.
- New Releases should use a relevant public source image where suitable and legally appropriate, with source credit and a link to the original page.
- Preserve the configured portrait's own texture and composition.

## Review

Before publishing, inspect desktop and mobile pages, color contrast, image crop, loading, credits, source links, and the generated SVGs. Run the content tests, Astro check, and build. No private email text, IDs, or tokens enter visual assets or site files.
