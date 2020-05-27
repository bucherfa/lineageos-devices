#!/bin/bash
# Create dirs
mkdir -p temp/backup
# Backup old data.json
FILE=temp/data.json
if test -f "$FILE"; then
    cp $FILE "temp/backup/data.$(date +%F_%R).json"
fi
# Run data.json generator script
node setup/gatherData.js
