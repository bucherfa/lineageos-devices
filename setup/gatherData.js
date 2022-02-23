const fs = require('fs')
const req = require('require-yml')
const Ajv = require('ajv')
const fetch = require('node-fetch')
const packageJson = require('../package.json')
const pa = require('../extra/phonearena.json')
const parseSpreadsheet = require('./parseSpreadsheet')
const filters = require('./filters.json')
const validDeviceSchema = require('./validDeviceSchema.json')

const ajv = new Ajv()
const schemaValidate = ajv.compile(validDeviceSchema)

const _updated = new Date()
const info = `The data for this site, "List of Devices for LineageOS", is a derivative of "<a href="https://wiki.lineageos.org/devices/">LineageOS Wiki Devices</a>" by <a href="https://lineageos.org/">LineageOS</a>, used under <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. "List of Devices for LineageOS" added data from "<a href="https://docs.google.com/spreadsheets/d/1bx6RvTCEGn5zA06lW_uZGZ_dq6qQyCZC_NifmyeC1lM/edit#gid=0">LineageOS Phones by Spec</a>" by <a href="https://github.com/nobodywasishere">nobodywasishere</a> with his permission. "List of Devices for LineageOS" is licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> by ${packageJson.homepage.split('/')[3]}.`

// raw devices data
const rd = Object.values(req({
  target: './temp/lineage_wiki/_data/devices',
  onLoadError: () => {
    return null
  }
}))

const devices = {}
const sortBy = {
  active: {
    type: 'release',
    desc: true
  },
  options: [
    'popularity',
    'release',
    'name',
    'display_size',
    'storage',
    'ram',
    'screen_ppi',
    'camera_main',
    'camera_front',
    'battery_capacity',
    'cpu_cores',
    'maintainers',
    'height',
    'width',
    'depth'
  ]
}
let totalPopularity = 0

main()

async function main () {
  const spreadSheet = await parseSpreadsheet()

  await mapData(spreadSheet)

  for (const device of Object.values(devices)) {
    totalPopularity += device.popularity
  }
  for (const device of Object.values(devices)) {
    device.popularity = device.popularity / totalPopularity * 100
  }

  prepareFilters()

  writeToFile()
}

function extractFromArray (a) {
  let attribute = a
  if (typeof attribute.getMonth === 'function') {
    attribute = attribute.toISOString().split('T')[0]
  }
  if (typeof attribute === 'object') {
    attribute = Object.values(attribute[0])[0]
    if (typeof attribute.getMonth === 'function') {
      attribute = attribute.toISOString().split('T')[0]
    }
  }
  return attribute
}

function validateWithSchema (d, device) {
  const valid = schemaValidate(d)
  if (!valid) {
    throw new Error(JSON.stringify(schemaValidate.errors) + JSON.stringify(d))
  }
}

function validate (d, device) {
  for (const key of Object.keys(d)) {
    const item = d[key]
    if (key === 'storage') {
      if (['-', 8, 16, 32, 64, 128, 256, 512, 1024].includes(item)) {
        continue
      }
      throw new Error(JSON.stringify(device, null, 2) + JSON.stringify(d, null, 2) + `Invalid Storage: ${item}`)
    }
    if (key === 'peripherals' || key === 'network') {
      if (typeof item === 'object') {
        let ok = true
        for (const s of item) {
          if (typeof s !== 'string') {
            ok = false
          }
        }
        if (ok) {
          continue
        }
      }
      throw new Error(JSON.stringify(device, null, 2) + JSON.stringify(d, null, 2) + `Invalid Storage: ${item}`)
    }
    if (typeof item === 'undefined' || typeof item === 'object') {
      throw new TypeError(JSON.stringify(device, null, 2) + JSON.stringify(d, null, 2) + 'Invalid Attribute: ' + item)
    }
  }
}

function writeToFile () {
  fs.writeFile('./temp/data.json', JSON.stringify({ info, _updated, filters, devices, sortBy, totalPopularity }, null, 2), 'utf8', function (err) {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('An error occured while writing JSON Object to File.')
      // eslint-disable-next-line no-console
      return console.log(err)
    }
    // eslint-disable-next-line no-console
    console.log('JSON file has been saved.')
  })
}

