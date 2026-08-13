'use strict'

const test = require('ava').default

const isLocalhost = require('is-local-address/ipv6')

const { externalIpv4s, internalIPv4s, internalIPv6s } = require('./cases')

internalIPv6s.forEach(({ ip }) => {
  test(`internal » true » ${ip}`, t => {
    t.true(isLocalhost(ip), ip)
  })
})

externalIpv4s.concat(internalIPv4s).forEach(({ ip, type }) => {
  test(`external » false » ${ip}`, t => {
    t.false(isLocalhost(ip), ip)
  })
})
