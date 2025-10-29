'use strict'

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
  // Matches IPv6 addresses in the fc00::/7 range (ULA)
  /^f[b-d][0-9a-fA-F]{2}:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/i,
  // Matches IPv6 addresses in the fe80::/10 range (link-local)
  /^fe[8-9a-bA-B][0-9a-fA-F]:/i,
  // Matches IPv6 multicast addresses
  /^ff([0-9a-fA-F]{2,2}):/i,
  // Matches IPv6 addresses in the ff00::/8 range (Multicast)
  /^ff00:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
  // Matches localhost in IPv6
  /^::1?$/,
  // Matches IPv6 addresses in the fec0::/10 range (Site-local unicast)
  /^fec0:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/i,
  // Matches IPv6 addresses in the 2002::/16 range
  /^2002:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/
]

const regex = new RegExp(`^(${IP_RANGES.map(re => re.source).join('|')})$`)

/**
 * Converts IPv4-mapped IPv6 addresses in hexadecimal format to dotted decimal.
 * Example: ::ffff:7f00:1 -> 127.0.0.1
 */
function extractMappedIPv4 (ipv6Address) {
  // Match IPv4-mapped IPv6 in hexadecimal format: ::ffff:XXXX:XXXX or ::ffff:0:XXXX:XXXX
  const hexMatch = ipv6Address.match(
    /^::f{4}:(?:0:)?([0-9a-fA-F]{1,4}):([0-9a-fA-F]{1,4})$/i
  )
  if (hexMatch) {
    const firstHalf = parseInt(hexMatch[1], 16)
    const secondHalf = parseInt(hexMatch[2], 16)

    // Convert two 16-bit hex values to four 8-bit decimal values
    const octet1 = (firstHalf >> 8) & 0xff
    const octet2 = firstHalf & 0xff
    const octet3 = (secondHalf >> 8) & 0xff
    const octet4 = secondHalf & 0xff

    return `${octet1}.${octet2}.${octet3}.${octet4}`
  }
  return null
}

module.exports = hostname => {
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    hostname = hostname.slice(1, -1)
  }

  // Check if it's an IPv4-mapped IPv6 address in hexadecimal format
  const mappedIPv4 = extractMappedIPv4(hostname)
  if (mappedIPv4 !== null) {
    return require('../ipv4')(mappedIPv4)
  }

  return regex.test(hostname)
}

module.exports.regex = regex
