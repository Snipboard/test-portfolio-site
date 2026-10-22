# Benchmark external consumer smoke validation

This branch is a **non-invasive, review-only integration pilot** for the separate [Benchmark PR Quality Report](https://github.com/affank1020/benchmark) project.

The existing `npm run check` command still executes lint, TypeScript checks and the same coverage-threshold-enforced Node.js test suite exactly once. Its Node test reporter now additionally emits `junit.xml` and `lcov.info`. A read-only CI job uploads both files as `benchmark-ci`, even after a failure when results were produced.

The trusted `.github/workflows/benchmark-report.yml` calls the reviewed, immutable Benchmark PR #6 release on completion of `CI` for a pull request. It requests `issues: write` and `pull-requests: write` **only in the post-CI workflow**, not the PR test job.

## Activation and safe verification

1. Review this PR separately from Benchmark PR #7 and confirm no lint, type, test, build or coverage-threshold regression.
2. **Do not expect a Benchmark bot report on this integration PR**: GitHub only activates its `workflow_run` publisher when the workflow exists on the default branch. This is intentional.
3. After this PR is merged, confirm a successful `main` push CI run uploads one `benchmark-ci` artifact containing `junit.xml` and `lcov.info`. Earlier base commits lack the artifact.
4. Open a *new* PR against that baseline. Verify the separate trusted reporter updates one quality comment showing coverage baseline and percentage-point changes. Push another commit and check it updates rather than duplicates the comment.
5. To validate fork support, open a new PR from a separate fork. Verify that PR CI stays read-only and the trusted publisher associates the fork's repo ID, branch and head SHA with the correct open PR without executing fork code or receiving fork secrets.
6. Capture GitHub CI/publisher URLs and report comments in the [Benchmark PR #7 consumer validation plan](https://github.com/affank1020/benchmark/pull/7); record missing live scenarios explicitly.

**Important:** Portfolio-site's current Node coverage includes whatever sources the tests load. This pilot validates the GitHub integration plumbing; its percentages are **not** proof of complete coverage across Next.js pages and UI components. It does not change the existing numeric coverage thresholds.
