#!/bin/bash
# exit on failure
set -e
# Backup old data.json
FILE=extra/data.json
if test -f "$FILE"; then
    cp $FILE "extra/data.backup.$(date +%F_%R).json"
fi
# Create dirs
mkdir -p temp
# Delete clone dir if exists
rm -rf temp/lineage_wiki
# Clone data repo
git clone https://github.com/LineageOS/lineage_wiki temp/lineage_wiki
# Run data.json generator script
node setup/gatherData.js
# Create folder for small device images
mkdir -p static/devices
# Scale images
magick mogrify -geometry x168 temp/lineage_wiki/images/devices/*.png
# Move images to assets
cp temp/lineage_wiki/images/devices/*.png static/devices/
# Remove data repo
rm -rf temp
