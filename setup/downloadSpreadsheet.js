const fs = require('fs')
const path = require('path')
const https = require('follow-redirects').https

main()

function main () {
  const spreadsheetFolderPath = path.join('temp', 'spreadsheet')
  const backupSpreadsheetFolderPath = path.join(spreadsheetFolderPath, 'backup')

  fs.mkdirSync(backupSpreadsheetFolderPath, { recursive: true })

  const filePath = path.join(spreadsheetFolderPath, 'spreadsheet.csv')

  if (fs.existsSync(filePath)) {
    const now = new Date()
    const spreadsheetName = `spreadsheet.${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.csv`
    fs.copyFileSync(filePath, path.join(backupSpreadsheetFolderPath, spreadsheetName))
  }

  const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1bx6RvTCEGn5zA06lW_uZGZ_dq6qQyCZC_NifmyeC1lM/export?format=csv&id=1bx6RvTCEGn5zA06lW_uZGZ_dq6qQyCZC_NifmyeC1lM&gid=0'
  const file = fs.createWriteStream(filePath)

  https.get(spreadsheetUrl, (response) => {
    response.pipe(file)
  })
}
