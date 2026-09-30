'use strict'

const test = require('ava').default

const isSiteScoped = require('is-local-address/site-scoped')

const { externalIPs, internalIPs } = require('./cases')

// Internal fixtures that fall in ranges hosts outside a site can hold, which
// the site-scoped export must reject: RFC 6598 shared space (100.64.0.0/10),
// NAT64 (64:ff9b::/96), Teredo (2001::/32) and 6to4 (2002::/16).
const BEYOND_SITE = /^(?:100\.|64:ff9b::|2001:0{0,4}:|2002:)/i

const beyondSite = internalIPs.filter(({ ip }) => BEYOND_SITE.test(ip))
const inSite = internalIPs.filter(({ ip }) => !BEYOND_SITE.test(ip))

test('fixture split covers both sides', t => {
  t.true(beyondSite.length > 0)
  t.true(inSite.length > beyondSite.length)
})

inSite.forEach(({ ip }) => {
  test(`site » true » ${ip}`, t => {
    t.true(isSiteScoped(ip), ip)
  })
})

beyondSite.forEach(({ ip }) => {
  test(`beyond site » false » ${ip}`, t => {
    t.false(isSiteScoped(ip), ip)
  })
})

externalIPs.forEach(({ ip }) => {
  test(`external » false » ${ip}`, t => {
    t.false(isSiteScoped(ip), ip)
  })
})

test('IPv4-mapped addresses classify by the embedded IPv4 in both spellings', t => {
  t.true(isSiteScoped('::ffff:c0a8:1'), 'hex 192.168.0.1')
  t.true(isSiteScoped('::ffff:192.168.0.1'), 'dotted 192.168.0.1')
  t.true(isSiteScoped('[::ffff:192.168.0.1]'), 'bracketed dotted 192.168.0.1')
  t.true(isSiteScoped('::FFFF:192.168.0.1'), 'uppercase dotted 192.168.0.1')
  t.false(isSiteScoped('[::ffff:192.168.0.1'), 'unbalanced opening bracket')
  t.false(isSiteScoped('::ffff:192.168.0.1]'), 'unbalanced closing bracket')
  t.false(isSiteScoped('::ffff:6440:1'), 'hex 100.64.0.1')
  t.false(isSiteScoped('::ffff:100.64.0.1'), 'dotted 100.64.0.1')
  t.false(isSiteScoped('::ffff:808:808'), 'hex 8.8.8.8')
  t.false(isSiteScoped('::ffff:8.8.8.8'), 'dotted 8.8.8.8')
})

test('IPv6 hex digits are case-insensitive', t => {
  for (const { ip } of inSite) t.true(isSiteScoped(ip.toUpperCase()), ip)
  for (const { ip } of beyondSite) t.false(isSiteScoped(ip.toUpperCase()), ip)
})

test('strips one bracket pair only', t => {
  t.true(isSiteScoped('[::1]'))
  t.false(isSiteScoped('[[::1]]'))
  t.false(isSiteScoped('[[fe80::1]]'))
  t.false(isSiteScoped('[[::ffff:c0a8:1]]'))
  t.false(isSiteScoped.ipv6('[[::1]]'))
})

test('exposes per-family matchers', t => {
  t.true(isSiteScoped.ipv4('10.0.0.1'))
  t.false(isSiteScoped.ipv4('100.64.0.1'))
  t.false(isSiteScoped.ipv4('fe80::1'))
  t.true(isSiteScoped.ipv6('fe80::1'))
  t.false(isSiteScoped.ipv6('2002:808:808::1'))
  t.false(isSiteScoped.ipv6('10.0.0.1'))
})

test('default export still accepts what site scope rejects', t => {
  const isLocal = require('is-local-address')
  for (const { ip } of beyondSite) t.true(isLocal(ip), ip)
})
