'use strict'

const test = require('ava')
const { extractMappedIPv4 } = require('../src/ipv6')

test('extracts valid hex-mapped IPv4 addresses - loopback', t => {
  t.is(extractMappedIPv4('::ffff:7f00:1'), '127.0.0.1')
  t.is(extractMappedIPv4('::ffff:7f00:0'), '127.0.0.0')
  t.is(extractMappedIPv4('::ffff:7fff:ffff'), '127.255.255.255')
})

test('extracts valid hex-mapped IPv4 addresses - private ranges', t => {
  t.is(extractMappedIPv4('::ffff:0:c0a8:1'), '192.168.0.1')
  t.is(extractMappedIPv4('::ffff:0:a00:1'), '10.0.0.1')
  t.is(extractMappedIPv4('::ffff:0:ac10:1'), '172.16.0.1')
})

test('extracts valid hex-mapped IPv4 addresses - all zeros', t => {
  t.is(extractMappedIPv4('::ffff:0:0'), '0.0.0.0')
})

test('extracts valid hex-mapped IPv4 addresses - all ones', t => {
  t.is(extractMappedIPv4('::ffff:ffff:ffff'), '255.255.255.255')
})

test('case-insensitive hex parsing', t => {
  t.is(extractMappedIPv4('::FFFF:7F00:1'), '127.0.0.1')
  t.is(extractMappedIPv4('::FFff:7f00:1'), '127.0.0.1')
  t.is(extractMappedIPv4('::FfFf:0:C0A8:1'), '192.168.0.1')
})

test('handles mixed case with 0: prefix', t => {
  t.is(extractMappedIPv4('::FFFF:0:C0A8:1'), '192.168.0.1')
  t.is(extractMappedIPv4('::FfFf:0:a00:1'), '10.0.0.1')
})

test('various valid hex combinations', t => {
  t.is(extractMappedIPv4('::ffff:100:0'), '1.0.0.0')
  t.is(extractMappedIPv4('::ffff:0:1'), '0.0.0.1')
  t.is(extractMappedIPv4('::ffff:dead:beef'), '222.173.190.239')
  t.is(extractMappedIPv4('::ffff:cafe:babe'), '202.254.186.190')
})

test('returns null for invalid formats', t => {
  // Missing prefix
  t.is(extractMappedIPv4('7f00:1'), null)
  // Wrong prefix
  t.is(extractMappedIPv4('::fffa:7f00:1'), null)
  // Only one hex part
  t.is(extractMappedIPv4('::ffff:7f00'), null)
  // Dotted decimal format (not extracted by this function)
  t.is(extractMappedIPv4('::ffff:127.0.0.1'), null)
  // Empty string
  t.is(extractMappedIPv4(''), null)
  // Too short
  t.is(extractMappedIPv4('::ffff::'), null)
  // Missing colon
  t.is(extractMappedIPv4('ffff:7f00:1'), null)
})

test('returns null for non-hex content', t => {
  t.is(extractMappedIPv4('::ffff:7g00:1'), null)
  t.is(extractMappedIPv4('::ffff:gggg:1'), null)
  t.is(extractMappedIPv4('::ffff:7f0z:1'), null)
})

test('returns null for addresses too short', t => {
  t.is(extractMappedIPv4('::ffff'), null)
  t.is(extractMappedIPv4('::ffff:'), null)
  t.is(extractMappedIPv4('::f'), null)
  t.is(extractMappedIPv4(':'), null)
})

test('returns null for addresses with wrong structure', t => {
  // Too many parts
  t.is(extractMappedIPv4('::ffff:0:1:2:3'), null)
  // Wrong separator
  t.is(extractMappedIPv4('::ffff-7f00-1'), null)
  // Extra colons
  t.is(extractMappedIPv4(':::ffff:7f00:1'), null)
})

test('handles edge case hex values', t => {
  // Minimum 1-char hex parts
  t.is(extractMappedIPv4('::ffff:0:0'), '0.0.0.0')
  t.is(extractMappedIPv4('::ffff:f:f'), '0.15.0.15')
  // Maximum 4-char hex parts
  t.is(extractMappedIPv4('::ffff:ffff:ffff'), '255.255.255.255')
})

test('handles 0: prefix variations', t => {
  t.is(extractMappedIPv4('::ffff:0:c0a8:1'), '192.168.0.1')
  t.is(extractMappedIPv4('::ffff:0:a00:1'), '10.0.0.1')
  // Both octets split
  t.is(extractMappedIPv4('::ffff:0:0'), '0.0.0.0')
})

test('rejects input with invalid length', t => {
  // Less than minimum valid length
  t.is(extractMappedIPv4('::fff:1:1'), null)
  // Way too long but still matches pattern somewhat
  t.is(extractMappedIPv4('::ffff:00000:00000'), null)
})

test('preserves leading zeros in hex', t => {
  t.is(extractMappedIPv4('::ffff:0001:0001'), '0.1.0.1')
  t.is(extractMappedIPv4('::ffff:0100:0200'), '1.0.2.0')
})
