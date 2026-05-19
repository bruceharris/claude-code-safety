import { useState, type CSSProperties } from 'react';

export type QuizOption = {
  text: string;
  correct: boolean;
  feedback?: string;
};

export type QuizProps = {
  question: string;
  options: QuizOption[];
  mode?: 'single' | 'multiple';
};

export function Quiz({ question, options, mode = 'single' }: QuizProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (idx: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(mode === 'single' ? [] : prev);
      if (mode === 'single' || !prev.has(idx)) next.add(idx);
      else next.delete(idx);
      return next;
    });
  };

  const reset = () => {
    setSelected(new Set());
    setSubmitted(false);
  };

  const allCorrect =
    submitted &&
    options.every((opt, i) => opt.correct === selected.has(i));

  return (
    <div style={styles.container}>
      <div style={styles.question}>{question}</div>
      <div style={styles.options}>
        {options.map((opt, i) => {
          const isSelected = selected.has(i);
          const showResult = submitted;
          const isCorrect = opt.correct;
          const optionStyle: CSSProperties = {
            ...styles.option,
            ...(isSelected ? styles.optionSelected : {}),
            ...(showResult && isCorrect ? styles.optionCorrect : {}),
            ...(showResult && isSelected && !isCorrect
              ? styles.optionIncorrect
              : {}),
            cursor: submitted ? 'default' : 'pointer',
          };
          return (
            <div key={i} style={optionStyle} onClick={() => toggle(i)}>
              <div style={styles.optionRow}>
                <span style={styles.bullet}>
                  {showResult
                    ? isCorrect
                      ? '✓'
                      : isSelected
                        ? '✗'
                        : '·'
                    : isSelected
                      ? '●'
                      : '○'}
                </span>
                <span style={styles.optionText}>{opt.text}</span>
              </div>
              {showResult && opt.feedback && (isSelected || isCorrect) && (
                <div style={styles.feedback}>{opt.feedback}</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={styles.controls}>
        {!submitted ? (
          <button
            style={styles.button}
            disabled={selected.size === 0}
            onClick={() => setSubmitted(true)}
          >
            Check answer
          </button>
        ) : (
          <>
            <span style={allCorrect ? styles.resultGood : styles.resultBad}>
              {allCorrect ? 'Correct!' : 'Not quite — review and try again.'}
            </span>
            <button style={styles.button} onClick={reset}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    background: '#ffffff',
    border: '1px solid #d4d4d4',
    borderRadius: 12,
    padding: '1.25rem 1.5rem',
    margin: '1rem 0',
    fontSize: '1.5rem',
    lineHeight: 1.4,
    maxWidth: '90%',
    color: '#111111',
  },
  question: {
    fontWeight: 600,
    marginBottom: '1rem',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  option: {
    background: '#ffffff',
    border: '1px solid #d4d4d4',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    transition: 'background 120ms, border-color 120ms',
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  bullet: {
    display: 'inline-block',
    width: '1.25rem',
    textAlign: 'center',
    fontFamily: 'ui-monospace, monospace',
  },
  optionText: { flex: 1 },
  optionSelected: {
    background: '#f3f4f6',
    borderColor: '#6b7280',
  },
  optionCorrect: {
    background: '#dcfce7',
    borderColor: '#16a34a',
  },
  optionIncorrect: {
    background: '#fee2e2',
    borderColor: '#dc2626',
  },
  feedback: {
    marginTop: '0.5rem',
    fontSize: '1.1rem',
    opacity: 0.75,
    fontStyle: 'italic',
  },
  controls: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  button: {
    background: '#ffffff',
    border: '1px solid #111111',
    color: '#111111',
    borderRadius: 6,
    padding: '0.5rem 1rem',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
  resultGood: { color: '#15803d', fontWeight: 600 },
  resultBad: { color: '#b91c1c', fontWeight: 600 },
};
