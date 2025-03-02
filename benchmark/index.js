'use strict'

const fs = require('fs')
const path = require('path')

const { internalIPs, externalIPs } = require('../test/cases')

const booleanEmoji = value =>
  value === true ? '✅' : value === false ? '❌' : '`undefined`'

const escape = value => `\`${value}\``

const ips = internalIPs.concat(externalIPs).map(({ ip }) => ip)

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
      let duration = Date.now()
      const output = cases.map(input => fn(input))
      duration = Date.now() - duration
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
    fs.writeFileSync(
      path.join(__dirname, 'output.json'),
      JSON.stringify(output, null, 2)
    )

    const durationTable = [
      '| Name | Duration |',
      '|------|----------|',
      ...results.map(
        ({ name, duration }) => `| ${escape(name)} | ${duration}ms |`
      )
    ].join('\n')

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

    const markdown = `

    # Benchmark

    ${durationTable}

    # Comparsion

    ${inputTable}
`
    fs.writeFileSync(path.join(__dirname, 'README.md'), markdown)
  }

  const api = { add, run }

  return api
}

createBench(ips)
  .add('is-local-address', require('../src'))
  .add('private-ip', require('./private-ip').default)
  .run()
