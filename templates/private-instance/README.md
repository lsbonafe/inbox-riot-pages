# Private instance starter

Copy this directory into a new **private** GitHub repository. Replace every `Example` value in `config/site.json`; add your own edited issue JSON and approved assets. Rename `SCHEDULE_PROMPT.md` into your editorial folder if desired, and fill every bracketed placeholder before putting it into ChatGPT Scheduled. Keep `AUTOPUBLISH_AUTHORIZED=false` until you explicitly authorize unattended GitHub writes.

Set repository variables `ENGINE_REF` (a reviewed 40-character commit SHA from the public engine) and `PAGES_REPOSITORY` (`owner/repo` for your public Pages repository). Add a `PAGES_DEPLOY_KEY` secret whose public key has write access only to that Pages repository. The workflow validates pull requests and publishes only a private `main` push to the public `gh-pages` branch. Set Pages source to `gh-pages` at `/` after its first successful build. Keep the public `main` branch for reusable source, or use a separate public Pages repository if you want to fork the engine unchanged.

A hosted task must have connected mail read and label-write access plus GitHub read and private-file write access. Test those actions in a regular web chat before using the schedule. If an app requires interactive approval, unattended publication pauses at that action.
