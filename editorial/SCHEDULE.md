# Hosted task template

Adapt the [sample task prompt](../templates/private-instance/SCHEDULE_PROMPT.md) in your private instance. Paste the [sample bootstrap](../templates/private-instance/SCHEDULE_BOOTSTRAP.md), filled with your repository name, into your LLM's scheduled task. Each hosted run fetches the latest committed private prompt through the connected GitHub tool; the task's schedule stays in its settings. The bootstrap must stop without reading email or making changes if that file cannot be fetched completely. Test the private GitHub read and essential email and GitHub writes in an interactive session before enabling unattended publication.

The generic editorial contract is in `MASTER_PROMPT.md`. The private prompt is the source of truth for run behavior and terminal labels; the public prompt and bootstrap are fill-in examples.
