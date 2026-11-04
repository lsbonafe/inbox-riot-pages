# Art direction for every issue

Read `DESIGN_SYSTEM.md` and `DESIGN_SYSTEM.json` before making or selecting images. The Xerox Wall identity applies to the site, issue covers, original illustrations, contents icons, and all future assets. Draw with rough ink and scribbles; build depth with torn, overlapping paper and imperfect photocopy texture. Use the named companion palettes for color variety; cyan and a black spine do not need to appear in every image. Let each story determine its own subject and layout.

Use `art.houseStyle` as the default for new original art. Each image brief must name the underlying story, the exact visual subject, the scene or relationship it communicates, a distinct composition, the issue's named palette, and the no-text/no-recycled-subject constraints. A cover is its own editorial composition, not a larger copy of a story image: build depth with overlapping paper and distinct foreground and background details, keeping room for the HTML title without making most of the image an empty field. Do not publish a new issue with a missing cover or a repeated illustration. Evaluate semantic repetition by eye as well as duplicate files by hash.

Use original art for a lead topic or story when its scene, object, or diagram makes the underlying idea clearer. Avoid generic robots, stock visual metaphors, repeated branded frames, and visuals that imply an unsupported source claim. `scripts/render-original-art.mjs` reads the design system, uses each image's `motif` and `label` for the asset and accessible title, and adds no visible "original art" badge. Extend the motif library when an existing subject does not fit.

Choose one standout Field Note per issue for a small original cutout tied to its event. Place it over that note card like pasted ephemera; leave the other notes plain. Draw an imperfect ink or photocopy collage on irregular torn paper, with visible grain, rough cuts, and a little marker or tape. Use the issue palette with room for one companion color, not a clean vector icon, generic section badge, or repeated template. Keep the subject clear at mobile size and give it meaningful alt text.

The SVG motif renderer serves legacy illustrations. If a bespoke vector diagram is needed in a new issue, draw a unique subject. For every generated SVG still using the renderer, set `image.artStyle` with a `template` and `palette` from `DESIGN_SYSTEM.json`. Choose deliberately for the article:

- `full-bleed`: an open, energetic scene with a large subject and no frame.
- `split-paper`: a comparison or tension across two fields.
- `cutout-field`: a singular object or idea on an angled printed sheet.
- `night-window`: a darker, contained scene with a full surround.

The available palettes are `cyan-ink`, `copper`, `lilac`, `olive`, and `slate`. Use at least two templates and two palettes when an issue has three or more generated images. Do not rotate them mechanically by story ID; consider the subject, neighboring images, and the issue's rhythm. The renderer supports earlier artwork without `artStyle`, but later generated SVGs require it. For manually drawn or AI-created bitmap art, use the same compositional range and companion colors without forcing an SVG template. Source-hosted images keep their original appearance.

New Releases should show what was released. Prefer a relevant official image on the linked public page, with a direct HTTPS image URL, credit, and a link to the source. Do not save a third-party copy without reuse permission. If the image is absent or unsuitable, make article-specific original art under the design system.

Captions credit third-party images. Original art credit and rights stay in issue data; they do not need repeated labels on the page. Keep handwritten type to short static notes such as a margin caption or bottom note. Use the reading serif for paragraphs, section introductions, takeaways, and editor notes.

Check desktop and mobile pages before publication: crop, alt text, credits, source links, legibility, and the favicon. If visual inspection is unavailable, report that limit and keep publication pending review.
