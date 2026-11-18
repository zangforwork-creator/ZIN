# GitHub build repair

The supplied `Build Error` link resolves to a missing root file. The retained
copy in `Archives/Unclassified originals/Build Error` is zero bytes, so the exact
GitHub failure could not be read.

## Reproduced and repaired in Studio

A clean archive of the Studio Git HEAD failed in `scripts/build-worker.mjs`
with `ENOENT` for a Chapter 1 PDF. Private course originals are deliberately
excluded from Git. The upload unit test also depended on an untracked local PPT.

- Normal builds now omit missing private lecture originals with an explicit
  warning. They retain the authored lessons and existing private-library API.
- Present originals still require the expected byte length and SHA-256.
- `STUDIO_REQUIRE_PRIVATE_MATERIALS=1` makes missing originals a build error for
  a private release that requires both PDFs.
- `STUDIO_MATERIALS_DIR` can select a different private library directory.
- The upload test now uses synthetic bytes and tests the real checksum and
  multipart-validation code without requiring personal documents.
- `.nvmrc` selects Node 22, matching the documented supported build environment.

Use `zin-study-studio` as the build working directory:

```text
npm ci
npm run check
npm test
npm run build
```

Studio is a Worker application, with entry `dist/server/index.js`, static assets
in `dist/client`, and its existing `BUCKET` binding. GitHub Pages cannot host its
server endpoints. No private original needs to be committed to make CI pass.

## Verification

On this machine (Windows, Node 26.13.1), syntax checks, 32 unit tests and the local
build pass. An isolated archive of the tracked Studio source, with only the
repaired files overlaid and the installed dependencies provided, also passes all
32 tests and the build without any private course library. Dependency versions
and lockfile were not changed. No GitHub Actions run, remote push or new hosted
deployment was performed. Node 22 was not independently exercised here.

## Unresolved workspace Git configuration

The outer `D:\ZinGPT` repository records `zin-study-studio` as a Git link
(`160000`) but has no `.gitmodules` mapping. `git submodule status` therefore
fails with `no submodule mapping found in .gitmodules for path
'zin-study-studio'`. The outer workspace also has no root `package.json`.

The outer index, nested repository history and Git remotes were preserved. The
GitHub error text or failed Actions run URL and repository name are still needed
to determine whether the failed job builds Studio directly, initializes the
incomplete submodule, or runs npm from the outer workspace. This patch does not
claim to resolve that unknown remote failure.
