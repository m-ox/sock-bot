cd /home/pi/sock-bot || exit 1
git fetch origin main
if ! git diff --quiet HEAD origin/main; then
  git pull origin main
  npm install --production
  pm2 restart sock-bot
fi
