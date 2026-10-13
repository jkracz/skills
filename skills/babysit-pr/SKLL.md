---
name: babysit
description: Watch a PR through CI and review until it's mergeable — fix what matters, reply to what doesn't. Use when asked to babysit, watch, or shepherd a PR.
---

Call `watch_pull_request`, deal with what's already on the PR, then end the turn and act on each wake.

## Triage

Check every finding against the current code before acting on it.

- **Fix:** real defects in this PR's scope, meaning correctness, security, authorization, data integrity, or accessibility.
- **Skip:**
  - TSDoc and comment-style requests, which need no reply.
  - Nits, speculative hardening, and process or tooling changes.
  - Anything that grows scope. When unsure, skip and say why.
  - Major scope creep
- **Valid but out of scope:** reply with the reason and suggest a follow-up ticket. Don't create the ticket.

## Replies

- Reply in the finding's thread, never in a top-level comment.
- For a fix, one line naming the commit. For a skip, one or two sentences of reasoning.
- Don't resolve threads. <!-- decide: or resolve after a fix -->

## Branch upkeep

- Run `pnpm check`, typecheck, and the full suite before every push.
- Update with `main` by rebasing, then push with `--force-with-lease`.
- If a push changes behavior, test counts, or evidence, update the PR description.

## Stopping

- Keep watching through re-reviews your own pushes trigger.
- Stop at whichever comes first:
  - Checks are green and the latest review has nothing unaddressed.
  - 3 fix rounds. <!-- decide: cap -->
- Then `unwatch_pull_request` and report what you fixed, what you skipped and why, and anything that needs my decision.
- Never merge unless explicitly asked.
