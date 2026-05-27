import { lazy, Suspense } from 'react';
import {
  HashRouter,
  Route,
  Routes,
  Navigate,
  useParams,
} from 'react-router-dom';
import { Home } from './pages/Home';
import { decks } from './decks';

const deckLoaders: Record<string, ReturnType<typeof lazy>> = {
  'threat-model': lazy(() => import('./decks/threat-model')),
  permissions: lazy(() => import('./decks/permissions')),
};

function DeckRoute() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || !(slug in deckLoaders)) return <Navigate to="/" replace />;
  const Deck = deckLoaders[slug];
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading deck…</div>}>
      <Deck />
    </Suspense>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks/:slug" element={<DeckRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

// Re-export so the build picks up the deck modules even if not yet linked.
export { decks };
