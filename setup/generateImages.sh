#!/bin/bash
# Create folder for small device images
mkdir -p static/devices
# Scale images
magick mogrify -path static/devices/ -geometry x168 temp/lineage_wiki/images/devices/*.png
