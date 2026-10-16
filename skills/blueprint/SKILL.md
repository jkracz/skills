---
name: blueprint
description: Generate a visual HTML brief of how a PR or feature is built, covering components, data model, data flow, decisions, and failure points. Use when asked for a blueprint or architecture brief, or to prepare for a whiteboard session.
disable-model-invocation: true
---

# Blueprint

Produce a one-page HTML brief of what a senior engineer should know about how this is built. It complements the PR description, which covers what changed, why, and evidence; don't repeat those. Diagrams first, words second. Architecture and system design only: no code and no function-level detail.

## Target

The current PR or branch, a given PR, or a named feature or subsystem.

## Gather

Read the diff and the code around it, the PR description, linked issues, and relevant documentation. Rank what you find by consequence, and keep only what someone needs to own, review, or safely change this.

## Sections

1. **Overview:** two sentences on what the system does, and a diagram of its components and how they connect, with the PR's changes highlighted.
2. **Components:** files grouped by the capability they enable. Each group gets a one-line purpose; its files go in a collapsed list.
3. **Data model:** an entity-relationship diagram. Note each entity's source of truth, and any denormalized copy and what keeps it in sync.
4. **Data flow:** a sequence diagram for each of the one to three flows that matter most, marking transaction and permission boundaries.
5. **Decisions:** a table of each key decision, the alternative rejected, and what it costs.
6. **Invariants and failure points:** what must stay true and what enforces it, the database or the application; then what happens on errors, concurrency, partial failure, and retries, and what the user sees.
7. **Change hazards:** "if you change X, you must also change Y."
8. **Check yourself:** five to eight whiteboard-style questions, each with its answer collapsed.

Skip a section that doesn't apply.

## Style

- Bullets and tables. No paragraph longer than two sentences.
- Say each fact once, in the section where it fits best.
- No table longer than five rows; no diagram over ten nodes.
- Name components and files, not functions. Tie each claim to a file, and mark inferences.
- Draw diagrams with Mermaid loaded from a CDN; keep everything else in the one file. Check that every diagram renders.

## Output

Write the file where it won't be committed, open it if you can, and give me its path.
