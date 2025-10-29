'use strict'

const ipv4 = require('../ipv4')

const IP_RANGES = [
  // Matches IPv4-mapped IPv6 addresses in dotted decimal format: ::ffff:192.168.0.1
  /^::f{4}:(?:0:)?([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/,
  // Matches IPv6 addresses in the 64:ff9b::/96 range
  /^64:ff9b::([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/,
  // Matches IPv6 addresses in the 100::/64 range
  /^100:(:[0-9a-fA-F]{0,4}){0,6}$/,
  // Matches IPv6 addresses in the 2001::/32 range
  /^2001:(:[0-9a-fA-F]{0,4}){0,6}$/,
  // Matches IPv6 addresses in the 2001:10::/28 range (ORCHID)
  /^2001:1[0-9a-fA-F]:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
  // Matches IPv6 addresses in the 2001:2::/28 range
  /^2001:2[0-9a-fA-F]?:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
  // Matches IPv6 addresses in the 2001:db8::/32 range (documentation prefix)
  /^2001:db8:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
  // Matches IPv6 addresses in the 3fff::/20 range (documentation prefix)
  /^3fff:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
  // Matches IPv6 addresses in the fc00::/7 range (ULA + optional legacy fb00)
  /^f[b-d][0-9a-fA-F]{2}:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/i,
  // Matches IPv6 addresses in the fe80::/10 range (link-local)
  /^fe[89ab][0-9a-fA-F]:(?:[0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}$/i,
  // Matches IPv6 multicast addresses in ff00::/8
  /^ff[0-9a-fA-F]{2}:(?:[0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}$/i,
  // Matches localhost in IPv6
  /^::1?$/,
  // Matches IPv6 addresses in the fec0::/10 range (Site-local unicast)
  /^fec0:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/i,
  // Matches IPv6 addresses in the 2002::/16 range
  /^2002:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/
]

const regex = new RegExp(`^(${IP_RANGES.map(re => re.source).join('|')})$`)

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

module.exports = input => {
  let host = input

  const len = host.length
  if (len > 2 && host[0] === '[' && host[len - 1] === ']') {
    host = host.slice(1, -1)
  }

  const mappedIPv4 = extractMappedIPv4(host)
  return mappedIPv4 ? ipv4(mappedIPv4) : regex.test(host)
}

module.exports.regex = regex
module.exports.extractMappedIPv4 = extractMappedIPv4
