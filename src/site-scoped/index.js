'use strict'

/**
 * Site-scoped variant of the default export.
 *
 * The default export answers "is this address non-public", the question an
 * SSRF guard asks, and so includes address space that hosts outside your own
 * network can hold: RFC 6598 shared space (100.64.0.0/10), Teredo (2001::/32),
 * 6to4 (2002::/16) and NAT64 (64:ff9b::/96). This export answers "is this
 * address inside one administrative network" by matching only the ranges
 * tagged `site` in ../ipv4/ranges.js and ../ipv6/ranges.js.
 */
const site = ({ scope }) => scope === 'site'

const ipv4 = require('../ipv4/create')(require('../ipv4/ranges').filter(site))
const ipv6Ranges = require('../ipv6/create')(
  require('../ipv6/ranges').filter(site),
  ipv4
)

// The dotted-decimal IPv4-mapped form (::ffff:192.168.0.1) is not in the site
// range table because that entry accepts any embedded IPv4. Decode it here so
// both spellings of a mapped address classify by the embedded IPv4, as the
// hex form already does through extractMappedIPv4. Case-insensitive to match
// that decoder.
const DOTTED_MAPPED =
  /^::f{4}:(?:0:)?([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i

const ipv6 = input => {
  // Strip a matched bracket pair only, as the range matcher does.
  const len = input.length
  const host =
    len > 2 && input[0] === '[' && input[len - 1] === ']'
      ? input.slice(1, -1)
      : input
  const m = DOTTED_MAPPED.exec(host)
  return m ? ipv4(`${m[1]}.${m[2]}.${m[3]}.${m[4]}`) : ipv6Ranges(host)
}

ipv6.regex = ipv6Ranges.regex
ipv6.extractMappedIPv4 = ipv6Ranges.extractMappedIPv4

module.exports = hostname => ipv4(hostname) || ipv6(hostname)
module.exports.ipv4 = ipv4
module.exports.ipv6 = ipv6
