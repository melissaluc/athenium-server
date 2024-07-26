#!/bin/bash
set -o errexit


apt-get update
# apt-get install -y binutils
apt-get install -y dpkg

# Install npm dependencies
npm install

# Define paths

PUPPETEER_CACHE_DIR="/app/puppeteer"
CHROME_DEB_URL="https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
CHROME_DEB_FILE="$PUPPETEER_CACHE_DIR/chrome/google-chrome-stable_current_amd64.deb"
CHROME_INSTALL_DIR="$PUPPETEER_CACHE_DIR/chrome/opt/google/chrome"

# Ensure directories exist
mkdir -p "$PUPPETEER_CACHE_DIR/chrome"

# Check if Chrome is already downloaded; if not, download it
if [[ ! -f $CHROME_DEB_FILE ]]; then
  echo "...Downloading Google Chrome"
  curl -o $CHROME_DEB_FILE $CHROME_DEB_URL
else
  echo "...Google Chrome already downloaded"
fi

# Extract Chrome if not already extracted
if [[ ! -d $CHROME_INSTALL_DIR ]]; then
  echo "...Extracting Google Chrome"
  dpkg -x $CHROME_DEB_FILE $CHROME_INSTALL_DIR
  # ar x $CHROME_DEB_FILE
  # tar -xvf $CHROME_INSTALL_DIR
else
  echo "...Google Chrome already extracted"
fi

# Set Chrome binary path environment variable
export PUPPETEER_EXECUTABLE_PATH="$CHROME_INSTALL_DIR/google-chrome"
echo "PUPPETEER_EXECUTABLE_PATH set to: $PUPPETEER_EXECUTABLE_PATH"

# Verify Chrome installation
echo "Listing contents of $PUPPETEER_EXECUTABLE_PATH"
ls -l $PUPPETEER_EXECUTABLE_PATH || true

installed_version=$($PUPPETEER_EXECUTABLE_PATH --version)
echo "Installed Chrome version: $installed_version"

# 