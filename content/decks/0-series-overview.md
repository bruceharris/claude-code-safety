# Claude Code Security: Workshop Series Proposal

A six-session series, 30 minutes per session, with 20 minutes of teaching followed by a 10-minute quiz and discussion block. Designed for engineers running Claude Code on their work machines and for anyone with team-level responsibility for how it's configured.

## Design principles

**One idea per session.** Twenty minutes is enough for a single concept with examples; it isn't enough for a survey. Each session is built around a concept that meaningfully changes how people think, not a list of features.

**Dependency order.** Each session builds on the previous. Threat model first because everything else is mitigation against it. Permission rules and modes before sandboxing because sandbox behavior depends on permission mode interaction. Hooks after both because hooks express policy the other two can't.

**Quiz before discussion.** The quiz surfaces what people got wrong; the discussion works through it. If discussion comes first, the quiz becomes a test of attention rather than a learning tool.

**Shared example codebase across sessions.** Sessions 2–5 use the same hypothetical repo with progressively tighter configuration. Continuity is what makes a series feel like a series rather than six standalone talks.

**Calibrated claims.** When two documented behaviors compose to produce a third, say so explicitly. Don't assert composed behaviors as if they were directly documented. Avoid rankings like "most important" without either a citation or an honest hedge.

---

## Session 1: The threat model

**Why agentic coding is different from running AI-generated code.**

Claude Code reads source files, dependencies, MCP server responses, web fetches, and your own prompts. Any of those channels can carry untrusted content. The central risk is prompt injection; everything else is its blast radius.

Topics:
- The lethal trifecta (private data access + untrusted input + external comms) and why having any two is much safer than having all three
- Where untrusted content enters: source, dependencies, MCP results, web fetches, prompts
- Why traditional code review doesn't catch agent-introduced issues
- The full risk surface: arbitrary command execution, file access beyond intent, data exfiltration channels, supply chain via MCP, credential exposure, approval fatigue, configuration drift across teams, transcript persistence, platform-specific footguns (e.g., WebDAV on Windows)

**Quiz:** Given three scenarios, identify which legs of the trifecta are present.
**Discussion:** "What's the most sensitive thing on your work machine? What would it take for Claude to read it? To exfiltrate it?"

---

## Session 2: Permission rules and modes

**Claude Code's primary defense — the lever you'll touch most often.**

This session covers everything in the permissions system because rules and modes only make sense together.

Topics:
- The deny → ask → allow evaluation order, first match wins
- Rule syntax for Bash, Read, Edit, WebFetch, MCP, Agent
- Wildcard semantics and the space-before-`*` word boundary rule
- Compound commands: each subcommand matched independently — a rule like `Bash(safe-cmd *)` does not authorize `safe-cmd && rm -rf .`
- Process wrapper stripping: `timeout`, `time`, `nice`, `nohup`, `stdbuf`, bare `xargs` are stripped; environment runners like `devbox run`, `mise exec`, `npx`, `docker exec` are not — so `Bash(devbox run *)` is much broader than it looks
- The always-free read-only bash set: `ls`, `cat`, `echo`, `pwd`, `head`, `tail`, `grep`, `find`, `wc`, `which`, `diff`, `stat`, `du`, `cd`, and read-only forms of `git` — not configurable, only overridable via `ask` or `deny`
- All six permission modes with their failure modes:
  - `default` — prompts on first use
  - `acceptEdits` — auto-approves edits and a fixed filesystem command set
  - `plan` — read-only exploration, no edits
  - `auto` — research preview, classifier-driven auto-approval with safety checks
  - `dontAsk` — fails closed, auto-denies anything not pre-approved
  - `bypassPermissions` — skips all prompts except `rm -rf /` and `rm -rf ~` circuit breakers
- Why permission rules are enforced by Claude Code, not the model — instructions in `CLAUDE.md` or your prompt can shape what Claude tries but can't change what's allowed

**Quiz:** Given a settings file and a tool call, predict the outcome. Match scenarios to appropriate permission modes.
**Discussion:** "What's on your current deny list? What's missing? Where is your team's policy implicit vs. explicit?"

---

## Session 3: Sandboxing

**The leap from "Claude asks permission" to "the OS prevents it regardless."**

The single highest-leverage protection available, and the place where misconfiguration produces the most surprising outcomes.

