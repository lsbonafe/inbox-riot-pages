# Hosted task template

Adapt the [sample task prompt](../templates/private-instance/SCHEDULE_PROMPT.md) for your instance, then paste it into your LLM's scheduled task. A hosted scheduled task accesses connected services and may not have a local checkout. The prompt therefore needs the private repository name, source label path, processed label path, interests, destination URL, and exact actions in full. Test the same prompt in an interactive session before enabling the schedule. If your email or GitHub connection cannot perform an essential write, the run must report the block and leave processing labels unchanged.

The generic editorial contract is in `MASTER_PROMPT.md`. A complete, fill-in prompt is in `templates/private-instance/SCHEDULE_PROMPT.md`.
