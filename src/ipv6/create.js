'use strict'

function extractMappedIPv4 (addr) {
  // Cheap length guard: ::ffff:x:x is at least 10 chars
  if (addr.length < 10 || addr.charCodeAt(1) !== 58) return null

  // Very fast substring check (no regex yet)
  if (addr[0] === ':' && addr.slice(0, 7).toLowerCase() === '::ffff:') {
    // hex-mapped form? ::ffff:XXXX:YYYY or ::ffff:0:XXXX:YYYY
    const m = /^::f{4}:(?:0:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(addr)
    if (!m) return null

    const hi = parseInt(m[1], 16)
    const lo = parseInt(m[2], 16)

    // Compose dotted IPv4 (avoids string concatenations)
    return (
      ((hi >> 8) & 0xff) +
      '.' +
      (hi & 0xff) +
      '.' +
      ((lo >> 8) & 0xff) +
      '.' +
      (lo & 0xff)
    )
  }

  return null
}

/**
 * Builds an IPv6 local-address matcher from a list of range entries
 * (see ./ranges.js) and the IPv4 matcher to apply to IPv4-mapped addresses.
 * Passing the matcher in means a scoped IPv6 matcher classifies the embedded
 * IPv4 with the equally scoped IPv4 matcher. The regex is compiled once, at
 * build time.
 */
module.exports = (ranges, ipv4) => {
  const regex = new RegExp(`^(${ranges.map(({ re }) => re.source).join('|')})$`)

  const isLocalAddress = input => {
    let host = input

    const len = host.length
    if (len > 2 && host[0] === '[' && host[len - 1] === ']') {
      host = host.slice(1, -1)
    }

    const mappedIPv4 = extractMappedIPv4(host)
    return mappedIPv4 ? ipv4(mappedIPv4) : regex.test(host)
  }

  isLocalAddress.regex = regex
  isLocalAddress.extractMappedIPv4 = extractMappedIPv4
  return isLocalAddress
}

module.exports.extractMappedIPv4 = extractMappedIPv4
