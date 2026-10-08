---
name: code-cleanse
description: Remove AI-generated clutter from code and tests. Use when asked to unslop or trim generated changes, especially redundant comments and brittle, defensive, or excessive tests.
disable-model-invocation: true
---

# Code cleanse

Remove clutter from the requested files or diff without changing intended behavior. Be ruthless: every comment and test carries maintenance cost and must earn its place. Delete marginal cases.

## Comments

Keep a comment when it records information the code cannot carry: rationale, a non-obvious invariant, an external constraint, a consequential side effect, or a security caveat. Preserve required API docs, licenses, and tool directives.

Shorten valuable comments to their essential point. Delete comments that narrate the code, restate names or types, label an obvious block, preserve development history, or explain a straightforward test.

## Tests

Apply a high bar to newly added tests. A test earns its place when it protects a consequential contract, a demonstrated regression, a critical workflow, authorization, security, data integrity, meaningful branching or coordination, or behavior likely to fail independently of the implementation under test. A small test can still be high-value when failure impact is high.

Remove tests that replay the changed implementation through assertions, especially for simple, low-risk behavior with no meaningful branching or coordination. Also remove a test when stronger coverage already protects the behavior or when it only checks an implementation detail, a framework or type-system guarantee, trivial permutations, incidental wording or structure, or hypothetical defensive behavior with no requirement or credible risk. Consolidate overlapping cases. Replace brittle coverage only when it guards material behavior.

## Finish

The cleanse is complete when every remaining comment adds information the code does not, every remaining test has distinct behavioral value, and intended behavior is unchanged.
