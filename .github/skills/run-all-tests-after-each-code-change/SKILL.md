---
name: run-all-tests-after-each-code-change
description: 'Use when implementing or editing code and the user requires all tests after each change. Triggers: run all tests after every change, test after each code change, full suite every edit, verify every patch.'
argument-hint: 'Describe the code change to implement'
---

# Run All Tests After Each Code Change

Run every repository test suite after each atomic code change, before making another code change. Do not substitute targeted tests for the full suites.

## Procedure

1. Discover the complete test inventory before editing. Inspect package scripts, workspace/package manifests, test-runner configuration, and CI workflows. Record the exact command, working directory, prerequisites, and required environment for each test suite. Include unit, integration, end-to-end, and package/workspace suites that CI or project scripts define.
2. Run all discovered suites once before the first edit. Record existing failures, skips, and environment blockers as the baseline. Do not silently exclude a suite because it is slow or unrelated to the edited file.
3. Make one atomic change set. A change set may touch multiple files that implement one cohesive behavior; finish that patch and stop editing.
4. Run each complete test suite from the inventory, without test-name filters, in sequence. Do not make another code change while a suite is running or before all suites finish.
5. Compare results with the baseline. If a new failure appears, diagnose and fix that regression in the same behavior area, then rerun every full suite before continuing. Each repair is another code change and must be followed by all suites again.
6. If a failure was present in the baseline, report it as pre-existing and verify that it has not worsened. Do not fix unrelated failures unless requested.
7. If a suite cannot run because of missing prerequisites, configuration, or environment access, report the exact blocker and do not claim full verification. Do not replace it with a narrower command without the user's approval.
8. After all suites pass, continue with the next atomic change set. At completion, summarize the suites run and their results, including any baseline failures or unverified suites.

## Test Safety

- Use the repository's documented test commands and intended test configuration.
- Inspect test side effects before running suites that access databases, external services, or user data. Prefer the project's isolated test database and fixtures; never point tests at production or a personal database.
- Run suites sequentially when they share ports, databases, files, or other mutable resources.
- If the repository has no discoverable test suite, say so. Do not invent a passing test command or imply that tests were run.

## Completion Criteria

- Every discovered test suite ran after each atomic code change.
- Regressions were fixed and all suites rerun before additional edits.
- Final reporting distinguishes passing, pre-existing failing, and blocked or unrun suites.