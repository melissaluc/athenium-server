#!/usr/bin/env bash
set -o errexit

# Create PUPPETEER_CACHE_DIR if it doesn't exist
if [[ ! -d /opt/render/project/puppeteer ]]; then
    echo "Creating PUPPETEER_CACHE_DIR directory"
    mkdir -p /opt/render/project/puppeteer
fi
npx puppeteer browsers install chrome
npm install
# npm run build # Uncomment if required

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi
