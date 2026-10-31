# Hosted task template

Copy and personalize the private task prompt from your instance repository into ChatGPT Scheduled. Web scheduled tasks access connected services; they do not retain a local checkout. The prompt therefore needs the private repository name, source label path, processed label path, interests, destination URL, and exact actions in full. Test the same prompt in a regular web chat before enabling the schedule. If your Gmail or GitHub connection cannot perform an essential write, the run must report the block and leave processing labels unchanged.

The generic editorial contract is in `MASTER_PROMPT.md`. A complete, fill-in prompt is in `templates/private-instance/SCHEDULE_PROMPT.md`.
