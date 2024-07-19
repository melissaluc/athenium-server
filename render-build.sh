#!/usr/bin/env bash
# exit on error
set -o errexit


# npx puppeteer browsers install chrome


npm install  # Install dependencies using npm
# npm run build # Uncomment this if you have a build step

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "Puppeteer cache directory not found, creating it."
  mkdir -p $PUPPETEER_CACHE_DIR
  # Optionally, you can initialize the directory with any necessary files or data
fi

# Copy Puppeteer cache
if [[ -d $XDG_CACHE_HOME/puppeteer/ ]]; then
  echo "Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/* $PUPPETEER_CACHE_DIR
else 
  echo "No Puppeteer Cache found to copy."
fi
