'use strict'

const ipv4 = require('../ipv4/create')(require('../ipv4/ranges').site)
const ipv6Ranges = require('../ipv6/create')(
  require('../ipv6/ranges').site,
  ipv4
)

const DOTTED_MAPPED = /^::f{4}:(?:0:)?(\d{1,3}(?:\.\d{1,3}){3})$/i

const ipv6 = input => {
  const len = input.length
  const host =
    len > 2 && input[0] === '[' && input[len - 1] === ']'
      ? input.slice(1, -1)
      : input
  const dottedMapped = DOTTED_MAPPED.exec(host)
  return dottedMapped ? ipv4(dottedMapped[1]) : ipv6Ranges(host)
}

ipv6.regex = ipv6Ranges.regex
ipv6.extractMappedIPv4 = ipv6Ranges.extractMappedIPv4

module.exports = hostname => ipv4(hostname) || ipv6(hostname)
module.exports.ipv4 = ipv4
module.exports.ipv6 = ipv6
