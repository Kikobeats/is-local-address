'use strict'

const test = require('ava').default
const { isIP } = require('net')

const isLocalAddress = require('is-local-address')
const isLocalIPv6 = require('is-local-address/ipv6')
const isSiteScoped = require('is-local-address/site-scoped')

const { internalIPv6s, externalIPs } = require('./cases')

const urlHostname = ip => new URL(`http://[${ip}]`).hostname.slice(1, -1)

const spellingsOf = {
  '10.0.0.1 mapped': ['::ffff:10.0.0.1', '::ffff:a00:1', '0:0:0:0:0:ffff:a00:1', '::FFFF:A00:1', '0000:0000:0000:0000:0000:ffff:0a00:0001'],
  '8.8.8.8 mapped': ['::ffff:8.8.8.8', '::ffff:808:808', '0:0:0:0:0:ffff:808:808', '::FFFF:808:808'],
  '10.0.0.1 NAT64': ['64:ff9b::10.0.0.1', '64:ff9b::a00:1', '64:ff9b:0:0:0:0:a00:1', '64:FF9B::A00:1'],
  '8.8.8.8 NAT64': ['64:ff9b::8.8.8.8', '64:ff9b::808:808', '64:ff9b:0:0:0:0:808:808'],
  'fe80 dotted tail': ['fe80::1.2.3.4', 'fe80::102:304', 'fe80:0:0:0:0:0:102:304'],
  'Teredo dotted tail': ['2001::1.2.3.4', '2001::102:304', '2001:0:0:0:0:0:102:304'],
  '6to4 dotted tail': ['2002::1.2.3.4', '2002::102:304'],
  'public dotted tail': ['2606:4700::1.1.1.1', '2606:4700::101:101']
}

const expected = {
  '10.0.0.1 mapped': { local: true, site: true },
  '8.8.8.8 mapped': { local: false, site: false },
  '10.0.0.1 NAT64': { local: true, site: false },
  '8.8.8.8 NAT64': { local: false, site: false },
  'fe80 dotted tail': { local: true, site: true },
  'Teredo dotted tail': { local: true, site: false },
  '6to4 dotted tail': { local: true, site: false },
  'public dotted tail': { local: false, site: false }
}

for (const [name, spellings] of Object.entries(spellingsOf)) {
  test(`every spelling classifies the same » ${name}`, t => {
    for (const ip of spellings) {
      t.is(isLocalAddress(ip), expected[name].local, ip)
      t.is(isLocalIPv6(ip), expected[name].local, ip)
      t.is(isSiteScoped(ip), expected[name].site, ip)
    }
  })
}

test('agrees with the new URL() spelling of every IPv6 fixture', t => {
  const ipv6Fixtures = internalIPv6s
    .concat(externalIPs)
    .map(({ ip }) => ip.replace(/^\[|\]$/g, ''))
    .filter(ip => isIP(ip) === 6)
  for (const ip of ipv6Fixtures) {
    t.is(isLocalAddress(ip), isLocalAddress(urlHostname(ip)), ip)
    t.is(isSiteScoped(ip), isSiteScoped(urlHostname(ip)), ip)
  }
})

const malformed = [
  '2001:0:1:2:3:4:5:6:7',
  '2001:db8:1:2:3:4:5:6:7:8',
  '2002:1:2:3:4:5:6:7:8',
  'fe80:1:2:3:4:5:6:7:8',
  'fe80::1::2',
  'fe80:::1',
  '2001:0:',
  'fe80::12345',
  '::00001',
  '::ffff:999.1.1.1',
  '::ffff:1.2.3',
  '::ffff:127.0.0.01',
  '::ffff:127.000.000.001',
  '::ffff:010.0.0.1',
  '64:ff9b::127.0.0.01',
  '64:ff9b::256.0.0.1',
  '2606:4700::1::1',
  ':::'
]

for (const ip of malformed) {
  test(`malformed IPv6 fails closed » ${ip}`, t => {
    t.true(isLocalAddress(ip), ip)
    t.true(isLocalIPv6(ip), ip)
    t.false(isSiteScoped(ip), ip)
  })
}

test('input that cannot be an IPv6 address is not local', t => {
  for (const host of ['fc00::g', 'cafe.be:80', 'dead:beef', '::1]/x', '[::1', '[[::1]]', 'example.com']) {
    t.false(isLocalAddress(host), host)
    t.false(isLocalIPv6(host), host)
    t.false(isSiteScoped(host), host)
  }
})

test('zone ids classify by the address', t => {
  t.true(isLocalAddress('::1%lo0'))
  t.true(isLocalAddress('fe80::1%eth0'))
  t.true(isLocalAddress('[fe80::1%25eth0]'))
  t.true(isSiteScoped('fe80::1%eth0'))
  t.false(isLocalAddress('2606:4700::1111%eth0'))
})

test('non-string input', t => {
  t.true(isLocalAddress(['::1']))
  t.true(isSiteScoped(['fe80::1']))
  t.throws(() => isLocalAddress(undefined), { instanceOf: TypeError })
  t.throws(() => isLocalAddress(null), { instanceOf: TypeError })
  t.throws(() => isSiteScoped(undefined), { instanceOf: TypeError })
  for (const value of [1, true, Symbol('::1'), BigInt(1)]) {
    t.throws(() => isLocalAddress(value), { instanceOf: TypeError }, String(value))
  }
})

test('valid compressed addresses next to the malformed ones still match', t => {
  t.true(isLocalAddress('2001:0:1:2:3:4:5::'))
  t.true(isLocalAddress('fe80:1:2:3:4:5:6:7'))
  t.true(isLocalAddress('2001:db8:1:2:3:4:5:6'))
  t.true(isLocalAddress('[::1]'))
})

test('100::/64 covers the first 64 bits only', t => {
  t.true(isLocalAddress('100::'))
  t.true(isLocalAddress('100::1:2:3:4'))
  t.true(isLocalAddress('100:0:0:0:1:2:3:4'))
  t.false(isLocalAddress('100::1:2:3:4:5'))
  t.false(isLocalAddress('100:0:0:1::'))
  t.false(isLocalAddress('100::66b2:2d11:fee9:96f9:2fe8:1'))
})
