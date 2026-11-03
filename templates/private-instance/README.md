# Private instance starter

Copy this directory into a new **private** GitHub repository. Replace every `Example` value in `config/site.json`; add your own edited issue JSON and approved assets. Fill every bracketed placeholder in `SCHEDULE_PROMPT.md`, including the reading and watching label plus distinct processed and skipped labels. Keep `AUTOPUBLISH_AUTHORIZED=false` until you explicitly authorize unattended GitHub writes. Put the completed prompt at `editorial/SCHEDULE_PROMPT.md` in your private repository.

Fill `[PRIVATE_REPOSITORY]` in `SCHEDULE_BOOTSTRAP.md` and paste that short bootstrap into your LLM's scheduled task. Each run fetches the latest committed private prompt; the schedule itself stays in the task settings. Test that the connected GitHub tool can read the private file. If it cannot, the task must stop without reading email or changing labels.

Set repository variables `ENGINE_REF` (a reviewed 40-character commit SHA from the public engine) and `PAGES_REPOSITORY` (`owner/repo` for your public Pages repository). Add a `PAGES_DEPLOY_KEY` secret whose public key has write access only to that Pages repository. The workflow validates pull requests and publishes only a private `main` push to the public `gh-pages` branch. Set Pages source to `gh-pages` at `/` after its first successful build. Keep the public `main` branch for reusable source, or use a separate public Pages repository if you want to fork the engine unchanged.

A hosted task must have connected mail read and label-write access plus GitHub read and private-file write access. Test those actions in an interactive session before using the schedule. If an app requires interactive approval, unattended publication pauses at that action.
