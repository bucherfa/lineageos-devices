const fs = require('fs')
const path = require('path')
const Jimp = require('jimp')

const sourceDir = path.join('temp', 'lineage_wiki', 'images', 'devices')
const destDir = path.join('static', 'devices')

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir)
}

fs.promises.readdir(sourceDir)
  .then((files) => {
    for (const file of files) {
      if (file.endsWith('.png')) {
        const destFileName = file.replace('.png', '.jpg')
        Jimp.read(path.join(sourceDir, file))
          .then((image) => {
            return image
              .resize(Jimp.AUTO, 168) // resize
              .background(0xFFFFFFFF)
              .write(path.join(destDir, destFileName)) // save
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }
  })
