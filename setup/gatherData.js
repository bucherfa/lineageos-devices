const fs = require('fs')
const req = require('require-yml')
const Ajv = require('ajv')
const packageJson = require('../package.json')
const validDeviceSchema = require('./validDeviceSchema.json')

const ajv = new Ajv()
const schemaValidate = ajv.compile(validDeviceSchema)

const _updated = new Date()
const info = `The data for this site, "List of Devices for LineageOS", is a derivative of "<a href="https://wiki.lineageos.org/devices/">LineageOS Wiki Devices</a>" by <a href="https://lineageos.org/">LineageOS</a>, used under <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. "List of Devices for LineageOS" is licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> by ${packageJson.name}.`

// raw devices data
const rd = Object.values(req('./temp/lineage_wiki/_data/devices'))
const filters = {
  type: {
    title: 'Types',
    type: 'checkbox',
    options: [],
    selected: ['all'],
    selectOnNone: 'all'
  },
  vendor: {
    title: 'Vendors',
    type: 'checkbox',
    options: [],
    selected: ['all'],
    selectOnNone: 'all'
  },
  version: {
    title: 'Versions',
    type: 'checkbox',
    options: [],
    selected: [],
    selectOnNone: 'all'
  },
  display_size: {
    title: 'Display size',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 0.1,
    unit: 'in'
  },
  battery_capacity: {
    title: 'Battery capacity',
    type: 'range',
    max: 0,
    min: 100000,
    selected: [],
    step: 10,
    unit: 'mAh'
  },
  ram: {
    title: 'RAM',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 1,
    unit: 'GB'
  },
  storage: {
    title: 'Storage',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 4,
    unit: 'GB'
  },
  screen_ppi: {
    title: 'Pixel density',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 1,
    unit: 'ppi'
  },
  camera_main: {
    title: 'Camera',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 1,
    unit: 'MP'
  },
  camera_front: {
    title: 'Front camera',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 1,
    unit: 'MP'
  },
  cpu_cores: {
    title: 'CPU cores',
    type: 'range',
    max: 0,
    min: 10000,
    selected: [],
    step: 1,
    unit: 'cores'
  },
  architecture: {
    title: 'Architectures',
    type: 'checkbox',
    options: [],
    selected: ['all'],
    selectOnNone: 'all'
  },
  peripherals: {
    title: 'Peripherals',
    type: 'checkbox-multi',
    options: [],
    selected: []
  }
}
const devices = {}
const sortBy = {
  active: {
    type: 'release',
    desc: true
  },
  options: [
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
    'maintainers'
  ]
}

for (const device of rd) {
  if (device.channels.includes('discontinued')) {
    continue
  }
  const codename = device.codename
  devices[codename] = {}
  const d = devices[codename]
  d.codename = codename
  d.name = device.vendor + ' ' + device.name
  d.vendor = device.vendor
  d.version = device.current_branch.toString()
  d.image = device.image
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
  d.peripherals = device.peripherals
  // sd card
  if (device.sdcard) {
    d.peripherals.push('SD card')
  }
  // screen size
  if (typeof device.screen === 'object') {
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
  d.ram = parseInt(d.ram)
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
  d.camera_main = parseInt(cameraMainArray[cameraMainArray.length - 1])
  if (device.cameras.length > 1) {
    const cameraMpString = device.cameras[device.cameras.length - 1].info.replace('16MP', '16 MP')
    const cameraFrontArray = cameraMpString.split(' MP')[0].split(' ')
    d.camera_front = parseInt(cameraFrontArray[cameraFrontArray.length - 1])
  }
  d.cpu_cores = parseInt(device.cpu_cores)
  // TODO popularity stats
  d.peripherals.sort()
  validateWithSchema(d, devices)
  validate(d, device)
}

const typeOptions = filters.type.options
const versionOptions = filters.version.options
const archOptions = filters.architecture.options
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
        filters[filterKey].selected[1] = value
      }
      if (value < filters[filterKey].min) {
        filters[filterKey].min = value
        filters[filterKey].selected[0] = value
      }
    }
  }
}
typeOptions.sort()
typeOptions.unshift(filters.type.selectOnNone)
versionOptions.sort().reverse()
filters.version.selected.push(versionOptions[0])
versionOptions.unshift(filters.version.selectOnNone)
archOptions.sort().reverse()
archOptions.unshift(filters.architecture.selectOnNone)
peripheralsOptions.sort()
vendorOptions.sort()
vendorOptions.unshift(filters.vendor.selectOnNone)

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
      if (['-', 8, 16, 32, 64, 128, 256, 512].includes(item)) {
        continue
      }
      throw new Error(JSON.stringify(device, null, 2) + JSON.stringify(d, null, 2) + `Invalid Storage: ${item}`)
    }
    if (key === 'peripherals') {
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

writeToFile()

function writeToFile () {
  fs.writeFile('./static/data.json', JSON.stringify({ info, _updated, filters, devices, sortBy }, null, 2), 'utf8', function (err) {
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
