#!/bin/bash
# Create folder for small device images
mkdir -p static/devices
# Create folder for temp images
mkdir -p temp/device_images
# Remove transparency
for f in ./temp/lineage_wiki/images/devices/*.png; do
  magick convert "$f" -background white -alpha remove -alpha off "temp/device_images/${f##*/}"
done
# Scale images
magick mogrify -path static/devices -format jpg -geometry x168 temp/device_images/*.png
