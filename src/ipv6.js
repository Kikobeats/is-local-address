'use strict'

const IP_RANGES = [
  // Matches IPv4-mapped, IPv4-translated, and IPv4-embedded IPv6 addresses
  /^::f{4}:0?([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/,
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

module.exports = hostname => {
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    hostname = hostname.slice(1, -1)
  }
  return regex.test(hostname)
}

module.exports.regex = regex
