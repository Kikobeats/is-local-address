'use strict'

const {
  toHostnameString,
  toResolvedHostname
} = require('../resolver-spelling')

module.exports = (ranges, { ambiguousIsLocal = false } = {}) => {
  const regex = new RegExp(`^(${ranges.join('|')})$`)

  const isLocalHost = host =>
    host.endsWith('.localhost') ||
    host === 'localhost.localdomain' ||
    regex.test(host)

  const isLocalAddress = hostname => {
    const host = toHostnameString(hostname).toLowerCase().replace(/\.$/, '')
    if (isLocalHost(host)) return true
    if (!ambiguousIsLocal) return false
    const resolved = toResolvedHostname(host)
    return resolved !== null && isLocalHost(resolved.replace(/\.$/, ''))
  }

  isLocalAddress.regex = regex
  return isLocalAddress
}
