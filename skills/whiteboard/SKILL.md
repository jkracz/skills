---
name: whiteboard
description: Quiz me, peer to peer, on how a PR or part of the codebase works at the architectural level, then score how well I know it. Use when asked to whiteboard a PR, branch, or feature.
disable-model-invocation: true
---

# Whiteboard

Interview me the way a staff engineer runs a design review: I explain how something works, you probe until you know where my understanding ends, then you teach me what I got wrong and score me.

Test architecture and reasoning, not recall. Ask about flows, boundaries, state ownership, decisions and their tradeoffs, invariants, failure modes, and change impact. Never ask for function names, signatures, file locations, component names, or anything I would normally look up. Start from a user scenario, but ask about the mechanism, the reason, or what breaks, not what the product does.

## Pick the target

- With no argument, use PR mode if the current branch differs from the default branch, otherwise codebase mode. A PR may be someone else's; then the question is whether I understand it well enough to approve it.
- In codebase mode with no topic, offer three consequential features or subsystems and let me pick or say "surprise me". Favor areas I haven't committed to.

## Prepare in silence

Read the diff and the code around it, the PR description, linked issues, and relevant documentation. Build a private answer key covering the areas above, ranked by consequence. Ask about the decisions everything else depends on, and skip incidental implementation details. Never show the answer key.

Split the target into segments by concern, not by file: 3–6 for a substantial PR or topic, fewer for a small one. If a PR is too trivial to discuss architecturally, say so and offer to widen to the system it touches.

Show me the agenda as neutral titles that reveal no answers, e.g. "How ingestion is triggered", not "The new push-based webhook queue". Let me reorder or skip segments.

## Run each segment

Ask one question at a time.

1. **Open** broadly and let me explain.
2. **Probe** with 2–4 follow-ups, each aimed at one thing:
   - A vague claim: make me name the mechanism ("it syncs" → "What triggers the sync, and who waits on it?").
   - A consequential gap: ask about something important I didn't mention, without naming it.
   - A wrong claim: don't correct it. Ask about its consequence so I can catch it myself.
3. **Adapt.** If I'm solid, go a level deeper into concurrency, scale, or a changed requirement. If I'm struggling, step back to the overall shape.
4. **Debrief** when the segment closes.

Never put the answer in the question. "What happens when a sync fails halfway?" is fine; "How does the retry queue preserve ordering when two workers claim the same job?" gives away a queue, retries, and a race. Don't praise or react to answers mid-segment. "I don't know" is a good answer; acknowledge it and move on.

## Debrief

Before correcting me, recheck each disputed claim against the code.

Classify each miss:

- **Misconception:** confidently wrong. Explain fully.
- **Gap:** something important I left out. Explain briefly.
- **Slip:** wrong at first but I corrected myself during probing. Note it only.

For each misconception and gap:

1. **You said:** my words, quoted.
2. **Actually:** the real behavior in a few sentences, or a short step-by-step trace for flows.
3. **Why it matters:** what my version would lead me to get wrong.
4. **Source:** one or two files or docs. Say when it's your inference.

Also name what I got right, in one line.

If I dispute a correction, recheck the code. If I'm right, fix the answer key and my score. In PR mode, if my account of intent and the code genuinely disagree, flag it as a possible bug, not a miss.

## Re-ask

After the last segment, re-ask one or two misconceptions with a fresh framing. Report the result as "corrected during session" without changing the original score.

## Score

Score each segment 0–4 on four dimensions, citing my own words as evidence for every score. Score what I said, not what I might have meant. Score only the dimensions a segment tested. Be stingy; a 4 is rare.

| Dimension | 0 | 2 | 4 |
|---|---|---|---|
| Accuracy | Mostly wrong | Right with notable errors | Nothing wrong |
| Depth | Names pieces only | Traces the flow | Explains mechanisms two levels down |
| Rationale | No why | States the why | Weighs tradeoffs and alternatives |
| Failure awareness | None | Obvious failures | Concurrency, partial failure, operability |

A confident wrong answer scores lower than "I don't know".

Overall score is the mean, scaled to 0–100, with a level:

- **Aware** (0–39): can name the pieces.
- **Familiar** (40–64): can trace the flow.
- **Fluent** (65–84): can explain why and what it costs.
- **Owner** (85–100): could carry the pager or lead the design review.

## Report

End with the level and score, a table of segment scores with brief notes, strengths, what I corrected during the session, possible bugs, a study list (most important first, each item tied to the miss it fixes), and a suggested next topic. State that the score covers only this target, not the whole codebase.
