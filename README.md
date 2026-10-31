# Inbox Riot: reusable zine engine

Inbox Riot turns already sorted email into a source-linked personal zine. The aim is to make a crowded reading inbox worth revisiting and let others run their own edition without copying an editor's identity or private mail. The generator is an Astro static site with a data schema, editorial rules, design tokens, art renderer, privacy checks, and CI. It is MIT licensed; [content rights](CONTENT_RIGHTS.md) remain separate.

## Two repositories, one publication

```text
Another mail agent → existing source labels in Gmail
                         ↓ (read only; no re-sorting)
ChatGPT scheduled editor → full Reads + linked sources → private instance
                         ↓                            config/site.json
                         ↓                            issue JSON + approved assets
                         ↓                            task prompt + GitHub secret
Public main: reusable Astro engine + design system + schemas + tests
                         ↓ pinned checkout by private CI
Private CI: overlay instance → validate → build → dist/
                         ↓ deploy key, rendered files only
Public gh-pages: static HTML/CSS/assets → GitHub Pages
                         ↓ live issue verified
Gmail: add processed label to reviewed, decided messages
```

The public `main` branch contains generic source and synthetic fixtures. The private instance contains real configuration, edited issue JSON, approved assets, and the publishing workflow. Raw email stays in Gmail; credentials stay in ChatGPT connections and GitHub Secrets. The public `gh-pages` branch contains the rendered site, including any text and images intentionally published in its issues. Only a writer of the private instance and its scoped deploy key can trigger this build path.

## Make your instance

Use Node.js 22. Copy the [private instance starter](templates/private-instance/README.md) into a private repository. Fill its example config with your title, location, portrait, copy, origin, base path, and cover assets. Put edited issues under `src/data/issues/` following [the issue format](editorial/ISSUE_FORMAT.md), and approved local images under `public/assets/`. Its workflow uses a 40-character `ENGINE_REF` commit SHA for this public engine and a write deploy key for your Pages repository. Configure Pages to publish from `gh-pages` at `/`.

For a local build, set `INBOX_RIOT_CONFIG` to your config JSON and `INBOX_RIOT_ISSUES_DIR` to your issue directory, then run `npm ci`, `npm test`, `npm run check`, and `npm run build`. No production config or issue content is bundled. Its CI uses the synthetic example config and fixture issue only.

[Editorial contract](editorial/MASTER_PROMPT.md), [design system](editorial/DESIGN_SYSTEM.md), [art direction](editorial/ART_DIRECTION.md), and the [hosted task template](templates/private-instance/SCHEDULE_PROMPT.md) are reusable. Your private task prompt supplies account names, labels, editorial interests, and schedule. The scheduler needs a working Gmail read/label connection and a GitHub connection that can write to your private instance without pausing for approval; verify both before unattended publication.
