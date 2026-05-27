export type DeckMeta = {
  slug: string;
  title: string;
  summary: string;
};

export const decks: DeckMeta[] = [
  {
    slug: 'threat-model',
    title: 'Session 1: The Threat Model',
    summary:
      'The lethal trifecta and the risk surface it organizes — foundational framing for the rest of the series.',
  },
  {
    slug: 'permissions',
    title: 'Session 2: Permission Rules and Modes',
    summary:
      "The in-process control layer — how rules are evaluated, the gotchas, and Claude Code's six permission modes.",
  },
];
