'use strict'

const test = require('ava').default

const isLocalhost = require('is-local-address')

const { externalIPs, internalIPs } = require('./cases')

internalIPs.forEach(({ ip }) => {
  test(`internal » true » ${ip}`, t => {
    t.true(isLocalhost(ip), ip)
  })
})

externalIPs.forEach(({ ip }) => {
  test(`external » false » ${ip}`, t => {
    t.false(isLocalhost(ip), ip)
  })
})
