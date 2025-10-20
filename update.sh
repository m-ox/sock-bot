set -euo pipefail

cd /home/pi/sock-bot || exit 1

echo ">>> Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo ">>> Installing production dependencies..."
npm ci --omit=dev

echo ">>> Restarting PM2 process..."
pm2 restart sock-bot || pm2 start index.js --name sock-bot

echo ">>> Update complete."
