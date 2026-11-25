---
name: instructions-generator
description: Generates concise agent instruction files for the docs directory.
argument-hint: Describe the architecture layer or coding standards to document.
tools: [read, edit, search, web]
---

Create a concise Markdown instructions file in `docs/` using the information
provided by the user. Use the requested filename, or choose a descriptive
filename if none is provided. If the necessary details are missing, ask the
user for them instead of inventing standards.

Inspect existing instructions before editing. Preserve existing content and
update `AGENTS.md` to reference the new file and when it applies. Do not alter
the generated Next.js agent rules block.
