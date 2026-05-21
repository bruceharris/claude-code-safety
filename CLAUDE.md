# CLAUDE.md

A series of slide decks teaching safe use of Claude Code (hooks, sandbox, permissions, permission modes). Built with Spectacle 10 + Vite + TypeScript.

## Commands

- `npm run dev` — dev server at http://localhost:5173
- `npm run build` — typecheck + production build
- `npm run preview` — preview production build

## Architecture

Single Vite SPA. The router lazy-loads one Spectacle `<Deck>` per route. **Adding or removing a deck requires updating two files in sync** — otherwise navigation silently breaks:

- `src/decks.ts` — landing-page list (slug, title, summary)
- `src/App.tsx` — `deckLoaders` map (`slug → lazy(() => import(...))`)

Slides live in `src/decks/<slug>/index.tsx` as Spectacle TSX components (`<Slide>`, `<Heading>`, `<Notes>`, etc.). MDX is wired in (`@mdx-js/rollup`) for prose-heavy slides but is not the default authoring format.

The `Quiz` component (`src/components/Quiz.tsx`) uses inline styles so it renders cleanly over Spectacle's themed slides — don't move it to global CSS.

## Content guidelines

- decks are not intended to be consumed independent of the talk
- speaker notes
  - should be detailed bullets that the speaker will talk through
  - should be content oriented, should not contain instructions to the speaker
- audience facing slide content should be diagrams and/or very short bullets to anchor the oral content
- when creating new decks, text should match the authoring style of the text in 1-threat-model.md
- speaker will be looking at the notes, not the slides, so it's fine to duplicate the slide bullets on the speaker notes, and to nest speaker-only bullets under the bullets that also appear on the slides
