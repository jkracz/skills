---
name: ship
description: Take a thought-through task to a babysat PR.
disable-model-invocation: true
---

Take the ticket from implementation to a merged-ready PR. Commit after each step. If the task has open questions or is ambiguous, talk to the human first.

1. **Implement** the ticket with the /implement skill. If the ticket leaves a real gap in behavior or scope, stop and ask instead of guessing.
2. **Test** it in the running app as each kind of user it affects, using the /clerk-agent-testing skill. Fix what you find.
3. **Review** with an agent from a different model family than the one that wrote the code, using the /code-review skill. Fix findings that matter; skip scope creep.
4. **Audit** the diff with the /code-cleanse skill, also run by a different model family. Check its edits before keeping them.
5. **Capture evidence** once the code is final: screenshots and recordings of the critical flows. Store them where they won't be committed.
6. **Open the PR** from the repo's template with the evidence attached, then babysit it with the /babysit skill. You can attach files to a PR using the gh cli with --attach.

Ask before changing the ticket's scope or making a schema change that existing data won't satisfy.