async function mapData (spreadSheet) {
  const stats = await getStats()
  for (const device of rd) {
    if (device.maintainers.length === 0) {
      continue
    }
    const codename = device.codename
    devices[codename] = {}
    const d = devices[codename]
    d.codename = codename
    d.name = device.vendor + ' ' + device.name
    d.vendor = device.vendor
    d.version = device.current_branch.toString()
    d.image = device.image.replace('.png', '.jpg')
    if (device.type === 'phablet') {
      device.type = 'phone'
    }
    d.type = device.type
    // release date
    d.release = extractFromArray(device.release)
    if (typeof d.release !== 'string') {
      d.release = d.release.toString()
    }
    // peripherals
    d.peripherals = device.peripherals || []
    if (device.peripherals === 'None') {
      d.peripherals = []
    }
    // sd card
    if (device.sdcard) {
      d.peripherals.push('SD card')
    }
    // screen size
    if (typeof device.screen.size === 'string') {
      device.screen_ppi = device.screen.density
      device.screen = device.screen.size
    } else if (typeof device.screen === 'object') {
      device.screen = Object.values(device.screen[0])[0]
    }
    if (device.screen.includes('in)')) {
      d.display_size = parseFloat(device.screen.split('(')[1].split(' in)')[0])
    } else {
      d.display_size = parseFloat(device.screen)
    }
    d.architecture = device.architecture
    if (typeof d.architecture === 'object') {
      d.architecture = d.architecture.cpu
    }
    // battery capacity
    d.battery_capacity = device.battery.capacity || device.battery
    if (device.battery.removable) {
      d.peripherals.push('Removable battery')
    }
    if (typeof d.battery_capacity === 'object') {
      d.battery_capacity = Object.values(device.battery[0])[0].capacity
      if (Object.values(device.battery[0])[0].removable) {
        d.peripherals.push('Removable battery')
      }
    }
    // ram
    d.ram = device.ram.split(' GB')[0]
    if (d.ram.includes('/')) {
      const splitted = d.ram.split('/')
      d.ram = splitted[splitted.length - 1]
    }
    d.ram = parseFloat(d.ram)
    // storage
    let storage = device.storage || '-'
    storage = storage.replace('32/64 B', '32/64 GB')
    if (storage.includes(' GB')) {
      storage = storage.split(' GB')
      storage = storage[storage.length - 2]
    }
    d.storage = storage
    if (d.storage.includes('/')) {
      const splitted = d.storage.split('/')
      d.storage = splitted[splitted.length - 1]
    }
    if (d.storage.includes(',')) {
      const splitted = d.storage.split(',')
      d.storage = splitted[splitted.length - 1]
    }
    if (!isNaN(parseInt(d.storage))) {
      d.storage = parseInt(d.storage)
    }
    d.maintainers = device.maintainers.length
    // ppi
    let screenPpiString = device.screen_ppi.toString()
    if (screenPpiString.includes('/')) {
      screenPpiString = screenPpiString.split('/')[0]
    }
    d.screen_ppi = parseInt(screenPpiString.replace(/\D/g, ''))
    const cameraMainArray = device.cameras[0].info.split(' MP')[0].split(' ')
    d.camera_main = parseFloat(cameraMainArray[cameraMainArray.length - 1])
    if (device.cameras.length > 1) {
      const cameraMpString = device.cameras[device.cameras.length - 1].info.replace('16MP', '16 MP')
      const cameraFrontArray = cameraMpString.split(' MP')[0].split(' ')
      d.camera_front = parseFloat(cameraFrontArray[cameraFrontArray.length - 1])
    }
    d.cpu_cores = parseInt(device.cpu_cores)
    // popularity stats
    d.popularity = stats[codename]
    // phone arena
    if (pa.devices[codename] === undefined) {
      throw new Error('missing phone arena entry: ' + codename)
    }
    d.phonearena = pa.devices[codename]
    if (spreadSheet[codename] === undefined) {
      // eslint-disable-next-line no-console
      console.log(`${codename} missing on spreadsheet.`)
    }
    // ip rating
    let ipRating = spreadSheet[codename] ? spreadSheet[codename]['IP Rating'] : ''
    if (!ipRating.startsWith('IP')) {
      ipRating = 'none'
    }
    d.ip_rating = ipRating
    // headphone jack
    const headphoneJack = spreadSheet[codename] ? spreadSheet[codename]['HP Jack'] : ''
    if (headphoneJack === 'Yes') {
      d.peripherals.push('Headphone jack')
    }
    // wireless charging
    const wirelessCharging = spreadSheet[codename] ? spreadSheet[codename]['Wireless Charging'] : ''
    if (wirelessCharging === 'Yes') {
      d.peripherals.push('Wireless charging')
    }
    // network
    d.network = device.network || []
    // height
    let height = device.dimensions?.height || device.height
    if (height === undefined) {
      if (spreadSheet[codename]) {
        height = spreadSheet[codename]['Height (mm)']
      }
    } else {
      if (typeof height === 'object') {
        height = Object.values(height[height.length - 1])[0]
      }
      height = height.split(' mm')[0]
    }
    d.height = parseFloat(height)
    // width
    let width = device.dimensions?.width || device.width
    if (width === undefined) {
      if (spreadSheet[codename]) {
        width = spreadSheet[codename]['Width (mm)']
      }
    } else {
      if (typeof width === 'object') {
        width = Object.values(width[width.length - 1])[0]
      }
      width = width.split(' mm')[0]
    }
    d.width = parseFloat(width)
    // depth
    let depth = device.dimensions?.depth || device.depth
    if (depth === undefined) {
      if (spreadSheet[codename]) {
        depth = spreadSheet[codename]['Thick (mm)']
      }
    } else {
      if (typeof depth === 'object') {
        depth = Object.values(depth[depth.length - 1])[0]
      }
      depth = depth.split(' mm')[0]
    }
    d.depth = parseFloat(depth)
    // sort and validate
    d.peripherals.sort()
    validateWithSchema(d, devices)
    validate(d, device)
  }
}

