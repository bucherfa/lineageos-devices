const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const replaceExt = require('replace-ext')

main()

async function main () {
  const sourceImagePath = path.join('temp', 'lineage_wiki', 'images', 'devices')
  const smallImagePath = path.join('static', 'devices')

  fs.mkdirSync(smallImagePath, { recursive: true })

  const files = await fs.promises.readdir(sourceImagePath)

  for (const file of files) {
    if (path.extname(file) !== '.png') { continue }

    if (fs.existsSync(path.join(smallImagePath, replaceExt(file, '.jpg')))) { continue }

    childProcess.execSync(`magick mogrify -path static/devices -format jpg -geometry x168 -background white -alpha remove -alpha off "${path.join(sourceImagePath, file)}"`)
  }
}
