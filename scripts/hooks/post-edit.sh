#!/bin/bash
# ==========================================================================
# PostToolUse guard (advisory) — runs after Claude edits/writes a file.
# Flags leftover debug `console.log(` in source files so they don't ship.
# Reads the tool payload JSON on stdin; extracts file_path. Fail-open:
# any parsing/tooling problem exits 0 so it never blocks development.
# Model-agnostic: this is a plain shell script; it just happens to be wired
# as a Claude Code hook in .claude/settings.json.
# ==========================================================================
set -uo pipefail

payload=$(cat 2>/dev/null || true)
[ -z "$payload" ] && exit 0

file=$(printf '%s' "$payload" \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)
[ -z "$file" ] && exit 0

# Only source files under src/
case "$file" in
  *src/*.ts|*src/*.tsx) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

# console.error / console.warn are allowed (genuine alerts); console.log is not.
if grep -nE 'console\.log\(' "$file" >/dev/null 2>&1; then
  echo "Crucible guard: '$file' still contains console.log(). Remove debug logs before finishing this change (console.error / console.warn are fine for genuine, persistent alerts). — AGENTS.md rule on debug logs" >&2
  exit 2
fi

exit 0
