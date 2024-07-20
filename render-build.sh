#!/usr/bin/env bash
# exit on error
set -o errexit

# Install npm dependencies
npm install

# Check if Chrome is already downloaded; if not, download and extract it
PUPPETEER_CACHE_DIR="/opt/render/project/.render/puppeteer"
export PUPPETEER_CACHE_DIR
if [[ ! -d $PUPPETEER_CACHE_DIR/chrome ]]; then
  echo "...Downloading Chrome"
  mkdir -p $PUPPETEER_CACHE_DIR/chrome
  cd $PUPPETEER_CACHE_DIR/chrome
  wget -P ./ https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -x ./google-chrome-stable_current_amd64.deb $PUPPETEER_CACHE_DIR/chrome
  rm ./google-chrome-stable_current_amd64.deb
  cd $HOME/project/src # Ensure we return to the original directory
else
  echo "...Using Chrome from cache"
fi

# Set Chrome binary path environment variable
export PUPPETEER_EXECUTABLE_PATH="$PUPPETEER_CACHE_DIR/chrome/opt/google/chrome/google-chrome"

echo "Listing contents of $PUPPETEER_EXECUTABLE_PATH"
ls -l $PUPPETEER_EXECUTABLE_PATH

installed_version=$(google-chrome --version)
echo "Installed Chrome version: $installed_version"

