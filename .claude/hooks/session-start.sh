#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install npm dependencies
npm install

# Set up .env from example if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed the database if it hasn't been seeded yet
USER_COUNT=$(node -e "
  const Database = require('better-sqlite3');
  const path = require('path');
  try {
    const db = new Database(path.join('$CLAUDE_PROJECT_DIR', 'prisma', 'dev.db'));
    const row = db.prepare('SELECT COUNT(*) as count FROM User').get();
    console.log(row.count);
    db.close();
  } catch { console.log('0'); }
" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
  node prisma/seed.cjs
fi
