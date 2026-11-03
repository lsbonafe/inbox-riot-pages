# Reusable publication workflow

1. Copy the public engine; create a private instance with `config/site.json`, `src/data/issues/*.json`, approved `public/assets/`, and a private publishing workflow. Start with `config/example.json` as a schema example, replacing every example value.
2. Connect the scheduled editor to the mail source and private GitHub repository. Place your account names, label paths, interests, and site URL in the private task prompt, never in the public engine. Set the time zone in the task's scheduling settings. Test the private prompt read and essential write permissions in an interactive session.
3. The editor reads only existing source labels, excludes messages with either terminal label, checks the published archive for duplicates, researches full reading and watching sources, prepares public-safe issue JSON, and commits it to the private instance when automation is authorized.
4. Private CI checks out a pinned public engine commit, overlays private config/content/assets, validates and builds. On the private `main` branch, it pushes only `dist/` to public `gh-pages`. Set Pages source to the `gh-pages` branch at the repository root.
5. Verify the issue is live, then apply the processed label only to messages included in that issue. Report and label deliberate final exclusions as skipped. Keep undecided or deferred messages for a later run, and never skip a selected item because publication failed.

The example config and fixture issue are synthetic CI data. They are never a production fallback.
