const path = require('path')
const csv = require('csvtojson')

const csvFilePath = path.join('temp', 'spreadsheet', 'spreadsheet.csv')
module.exports = function (resolve) {
  return new Promise((resolve) => {
    csv()
      .fromFile(csvFilePath)
      .then((array) => {
        const object = {}
        for (const item of array) {
          object[item.Codename] = item
        }
        resolve(object)
      })
  })
}
