# Zine design system

Inbox Riot uses a Xerox Wall identity: clumsy, scribbly punk-zine pages made from ink, photocopied fragments, torn paper, crooked type strips, and pasted images. Keep the tactile depth of a layered print collage, with foreground objects, paper folds, and shadows. The mood is curious, wry, a little decadent, and personal. Let the configured portrait inform the drawing language where it fits; each article supplies its own subject. The engine's Xerox Wall layout is the baseline for new issues.

`DESIGN_SYSTEM.json` is the source of palette and type tokens. `npm run design:render` turns those tokens into site CSS and the favicon; `npm run art:render` reads the same palette for generated illustrations. Every manual or AI-created image brief must read this file and `ART_DIRECTION.md` before artwork is made. Composition, mood, and constraints in this document apply to the landing page, every issue, new illustrations, icons, and future generated assets.

The core palette anchors the site. The named `art.paletteSets` add copper, lilac, olive, and slate grounds that harmonize with its cyan, ink, cream, ochre, and oxblood. Original images can shift among these sets; a consistent print texture and dark ink keep them in one family. Do not turn the core palette into a mandatory five-color recipe for every illustration.

`art.houseStyle` in `DESIGN_SYSTEM.json` is the image brief for new covers and article art. Use specific subjects, awkward ink lines, layered paper, and visible print wear. The issue page shares those handmade marks while keeping long copy and source links easy to read. Earlier editions may keep their existing layout when no revision is planned.

## Composition

- Use asymmetry, overlapping layers, varied scale, and purposeful breathing room. Avoid broad empty fields, uniform card grids, or a decorative sticker on every item. A dark spine or torn edge is an option when it serves the composition.
- Vary the crop, subject scale, framing, and background from story to story. A black left spine is one option, never the default frame for a whole issue. Adjacent original images should not reuse the same composition and background color without an editorial reason.
- Let the portrait and issue imagery carry character. Issue titles and section heads use blunt uppercase display treatment; labels, dates, credits, and navigation use compact mono type. Reading copy stays in the serif, which may also appear in selected smaller headlines. Handwriting is a short marginal accent.
- Every issue has its own cover image with the title set by HTML/CSS. Reserve a textured title zone without leaving most of the cover empty. The landing page can show the current issue's cover as part of its editorial layout.
- The issue index stays visible on desktop and becomes a horizontal, swipeable strip on narrow screens. Keep its cut-paper character and link targets legible.
- Texture should resemble worn printed paper. Keep it subtle enough that text and source links remain clear at mobile sizes.
- Handwriting is for short, static marginal notes only. Never set paragraphs, section introductions, takeaways, or the editor's note in handwriting.
- Use the configured editor name sparingly on the landing page. The configured portrait is the landing-page image; do not invent another likeness or symbolic avatar.
- Credit the human whose inbox supplies the material and state plainly that an AI routine reads and edits it.
- The place mark comes from `config/site.json` in the private instance. Scheduling time zones are separate from the printed location.

## Image rules

- Make article art only when a specific scene, object, or diagram adds meaning to that article. Use the shared palette and worn print treatment. Every lead topic has original, subject-specific art; selected Reads and Signals may have it when useful. Vary the composition and avoid repeated images or a branded frame on every illustration.
- The caption should credit third-party images. Original work does not need a visible "original art" label or repeated site credit; its rights and credit remain in the issue data.
- New Releases should use a relevant public source image where suitable and legally appropriate, with source credit and a link to the original page.
- Preserve the configured portrait's own texture and composition.
- Choose one visual star among the Field Notes and give only that note an event-specific torn-paper cutout. It overlaps the note card; other notes stay unstickered. Ink scribbles, misregistration, photocopy grain, and rough edges should make it feel pasted into the zine, never like a clean UI icon or repeated section badge.

## Review

Before publishing, inspect desktop and mobile pages, color contrast, image crop, loading, credits, source links, and the generated SVGs. Run the content tests, Astro check, and build. No private email text, IDs, or tokens enter visual assets or site files.
