#!/bin/bash
set -euo pipefail

APP_DIR="/home/pi/sock-bot"
NODE_DIR="/usr/local/node16"
NODE_BIN="$NODE_DIR/bin/node"
NPM_BIN="$NODE_DIR/bin/npm"
PM2_BIN="$NODE_DIR/lib/node_modules/pm2/bin/pm2"

echo ">>> Switching to $APP_DIR"
cd "$APP_DIR" || { echo "Error: cannot cd into $APP_DIR"; exit 1; }

echo ">>> Pulling latest code..."
/usr/bin/git fetch origin main
/usr/bin/git reset --hard origin/main

echo ">>> Installing production dependencies..."
"$NODE_BIN" "$NPM_BIN" ci --omit=dev || { echo "npm install failed"; exit 1; }

echo ">>> Restarting PM2 process..."
"$NODE_BIN" "$PM2_BIN" restart sock-bot >/dev/null 2>&1 || \
"$NODE_BIN" "$PM2_BIN" start index.js --name sock-bot

echo ">>> Update complete at $(date)"