function prepareFilters () {
  const typeOptions = filters.type.options
  const versionOptions = filters.version.options
  const archOptions = filters.architecture.options
  const networkOptions = filters.network.options
  const ipRatingOptions = filters.ip_rating.options
  const peripheralsOptions = filters.peripherals.options
  const vendorOptions = filters.vendor.options
  for (const device of Object.values(devices)) {
    const type = device.type
    const typeOptions = filters.type.options
    if (!typeOptions.includes(type)) {
      typeOptions.push(type)
    }
    const version = device.version
    if (!versionOptions.includes(version)) {
      versionOptions.push(version)
    }
    const architecture = device.architecture
    if (!archOptions.includes(architecture)) {
      archOptions.push(architecture)
    }
    const ipRating = device.ip_rating
    if (!ipRatingOptions.includes(ipRating)) {
      ipRatingOptions.push(ipRating)
    }
    const networks = device.network
    for (const network of networks) {
      if (!networkOptions.includes(network)) {
        networkOptions.push(network)
      }
    }
    const peripherals = device.peripherals
    for (const peripheral of peripherals) {
      if (!peripheralsOptions.includes(peripheral)) {
        peripheralsOptions.push(peripheral)
      }
    }
    const vendor = device.vendor
    if (!vendorOptions.includes(vendor)) {
      vendorOptions.push(vendor)
    }
    for (const filterKey of Object.keys(filters)) {
      const filter = filters[filterKey]
      if (filter.type === 'range') {
        const value = device[filterKey]
        if (value > filters[filterKey].max) {
          filters[filterKey].max = value
          filters[filterKey].selected[1] = filters[filterKey].max
        }
        if (value < filters[filterKey].min) {
          if (filterKey !== 'display_size') {
            filters[filterKey].min = Math.floor(value)
          } else {
            filters[filterKey].min = value
          }
          filters[filterKey].selected[0] = filters[filterKey].min
        }
      }
    }
  }
  typeOptions.sort()
  typeOptions.unshift(filters.type.selectOnNone)
  versionOptions.sort().reverse()
  filters.version.selected.push(versionOptions[0])
  versionOptions.unshift(filters.version.selectOnNone)
  ipRatingOptions.sort()
  ipRatingOptions.unshift(filters.ip_rating.selectOnNone)
  archOptions.sort().reverse()
  archOptions.unshift(filters.architecture.selectOnNone)
  networkOptions.sort().reverse()
  peripheralsOptions.sort()
  vendorOptions.sort()
  vendorOptions.unshift(filters.vendor.selectOnNone)
  for (const filterKey of Object.keys(filters)) {
    const filter = filters[filterKey]
    filter.default = filter.selected
  }
}

async function getStats () {
  const res = await fetch('https://stats.lineageos.org/api/v1/stats')
  const json = await res.json()
  return json.model
}
