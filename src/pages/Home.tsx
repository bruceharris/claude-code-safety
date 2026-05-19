import { Link } from 'react-router-dom';
import { decks } from '../decks';

export function Home() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>Claude Code Safety</h1>
        <p style={styles.subtitle}>
          A series of slide decks on using Claude Code safely — for developers
          and engineering leads.
        </p>
      </header>
      <ul style={styles.list}>
        {decks.map((deck, i) => (
          <li key={deck.slug} style={styles.item}>
            <Link to={`/decks/${deck.slug}`} style={styles.link}>
              <span style={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={styles.deckTitle}>{deck.title}</div>
                <div style={styles.deckSummary}>{deck.summary}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '4rem 1.5rem',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1a1a1a',
  },
  header: { marginBottom: '2.5rem' },
  title: { fontSize: '2.25rem', margin: 0 },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
    marginTop: '0.75rem',
    lineHeight: 1.5,
  },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { marginBottom: '0.75rem' },
  link: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: 8,
    border: '1px solid #e5e5e5',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 120ms, background 120ms',
  },
  index: {
    fontFamily: 'ui-monospace, monospace',
    color: '#999',
    fontSize: '0.95rem',
    paddingTop: '0.15rem',
  },
  deckTitle: { fontWeight: 600, fontSize: '1.1rem' },
  deckSummary: {
    color: '#666',
    fontSize: '0.95rem',
    marginTop: '0.25rem',
    lineHeight: 1.4,
  },
};
