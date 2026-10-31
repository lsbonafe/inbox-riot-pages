# Art direction for every issue

Read `DESIGN_SYSTEM.md` and `DESIGN_SYSTEM.json` before making or selecting images. The found-record-sleeve identity applies to the site, issue covers, original illustrations, contents icons, and all future assets. Keep worn ink, print texture, and spare article-specific compositions. Use the named companion palettes for color variety; cyan and the black left spine do not need to appear in every image. Let each story determine its own subject and layout.

Use original art for a lead topic or story when its scene, object, or diagram makes the underlying idea clearer. Avoid generic robots, stock visual metaphors, repeated branded frames, and visuals that imply an unsupported source claim. `scripts/render-original-art.mjs` reads the design system, uses each image's `motif` and `label` for the asset and accessible title, and adds no visible "original art" badge. Extend the motif library when an existing subject does not fit.

For every new generated SVG, set `image.artStyle` with a `template` and `palette` from `DESIGN_SYSTEM.json`. Choose deliberately for the article:

- `full-bleed`: an open, energetic scene with a large subject and no frame.
- `split-paper`: a comparison or tension across two fields.
- `cutout-field`: a singular object or idea on an angled printed sheet.
- `night-window`: a darker, contained scene with a full surround.

The available palettes are `cyan-ink`, `copper`, `lilac`, `olive`, and `slate`. Use at least two templates and two palettes when an issue has three or more generated images. Do not rotate them mechanically by story ID; consider the subject, neighboring images, and the issue's rhythm. The renderer supports earlier artwork without `artStyle`, but later generated SVGs require it. For manually drawn or AI-created bitmap art, use the same compositional range and companion colors without forcing an SVG template. Source-hosted images keep their original appearance.

New Releases should show what was released. Prefer a relevant official image on the linked public page, with a direct HTTPS image URL, credit, and a link to the source. Do not save a third-party copy without reuse permission. If the image is absent or unsuitable, make article-specific original art under the design system.

Captions credit third-party images. Original art credit and rights stay in issue data; they do not need repeated labels on the page. Keep handwritten type to short static notes such as a margin caption or bottom note. Use the reading serif for paragraphs, section introductions, takeaways, and editor notes.

Check desktop and mobile pages before publication: crop, alt text, credits, source links, legibility, and the favicon. If visual inspection is unavailable, report that limit and keep publication pending review.
