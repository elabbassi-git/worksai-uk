#!/bin/bash
# worksai.uk auto-deploy for Spaceship cPanel hosting.
# Run by cron every minute. Checks the public `deploy` branch (built by GitHub Actions);
# when it has moved, downloads that build, sanity-checks it and switches the live
# document root (a symlink) to it in one atomic step. Keeps the last 3 builds.
# No credentials needed: the repository is public.
#
# Install (once): copy to ~/apps/worksai/deploy.sh, chmod 700, add the cron line:
#   * * * * * /bin/bash $HOME/apps/worksai/deploy.sh >/dev/null 2>&1
# Roll back: ln -sfn ~/apps/worksai/releases/<sha> ~/worksai.uk.new && mv -Tf ~/worksai.uk.new ~/worksai.uk
#   then echo <sha> > ~/apps/worksai/pinned   (remove the file to resume auto-deploy)
set -uo pipefail

REPO="elabbassi-git/worksai-uk"
BRANCH="deploy"
BASE="$HOME/apps/worksai"
LIVE="$HOME/worksai.uk"
KEEP=3
LOG="$BASE/deploy.log"

mkdir -p "$BASE/releases"
log() { echo "$(date -u '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

exec 9>"$BASE/.lock"
flock -n 9 || exit 0
[ -f "$BASE/pinned" ] && exit 0

# Head of the deploy branch via git smart-HTTP (no API rate limit, no git binary needed).
SHA=$(curl -fsS --max-time 20 "https://github.com/$REPO.git/info/refs?service=git-upload-pack" \
  | grep -ao "[0-9a-f]\{40\} refs/heads/$BRANCH" | head -1 | cut -d' ' -f1)
[ -n "$SHA" ] || exit 0
[ "$SHA" = "$(cat "$BASE/current-sha" 2>/dev/null)" ] && exit 0
[ "$SHA" = "$(cat "$BASE/failed-sha" 2>/dev/null)" ] && exit 0

TMP="$BASE/releases/.tmp-$SHA"
rm -rf "$TMP" && mkdir -p "$TMP"
if ! curl -fsSL --max-time 180 "https://codeload.github.com/$REPO/tar.gz/$SHA" | tar -xz -C "$TMP" --strip-components=1; then
  log "download failed for $SHA (will retry)"; rm -rf "$TMP"; exit 1
fi
for f in index.html 404.html robots.txt sitemap.xml llms.txt .htaccess; do
  if [ ! -s "$TMP/$f" ]; then
    log "REJECTED $SHA: $f missing"; echo "$SHA" > "$BASE/failed-sha"; rm -rf "$TMP"; exit 1
  fi
done

rm -rf "$BASE/releases/$SHA"
mv "$TMP" "$BASE/releases/$SHA"

# First run: the document root is a plain directory. Keep it aside once.
if [ -d "$LIVE" ] && [ ! -L "$LIVE" ]; then
  mv "$LIVE" "$BASE/original-docroot-$(date -u +%Y%m%d%H%M%S)"
fi
ln -sfn "$BASE/releases/$SHA" "$LIVE.new" && mv -Tf "$LIVE.new" "$LIVE"
echo "$SHA" > "$BASE/current-sha"
log "deployed $SHA"

# Prune old builds (never the live one).
ls -1t "$BASE/releases" | grep -v "^$SHA$" | grep -v '^\.' | tail -n +"$KEEP" | while read -r old; do
  rm -rf "$BASE/releases/$old"
done
tail -n 500 "$LOG" > "$LOG.tmp" 2>/dev/null && mv "$LOG.tmp" "$LOG"
exit 0
