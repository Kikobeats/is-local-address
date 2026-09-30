'use strict'

const { site, global } = require('./ranges')

module.exports = require('./create')(site.concat(global), require('../ipv4'))
