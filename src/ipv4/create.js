'use strict'

/**
 * Builds an IPv4 local-address matcher from a list of range entries
 * (see ./ranges.js). The regex is compiled once, at build time, so the
 * returned function costs the same per call as a hand-written matcher.
 */
module.exports = ranges => {
  const regex = new RegExp(`^(${ranges.map(({ re }) => re).join('|')})$`)

  const isLocalAddress = hostname => {
    const host = String(hostname).toLowerCase().replace(/\.$/, '')
    return (
      host.endsWith('.localhost') ||
      host === 'localhost.localdomain' ||
      regex.test(host)
    )
  }

  isLocalAddress.regex = regex
  return isLocalAddress
}
