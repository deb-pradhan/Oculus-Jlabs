#!/bin/sh
set -e

echo "[oculus] Syncing blog posts to database..."
npx tsx scripts/sync-posts.ts || echo "[oculus] Warning: sync-posts failed, continuing..."

echo "[oculus] Starting Next.js server on port ${PORT:-8080}..."
exec node server.js
