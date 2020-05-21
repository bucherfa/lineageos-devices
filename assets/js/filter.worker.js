onmessage = function (event) {
  const devices = event.data.devices
  const filters = event.data.filters
  const sortBy = event.data.sortBy
  let filtered = JSON.parse(JSON.stringify(Object.values(devices)))
  for (const filterKey of Object.keys(filters)) {
    const filter = filters[filterKey]
    if (filter.type === 'checkbox') {
      const allAreCheckedIndividually = filter.options.length - filter.selected.length === 1
      if (filter.selected.includes(filter.selectOnNone) || allAreCheckedIndividually) {
        continue
      }
      filtered = filtered.filter(d => filter.selected.includes(d[filterKey]))
    }
    if (filter.type === 'checkbox-multi') {
      for (const option of filter.selected) {
        filtered = filtered.filter(d => d[filterKey].includes(option))
      }
    }
    if (filter.type === 'range') {
      filtered = filtered.filter(d => d[filterKey] >= filter.selected[0] && d[filterKey] <= filter.selected[1])
    }
  }
  const sortType = sortBy.type
  filtered = filtered.sort(function (a, b) {
    if (a[sortType] < b[sortType]) { return -1 }
    if (a[sortType] > b[sortType]) { return 1 }
    return 0
  })
  if (sortBy.desc) {
    filtered = filtered.reverse()
  }
  const filteredKeys = filtered.map(d => d.codename)
  postMessage(JSON.parse(JSON.stringify(filteredKeys)))
}
