'use strict'

const ipv4 = require('../ipv4/create')(require('../ipv4/ranges').site)
const ipv6 = require('../ipv6/create')(require('../ipv6/ranges').site, ipv4)

module.exports = hostname => ipv4(hostname) || ipv6(hostname)
module.exports.ipv4 = ipv4
module.exports.ipv6 = ipv6
