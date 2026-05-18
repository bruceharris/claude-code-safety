# Claude Code's Default Sandbox Has an Escape Hatch You Didn't Opt Into

Enabling Claude Code's sandbox under `bypassPermissions` ("YOLO") mode isn't
enough to enforce it. If you don't also set `"allowUnsandboxedCommands": false`,
the model can escape the sandbox autonomously — no prompt, no user consent.

## The minimal "secure-looking" config doesn't enforce

```json
{
  "sandbox": {
    "enabled": true
  }
}
```

`allowUnsandboxedCommands` is omitted here, so it falls to its [documented
default of `true`](https://code.claude.com/docs/en/sandboxing#configure-sandboxing).
Under that default, when a `Bash` call fails the sandbox, Claude auto-retries
the same command with `dangerouslyDisableSandbox: true`. In
[`bypassPermissions` mode](https://code.claude.com/docs/en/permissions#permission-modes),
that retry is auto-approved — no permission prompt is shown to the user.

We confirmed this end-to-end with the minimal config above:

1. Sandbox blocks the first call: `operation not permitted`.
2. Claude announces: *"Retrying with sandbox disabled."*
3. Claude issues the same command again with `dangerouslyDisableSandbox: true`.
4. The write succeeds, outside the sandbox's narrow allowlist.

Zero user interaction. The escape is over before you can react.

The same experiment with `"allowUnsandboxedCommands": false` produced the
opposite outcome: the model didn't even attempt the retry.

## Key takeaway

**Enabling the sandbox is not the same as enforcing it.** If you run Claude
Code with `--dangerously-skip-permissions` or `--permission-mode bypassPermissions`,
the sandbox is opt-in from the model's perspective unless you explicitly
harden it:

```json
{
  "sandbox": {
    "enabled": true,
    "allowUnsandboxedCommands": false
  }
}
```

Two lines, not one.
