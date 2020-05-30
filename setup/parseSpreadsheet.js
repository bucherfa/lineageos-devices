const csvFilePath = './temp/spreadsheet/spreadsheet.csv'
const csv = require('csvtojson')
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
