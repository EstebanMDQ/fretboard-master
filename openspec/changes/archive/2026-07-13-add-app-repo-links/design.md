## Context

Two one-line changes with a small CSS tweak. No new components, no state, no dependencies.

## Goals / Non-Goals

**Goals:**
- README links to the live Pages URL
- The built app links back to the GitHub repo

**Non-Goals:**
- Dynamic URL resolution (URLs are hardcoded constants - they don't change)
- Adding any other footer content

## Decisions

### Link placement in the app

The header already exists and contains the `<h1>` title. A repo link fits naturally alongside it - either as a GitHub icon (`<svg>` inline or a unicode character) or plain text. Plain `"GitHub"` text link keeps it simple and avoids adding an SVG asset.

Place it in the existing `app-shell__header` element, floated/flexed to the right. No new structural element needed.

**Alternative:** a `<footer>` element - rejected because the app is a single-panel tool UI with no natural footer zone; the header is already the right place for meta-links.

### README placement

Add the live app link near the top of the README, right after the description paragraph and before the Development section. Standard convention for project READMEs.

## Risks / Trade-offs

- [Risk] GitHub Pages URL changes if the repo is renamed or transferred - Mitigation: the URL is a hardcoded string in two places (README and AppShell); update both if that happens. Low probability.
