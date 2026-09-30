'use strict'

const test = require('ava').default

const isLocalAddress = require('is-local-address')
const isLocalIPv4 = require('is-local-address/ipv4')
const isLocalIPv6 = require('is-local-address/ipv6')
const isSiteScoped = require('is-local-address/site-scoped')

const loopbackSpellings = [
  '0x7f.0.0.1',
  '0x7f.1',
  '0177.0.0.1',
  '127.1',
  '2130706433',
  '127.0.0.1\u00ad',
  '\u200b127.0.0.1',
  '\uff11\uff12\uff17.0.0.1',
  '127\u30020.0.1',
  '127.0.0.1\u0000.evil.com',
  '127.0.0.1\t',
  '127.0.0.1 ',
  '127.0.0.%31',
  '127.0.0.1\\.evil.com',
  '0x7f.1 ',
  'localhost ',
  '\uff2c\uff2f\uff23\uff21\uff2c\uff28\uff2f\uff33\uff34',
  'localhost\u00ad'
]

const macOSLoopbackSpellings = [
  '0127.0.0.1',
  '00127.00.00.01',
  '0000000127.0.0.1',
  '6425673729',
  '0x17f000001',
  '0x1ffffffff7f000001',
  '0x100000000',
  '077777777777',
  '0127.0.0.1\u0000.evil.com'
]

const privateSpellings = ['0xa.1', '167772161', '0xc0.0xa8.0.1', '192.168.1', '010.0.0.1', '0192.168.0.1', '192.0168.0.01', '0172.016.0.1', '0169.0254.1.1']

const loopbackIPv6Spellings = [
  '[::1]\\',
  '[::1]:80',
  '[::1]/x',
  '[fe80::1]#x',
  '::\uff11',
  '\uff1a\uff1a1',
  '::1\u00ad',
  '::1\u0000evil',
  '::ffff:\uff11\uff12\uff17.0.0.1',
  '::ffff:127\u30020.0.1',
  '[::1]\n',
  '[::1]\t',
  '[::\n1]',
  '\n[::1]',
  '[::1] '
]

for (const host of loopbackSpellings.concat(macOSLoopbackSpellings, privateSpellings)) {
  test(`SSRF guard resolves a local IPv4, site scope does not trust the spelling » ${JSON.stringify(host)}`, t => {
    t.true(isLocalAddress(host), host)
    t.true(isLocalIPv4(host), host)
    t.false(isSiteScoped(host), host)
  })
}

for (const host of loopbackIPv6Spellings) {
  test(`SSRF guard resolves a local IPv6, site scope does not trust the spelling » ${JSON.stringify(host)}`, t => {
    t.true(isLocalAddress(host), host)
    t.true(isLocalIPv6(host), host)
    t.false(isSiteScoped(host), host)
  })
}

test('shared address space spelled as numbers is local but not site-scoped', t => {
  for (const host of ['0x64.0x40.0.1', '1681915905']) {
    t.true(isLocalAddress(host), host)
    t.false(isSiteScoped(host), host)
  }
})

test('public addresses stay public in every spelling', t => {
  for (const host of [
    '8.8.8.8',
    '0x8.0x8.0x8.0x8',
    '134744072',
    '\uff18.\uff18.\uff18.\uff18',
    'example.com',
    '\uff45\uff58\uff41\uff4d\uff50\uff4c\uff45.com',
    '127.0.0.1.evil.com',
    'localhost.evil.com',
    '8.8.8.8 ',
    'example.com ',
    '09.0.0.1',
    '08.0.0.1',
    '0256.0.0.1',
    '99999999999999999999'
  ]) {
    t.false(isLocalAddress(host), host)
    t.false(isSiteScoped(host), host)
  }
})

test('every export rejects non-string primitives', t => {
  for (const fn of [isLocalAddress, isLocalIPv4, isLocalIPv6, isSiteScoped, isSiteScoped.ipv4]) {
    for (const value of [undefined, null, 1, 2130706433, true]) {
      t.throws(() => fn(value), { instanceOf: TypeError }, String(value))
    }
  }
})

test('ambiguous octal is local for the SSRF guard, whichever way the resolver reads it', t => {
  t.true(isLocalAddress('012.168.127.1'))
  t.false(isSiteScoped('012.168.127.1'))
})

test('site scope still trusts the canonical spellings', t => {
  for (const host of ['127.0.0.1', '10.0.0.1', 'localhost', '::1', 'fe80::1', '::ffff:c0a8:1']) {
    t.true(isSiteScoped(host), host)
  }
})

test('a numeric spelling with extra trailing dots is local for the SSRF guard', t => {
  t.true(isLocalAddress('0177.0.0.1..'))
  t.true(isLocalIPv4('127.1..'))
  t.false(isSiteScoped('0177.0.0.1..'))
})