Topics:
- Seatbelt (macOS) and bubblewrap (Linux/WSL2) mechanics
- Filesystem isolation: default write boundary is the working directory, default read is broad
- Network isolation via out-of-sandbox proxy with domain allowlist
- The new-domain prompt: a key safety feature in normal operation; what happens to it when commands fall back to the regular permission flow
- How sandbox interacts with permission modes — `autoAllowBashIfSandboxed: true` is the default, which means sandboxed bash runs without prompting *even if* your rules say `ask: Bash(*)`. The sandbox boundary substitutes for the per-command prompt. This changes what "default mode" effectively means once sandboxing is enabled.
- Documented limitations: no TLS inspection in the built-in proxy, domain fronting risk on broad allowlists, the `allowUnixSockets` docker-socket footgun, `$PATH` and shell-rc write footguns
- The `dangerouslyDisableSandbox` escape hatch: it routes through the regular permission flow, so in default mode it prompts the user, but in `bypassPermissions` mode the prompt auto-approves. Setting `"allowUnsandboxedCommands": false` makes Claude Code ignore the parameter entirely. Worth treating as composed behavior of two documented systems rather than asserting bypass behavior as a single doc statement.
- YOLO + sandbox: what's still enforced (filesystem boundary, network allowlist, circuit breakers), what changes (working-directory writes silent, allowlisted domains free, escape hatch auto-approved unless disabled, MCP servers still outside sandbox), and the residual danger scenarios

**Quiz:** Given a sandbox config and an attack scenario, predict success/failure. Include a scenario specifically about the escape hatch under bypass mode.
**Discussion:** "Walk through your current allowlist out loud. Anything surprising? If you turned on YOLO right now with sandbox, what could still go wrong?"

---

## Session 4: Hooks

**Programmable policy — the lever for what rules can't express.**

Permission rules see static patterns. Hooks see the full command string at runtime, which means they can catch the things that defeat permission rules: compound commands, wrapper bypass, argument-based filtering.

Topics:
- The hook lifecycle: PreToolUse, PostToolUse, ConfigChange, SessionStart, Stop, PreCompact
- PreToolUse as runtime policy: deny, modify, or force-prompt a tool call
- Why hooks tighten policy but can't loosen a deny — deny and ask rules evaluate regardless of hook output
- PostToolUse for audit trails: cheap JSONL logging of every tool call
- ConfigChange for governance: block or audit settings changes mid-session
- HTTP-based hooks for centralized org policy via `allowedHttpHookUrls` and `httpHookAllowedEnvVars`
- `allowManagedHooksOnly` to lock hooks to managed scope
- Worked example: writing a PreToolUse hook that blocks `git push --force` even inside compound commands

**Quiz:** Given a malicious command pattern that defeats a permission rule, write the hook that catches it.
**Discussion:** "What's one rule you've wanted to enforce that permissions couldn't catch? What's the simplest hook that would catch it?"

---

## Session 5: Team and organizational governance

**From per-laptop trust to enforceable organizational floors.**

The shift in perspective most relevant for anyone with team or platform responsibility. Without managed settings, every developer's configuration is independent and drifts independently.

