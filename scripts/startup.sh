#!/bin/sh
set -e

echo "[oculus] Starting Next.js server on port ${PORT:-8080}..."
exec node server.js
