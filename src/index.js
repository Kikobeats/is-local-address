'use strict'

const ipv4 = require('./ipv4')
const ipv6 = require('./ipv6')

module.exports = hostname => ipv4(hostname) || ipv6(hostname)
