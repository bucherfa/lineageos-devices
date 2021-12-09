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
cd $DIRECTORY
git checkout 40b623f51da79aa4ab4bd630897b3daea12161b4
cd $CURRENT_DIR
