# Claude Code Safety

A series of slide decks teaching safe use of Claude Code: hooks, sandbox, permissions, and permission modes.

Built with [Spectacle](https://commerce.nearform.com/open-source/spectacle/) (React-based) + Vite + TypeScript. MDX is wired in for prose-heavy slides; quizzes and other interactive widgets live as React components.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

The landing page lists every deck. Each deck is a route under `/decks/<slug>`.

## Project layout

```
src/
  App.tsx                  router; lazy-loads each deck
  decks.ts                 single source of truth for the deck list (slug, title, summary)
  main.tsx                 React entry
  mdx.d.ts                 type declaration for *.mdx imports
  pages/
    Home.tsx               landing page
  components/
    Quiz.tsx               shared MCQ / true-false quiz widget
  decks/
    overview/index.tsx     fully-scaffolded shell with title, content, and quiz slides
```

More decks (hooks, sandbox, permissions, permission modes, layered defense) will be added under `src/decks/` as their content is authored.

## Authoring

### Adding a slide

Each deck's `index.tsx` is a `<Deck>` containing `<Slide>` children. Use Spectacle primitives (`Heading`, `Text`, `UnorderedList`, `ListItem`, `FlexBox`, `CodePane`) inside each slide. Speaker notes go in a `<Notes>` element inside the slide — they show up in presenter mode (Spectacle: <kbd>Alt</kbd>+<kbd>P</kbd>).

```tsx
<Slide>
  <Heading>Slide title</Heading>
  <Text>Body content.</Text>
  <Notes>Speaker-only context.</Notes>
</Slide>
```

### Adding a quiz

Import the `Quiz` component and drop it into any slide:

```tsx
import { Quiz } from '../../components/Quiz';

<Slide>
  <Heading fontSize="h3">Quick check</Heading>
  <Quiz
    question="..."
    options={[
      { text: 'A', correct: false, feedback: 'Why this is wrong.' },
      { text: 'B', correct: true,  feedback: 'Why this is right.' },
    ]}
  />
</Slide>
```

For true/false, just pass two options. For multi-select, set `mode="multiple"`.

The quiz works the same way live or self-paced — readers click an option, then "Check answer" to reveal feedback.

### Authoring slides in MDX

Spectacle's `<Slide>` components accept any children, so you can move prose-heavy sections into `*.mdx` files and import them as React components into the deck. The Vite MDX plugin is already configured. Recommended pattern:

```mdx
// src/decks/<slug>/IntroSlide.mdx
import { Slide, Heading } from 'spectacle';

<Slide>
  <Heading>Title</Heading>

  Markdown body. **Bold**, _italic_, lists, code — all native MDX.
</Slide>
```

Then in the deck:

```tsx
import IntroSlide from './IntroSlide.mdx';

<Deck>
  <IntroSlide />
  <Slide>...</Slide>
</Deck>
```

### Adding a new deck

1. Create `src/decks/<slug>/index.tsx` with `export default function ...Deck()` returning a `<Deck>`.
2. Add an entry to `src/decks.ts`.
3. Add a `lazy()` import for it in `src/App.tsx`'s `deckLoaders` map.
