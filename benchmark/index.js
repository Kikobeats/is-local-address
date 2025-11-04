'use strict'

const fs = require('fs')
const path = require('path')
const ipaddr = require('ipaddr.js')
const { internalIPs, externalIPs } = require('../test/cases')

const booleanEmoji = value =>
  value === true ? '✅' : value === false ? '❌' : '`undefined`'

const escape = value => `\`${value}\``

const ips = internalIPs.concat(externalIPs).map(({ ip }) => ip)

const getPackageSize = packagePath => {
  try {
    const stats = fs.statSync(packagePath)
    const bytes = stats.size
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`
  } catch {
    return 'N/A'
  }
}

const getSizeInfo = () => {
  const sizes = {
    'is-local-address': getPackageSize(path.join(__dirname, '../src/index.js')),
    'ipaddr.js': getPackageSize(
      path.join(__dirname, 'node_modules/ipaddr.js/lib/ipaddr.js')
    ),
    'private-ip': getPackageSize(path.join(__dirname, 'private-ip.js'))
  }
  return sizes
}

function isPrivateIpAddr (ip) {
  if (ip === 'localhost') {
    return true
  }
  if (ip.startsWith('[') && ip.endsWith(']')) {
    ip = ip.slice(1, -1)
  }
  if (!ipaddr.isValid(ip)) {
    return false
  }
  let addr = ipaddr.parse(ip)
  if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
    addr = addr.toIPv4Address()
  }
  const range = addr.range()
  return range !== 'unicast'
}

const createBench = cases => {
  const testCases = []
  let results = []

  const add = (name, fn) => {
    testCases.push({ name, fn })
    return api
  }

  const run = () => {
    results = []
    testCases.forEach(({ name, fn }) => {
      let duration = performance.now()
      const output = cases.map(input => fn(input))
      duration = performance.now() - duration
      results.push({ name, duration, output })
    })

    const output = cases.map((input, index) =>
      results.reduce(
        (acc, { name, output }) => {
          acc[name] = output[index]
          return acc
        },
        { input }
      )
    )

    const sizes = getSizeInfo()
    const metrics = {
      performance: results.map(({ name, duration }) => ({
        name,
        duration: parseFloat(duration.toFixed(2)),
        unit: 'ms'
      })),
      bundleSize: results.map(({ name }) => ({
        name,
        size: sizes[name]
      }))
    }

    const outputData = {
      metrics,
      results: output
    }

    fs.writeFileSync(
      path.join(__dirname, 'output.json'),
      JSON.stringify(outputData, null, 2)
    )

    const successRates = results.reduce((acc, { name, output }) => {
      const actual = output.filter((result, index) => {
        const isInternal = internalIPs.map(p => p.ip).includes(cases[index])
        const isExternal = externalIPs.map(p => p.ip).includes(cases[index])
        return (
          (isInternal && result === true) || (isExternal && result === false)
        )
      }).length
      const successRate = ((actual / output.length) * 100).toFixed(2)
      acc[name] = `${successRate}%`
      return acc
    }, {})

    // generate README.md
    const inputTable = [
      '| Input | Expected | ' +
        results
          .map(({ name }) => `${escape(name)} (${successRates[name]})`)
          .join(' | ') +
        ' |',
      '|-------|----------' + results.map(() => '|-------').join('') + '|',
      ...output.map(
        row =>
          '| ' +
          `${row.input}` +
          ' | ' +
          `${booleanEmoji(internalIPs.map(p => p.ip).includes(row.input))}` +
          ' | ' +
          results.map(({ name }) => booleanEmoji(row[name])).join(' | ') +
          ' |'
      )
    ].join('\n')

    const metricsTable = (() => {
      const baseline = results.find(r => r.name === 'is-local-address')
      const baselineSize = sizes['is-local-address']

      const parseSizeToBytes = sizeStr => {
        const match = sizeStr.match(/^([\d.]+)(B|KB|MB)$/)
        if (!match) return 0
        const value = parseFloat(match[1])
        const unit = match[2]
        if (unit === 'KB') return value * 1024
        if (unit === 'MB') return value * 1024 * 1024
        return value
      }

      const baseSizeBytes = parseSizeToBytes(baselineSize)

      const rows = ['| Name | Duration | Size |', '|------|----------|------|']

      results.forEach(({ name, duration }) => {
        const durationStr = duration.toFixed(2)
        const sizeStr = sizes[name]
        const sizeBytes = parseSizeToBytes(sizeStr)

        let durationWithDelta = `${durationStr}ms`
        let sizeWithDelta = sizeStr

        if (name !== 'is-local-address') {
          const slowerPercent = (
            ((duration - baseline.duration) / baseline.duration) *
            100
          ).toFixed(0)
          durationWithDelta = `${durationStr}ms (+${slowerPercent}%)`

          const largerPercent = (
            ((sizeBytes - baseSizeBytes) / baseSizeBytes) *
            100
          ).toFixed(0)
          sizeWithDelta = `${sizeStr} (+${largerPercent}%)`
        }

        rows.push(
          `| ${escape(name)} | ${durationWithDelta} | ${sizeWithDelta} |`
        )
      })

      return rows.join('\n')
    })()

    const markdown = `# Benchmark

${metricsTable}

# Comparison

${inputTable}
`
    fs.writeFileSync(path.join(__dirname, 'README.md'), markdown)
  }

  const api = { add, run }

  return api
}

createBench(ips)
  .add('is-local-address', require('../src'))
  .add('ipaddr.js', isPrivateIpAddr)
  .add('private-ip', require('./private-ip').default)
  .run()
