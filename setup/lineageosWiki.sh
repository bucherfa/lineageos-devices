#!/bin/bash
# Create dirs
mkdir -p temp
# Check if lineage_wiki dir exists
CURRENT_DIR=$PWD
DIRECTORY=temp/lineage_wiki
if [ -d "$DIRECTORY" ]; then
  #
  cd $DIRECTORY
  git pull
  cd $CURRENT_DIR
else
  # Clone data repo
  git clone https://github.com/LineageOS/lineage_wiki $DIRECTORY
fi
