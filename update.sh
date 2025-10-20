#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 >/dev/null

APP_DIR="/home/pi/sock-bot"
cd "$APP_DIR" || exit 1

echo ">>> Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo ">>> Installing production dependencies..."
npm install --omit=dev || { echo "npm install failed"; exit 1; }

echo ">>> Restarting PM2 process..."
pm2 restart sock-bot >/dev/null 2>&1 || pm2 start index.js --name sock-bot

echo ">>> Update complete at $(date)"
