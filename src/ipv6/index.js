'use strict'

const create = require('./create')
const { site, global } = require('./ranges')

module.exports = create(site.concat(global), require('../ipv4'), {
  extractIPv4: create.extractEmbeddedIPv4,
  ambiguousIsLocal: true
})
