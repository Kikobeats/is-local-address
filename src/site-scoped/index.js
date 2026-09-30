'use strict'

const { extractMappedIPv4 } = require('../ipv6/create')

const ipv4 = require('../ipv4/create')(require('../ipv4/ranges').site)

const DOTTED_MAPPED = /^::f{4}:(?:0:)?(\d{1,3}(?:\.\d{1,3}){3})$/i

const extractDottedOrHexMappedIPv4 = host => {
  const dottedMapped = DOTTED_MAPPED.exec(host)
  return dottedMapped ? dottedMapped[1] : extractMappedIPv4(host)
}

const ipv6 = require('../ipv6/create')(
  require('../ipv6/ranges').site,
  ipv4,
  extractDottedOrHexMappedIPv4
)

module.exports = hostname => ipv4(hostname) || ipv6(hostname)
module.exports.ipv4 = ipv4
module.exports.ipv6 = ipv6
