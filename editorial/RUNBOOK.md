# Reusable publication workflow

1. Copy the public engine; create a private instance with `config/site.json`, `src/data/issues/*.json`, approved `public/assets/`, and a private publishing workflow. Start with `config/example.json` as a schema example, replacing every example value.
2. Connect the scheduled editor to the mail source and private GitHub repository. Place your account names, label paths, interests, site URL, and scheduling time zone in the private task prompt, never in the public engine. Test read and write permissions in a normal chat.
3. The editor reads only existing source labels, checks the published archive for duplicates, researches full Reads, prepares public-safe issue JSON, and commits it to the private instance when automation is authorized.
4. Private CI checks out a pinned public engine commit, overlays private config/content/assets, validates and builds. On the private `main` branch, it pushes only `dist/` to public `gh-pages`. Set Pages source to the `gh-pages` branch at the repository root.
5. Verify the issue is live, then apply the processed email label to decided messages. Keep undecided messages for a later run.

The example config and fixture issue are synthetic CI data. They are never a production fallback.
