'use strict'

const test = require('ava').default

const isLocalAddress = require('is-local-address')
const isSiteScoped = require('is-local-address/site-scoped')

const notGloballyReachable = [
  { range: '169.254.0.0/16', first: '169.254.0.0', last: '169.254.255.255', outside: ['169.253.255.255', '169.255.0.0'], site: true },
  { range: '192.88.99.2/32', first: '192.88.99.2', last: '192.88.99.2', outside: ['192.88.99.1', '192.88.99.3'], site: false },
  { range: '64:ff9b:1::/48', first: '64:ff9b:1::', last: '64:ff9b:1:ffff:ffff:ffff:ffff:ffff', outside: ['64:ff9b:0:ffff:ffff:ffff:ffff:ffff', '64:ff9b:2::'], site: false },
  { range: '100:0:0:1::/64', first: '100:0:0:1::', last: '100::1:ffff:ffff:ffff:ffff', outside: ['100:0:0:2::'], site: true },
  { range: '5f00::/16', first: '5f00::', last: '5f00:ffff:ffff:ffff:ffff:ffff:ffff:ffff', outside: ['5eff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', '5f01::'], site: true },
  { range: 'fec0::/10', first: 'fec0::', last: 'feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', outside: [], site: true },
  { range: '3fff::/20', first: '3fff::', last: '3fff:fff:ffff:ffff:ffff:ffff:ffff:ffff', outside: ['3fff:1000::', '3ffe:ffff:ffff:ffff:ffff:ffff:ffff:ffff'], site: true }
]

for (const { range, first, last, outside, site } of notGloballyReachable) {
  test(`${range} is local from its first to its last address`, t => {
    t.true(isLocalAddress(first), first)
    t.true(isLocalAddress(last), last)
    t.is(isSiteScoped(first), site, first)
    t.is(isSiteScoped(last), site, last)
  })

  if (outside.length > 0) {
    test(`${range} ends at its prefix length`, t => {
      for (const address of outside) t.false(isLocalAddress(address), address)
    })
  }
}

test('canonical spellings with the zero run in the middle', t => {
  t.true(isLocalAddress('100::1:0:0:5:6'))
  t.true(isLocalAddress('100:0:0:1:5::6'))
  t.true(isLocalAddress('3fff:0:1::'))
  t.true(isLocalAddress('3fff:fff::1'))
  t.true(isLocalAddress('64:ff9b:1:0:0:1::'))
  t.true(isLocalAddress('5f00:0:0:1::'))
  t.true(isLocalAddress('fed0::1'))
})
