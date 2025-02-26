'use strict'

const test = require('ava')

const isLocalhost = require('is-local-address/ipv4')

const { externalIPs, internalIPv4s } = require('./cases')

internalIPv4s.forEach(({ ip }) => {
  test(`internal » true » ${ip}`, t => {
    t.true(isLocalhost(ip), ip)
  })
})

externalIPs.forEach(({ ip }) => {
  test(`external » false » ${ip}`, t => {
    t.false(isLocalhost(ip), ip)
  })
})
