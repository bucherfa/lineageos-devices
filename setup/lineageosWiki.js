const fs = require('fs')
const path = require('path')
const process = require('process')
const childProcess = require('child_process')

main()

function main () {
  const wikiFolderPath = path.join('temp', 'lineage_wiki')

  fs.mkdirSync('temp', { recursive: true })

  if (!fs.existsSync(wikiFolderPath)) {
    childProcess.execSync(`git clone "https://github.com/LineageOS/lineage_wiki" "${wikiFolderPath}"`)
  } else {
    const cwd = process.cwd()

    process.chdir(wikiFolderPath)
    childProcess.execSync('git pull')
    process.chdir(cwd)
  }
}
