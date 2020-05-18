#!/bin/bash
# Create dirs
#mkdir -p temp
# Clone data repo
#git clone https://github.com/LineageOS/lineage_wiki temp/lineage_wiki
# Run data.json generator script
##node gatherData.js
# Create folder for small device images
mkdir -p static/devices
# Scale images
magick mogrify -geometry x168 temp/lineage_wiki/images/devices/*.png
# Move images to assets
cp temp/lineage_wiki/images/devices/*.png static/devices/
exit 1
# Remove data repo
rm -rf temp