Topics:
- Settings precedence: managed → command line → local project → shared project → user
- **Important wrinkle to surface here**: the 5-level precedence ordering is largely descriptive for *permission rules*, because the docs explicitly say rules "merge across scopes rather than override" (https://code.claude.com/docs/en/settings — Settings precedence section). For `allow`/`ask`/`deny` lists, the deny→ask→allow eval order does the real work of resolving cross-scope conflicts within the merged set, not the precedence ordering. Where precedence has actual teeth for permission rules is the "only" toggles below and the "deny anywhere wins" rule. Worth calling out so the audience doesn't walk away thinking "managed allow > user allow" in a way that isn't actually how it works. (Surfaced during Session 2 prep when verifying slide 4's precedence claim against docs.)
- Managed settings as the only scope that can enforce a baseline
- The "only" toggles: `allowManagedPermissionRulesOnly`, `allowManagedHooksOnly`, `allowManagedMcpServersOnly`, `allowManagedReadPathsOnly`, `allowManagedDomainsOnly`
- `disableBypassPermissionsMode` and `disableAutoMode` for removing the modes you don't want anyone using
- Committing `.claude/settings.json` to version control for shared project policy
- OpenTelemetry telemetry for usage monitoring
- PostToolUse hooks for audit logging
- Data retention controls: `CLAUDE_CODE_SKIP_PROMPT_HISTORY`, `--no-session-persistence`, Zero Data Retention on Enterprise
- Trust verification: when it applies, when it's disabled (non-interactive `-p` mode, with `--worktree` as the exception)
- The MCP governance problem: MCP servers aren't audited by Anthropic and run inside the permission boundary

**Quiz:** Scenarios about which scope wins when settings conflict. Identify which managed-only settings would prevent specific failure modes.
**Discussion:** "If you were responsible for Claude Code policy across your team, what would you enforce centrally vs. leave to individuals? What's the smallest enforceable floor that actually moves the needle?"

---

## Session 6: Defense in depth and choosing your isolation level

**Tying it together. Sandbox is one layer; the question is what other layers belong underneath.**

Topics:
- Sandbox + permission rules + hooks as the in-process stack
- Dev containers for VM-level isolation on top
- Claude Code on the web: each session in an Anthropic-managed VM, git credentials kept outside the sandbox
- Remote execution: Coder and similar
- Deployment isolation: direct API vs. Bedrock vs. Vertex vs. LLM gateway — whether prompts traverse the public internet
- Three personas worked through together:
  - Solo dev on a side project with no secrets → sandbox + permissions probably enough
  - Dev on a shared codebase with real production credentials → container or VM isolation; never run YOLO without it
  - Automated agent in CI → `dontAsk` mode with tight allowlist, no MCP unless explicitly needed, full audit logging
- The honest summary: sandbox + YOLO removes catastrophic outcomes from the table; merely-bad outcomes are still very possible

**Quiz:** Match scenarios to appropriate isolation levels with justification.
**Discussion:** "Where are you now vs. where you should be? What's the single highest-leverage change you'd make this week?"

---

## Optional seventh session: Postmortem

If there's appetite for one more session after the first six land, a postmortem format consolidates the abstract material in a way that lectures can't.

Walk through a real or simulated incident: Claude got prompt-injected via a malicious dependency; here's what it tried; here's what stopped it at each layer; here's what didn't. Postmortem format — timeline, contributing factors, what worked, what would have helped.

The reason this works as a seventh rather than a first: people need the vocabulary from sessions 1–6 to follow the postmortem. Run too early, it's a horror story; run after the foundation is laid, it's a synthesis exercise.

---

## Cross-cutting threads

A few things appear across multiple sessions and are worth calling out explicitly so they're reinforced rather than introduced fresh each time:

**Composed behaviors.** When two systems interact to produce a third behavior — sandbox + permission mode determining whether the escape hatch prompts, sandbox + `autoAllowBashIfSandboxed` changing what "default mode" means in practice, hooks + permission rules with hooks unable to override denies — flag the composition explicitly. These are the highest-leverage things to understand and the easiest to get wrong.

**What's enforced by Claude Code vs. by the OS.** Permission rules are enforced by Claude Code; sandbox boundaries are enforced by the OS. The distinction matters because a compromised Claude can defeat the former but not the latter. Reinforce this in sessions 2, 3, and 6.

**What's documented vs. what's inferred.** Some claims in this material — like "bypass mode auto-approves the escape hatch prompt" — are composed from documented behaviors rather than stated directly. When teaching them, say so. The workshop should model good epistemic practice, not just transmit conclusions.

**Defaults are reasonable starting points, not finished configurations.** Across every session, the message is the same: defaults are dramatically better than nothing, the next 30 minutes of configuration buys you the next 80% of value, and ongoing maintenance is real but small.

---

## Production notes

**Pre-work for participants:** install Claude Code, install bubblewrap and socat if on Linux/WSL2, clone the shared example repo.

**Recommended cadence:** weekly. Slower than that loses momentum; faster doesn't leave time to internalize between sessions.

**Materials per session:** slide deck (~10 slides), shared example repo at the right configuration state, quiz (3–5 questions, multiple choice or short answer), discussion prompts (2–3 questions, the second and third held in reserve in case the first lands fast).

**Recording:** record each session and post the quiz answers separately a day later. Lets people who missed it catch up and lets attendees check their answers without the live pressure.

**Source material:**
- [Claude Code Security](https://code.claude.com/docs/en/security)
- [Permissions](https://code.claude.com/docs/en/permissions)
- [Sandboxing](https://code.claude.com/docs/en/sandboxing)
- [Settings](https://code.claude.com/docs/en/settings)
- [Hooks](https://code.claude.com/docs/en/hooks)
- [Anthropic Engineering — Beyond permission prompts](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [anthropic-experimental/sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) on GitHub