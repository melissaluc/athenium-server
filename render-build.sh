#!/usr/bin/env bash
# exit on error
set -o errexit

# Install npm dependencies
npm install

# Set the cache directory for Puppeteer
export PUPPETEER_CACHE_DIR="/opt/render/project/puppeteer"

# Check if Chrome is already downloaded; if not, download and extract it
STORAGE_DIR="/opt/render/project/.render"
if [[ ! -d $STORAGE_DIR/chrome ]]; then
  echo "...Downloading Chrome"
  mkdir -p $STORAGE_DIR/chrome
  cd $STORAGE_DIR/chrome
  wget -P ./ https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -x ./google-chrome-stable_current_amd64.deb $STORAGE_DIR/chrome
  rm ./google-chrome-stable_current_amd64.deb
  cd $HOME/project/src # Ensure we return to the original directory
else
  echo "...Using Chrome from cache"
fi

# Set Chrome binary path environment variable
export PUPPETEER_EXECUTABLE_PATH="/opt/render/project/.render/chrome/opt/google/chrome/google-chrome"

# Start your application or server here
# Example: node app.js
