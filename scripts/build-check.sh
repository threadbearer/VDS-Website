#!/bin/bash
# Wrapper around npm run build to minimize AI context token bloat

echo "Running production build (filtered output)..."

# Run build, redirect stderr to stdout, and capture it
OUTPUT=$(npm run build 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Build completed successfully."
else
  echo "❌ Build failed. Extracting critical errors:"
  echo ""
  # Use grep to find lines with 'Error:' or 'failed' and print 5 lines around them,
  # but limit the total output to 40 lines to save LLM context window tokens.
  echo "$OUTPUT" | grep -i -A 5 -B 2 -E "Error:|failed|not found|doesn't exist" | head -n 40
fi

exit $EXIT_CODE
