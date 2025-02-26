const { isIP } = require('net')

const IP_RANGES = [
  '::',
  '::1',
  '::ffff:0.0.0.0',
  '::ffff:192.168.255.254',
  '::ffff:255.255.255.255',
  '0.0.0.0',
  '0.0.0.1',
  '10.0.0.0',
  '10.0.0.1',
  '10.1.1.1',
  '10.255.255.254',
  '10.255.255.255',
  '64:ff9b::0.0.0.0',
  '64:ff9b::16.10.11.1',
  '64:ff9b::255.255.255.255',
  '100::',
  '100::0:0:0:0',
  '100::1:eabc:0:2',
  '100::ffff:ffff:ffff:ffff',
  '100.64.1.1',
  '127.0.0.0',
  '127.0.0.1',
  '127.0.53.53',
  '127.255.255.254',
  '127.255.255.255',
  '169.254.1.1',
  '172.16.0.0',
  '172.16.0.1',
  '172.16.1.1',
  '172.31.255.254',
  '172.31.255.255',
  '192.0.0.1',
  '192.0.2.1',
  '192.168.0.0',
  '192.168.0.1',
  '192.168.1.1',
  '192.168.255.254',
  '192.168.255.255',
  '198.18.1.1',
  '198.51.100.1',
  '203.0.113.1',
  '224.0.0.0',
  '226.84.185.150',
  '227.202.96.196',
  '240.0.0.1',
  '255.255.255.255',
  '2001::',
  '2001::a:b:c',
  '2001::ffff:ffff:ffff:ffff:ffff:ffff',
  '2001:1f:ffff:ffff:ffff:ffff:ffff:ffff',
  '2001:2:ffff:ffff:ffff:ffff:ffff:ffff',
  '2001:2f::a:b:c',
  '2001:2f:ffff:ffff:ffff:ffff:ffff:ffff',
  '2001:10::',
  '2001:20::',
  '2001:20::a:b:c',
  '2001:db8::',
  '2001:db8::1',
  '2001:db8:abc::1',
  '2001:db8:ffff:ffff:ffff:ffff:ffff:ffff',
  '2002::',
  '2002::1',
  '2002::abc:1',
  '2002:c0a8:fffe::',
  '2002:c0a8:fffe:0000:0000:0000:0000:0000',
  '2002:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
  'fb00::',
  'fbff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
  'fec0::',
  'localhost'
]

const internalIPs = IP_RANGES.map(ip => ({ type: isIP(ip), ip }))

const externalIPs = [
  '::1fff:0:0.0.0.0',
  '::1fff:0:10.0.0.0',
  '::1fff:0.0.0.0',
  '::1fff:10.0.0.0',
  '44.37.112.180',
  '46.192.247.73',
  '64:ff9a::0.0.0.0',
  '64:ff9a::255.255.255.255',
  '71.12.102.112',
  '81.20.19.73',
  '99::',
  '99::ffff:ffff:ffff:ffff',
  '101::',
  '101::ffff:ffff:ffff:ffff',
  '101.0.26.90',
  '111.211.73.40',
  '156.238.194.84',
  '164.101.185.82',
  '223.231.138.242',
  '2000::',
  '2000::ffff:ffff:ffff:ffff:ffff:ffff',
  '2001:db7::',
  '2001:db7:ffff:ffff:ffff:ffff:ffff:ffff',
  '2001:db9::',
  'example.com:80',
  'example.com'
].map(ip => ({ type: isIP(ip), ip }))

module.exports = {
  IP_RANGES,
  internalIPs,
  externalIPs,
  externalIpv4s: externalIPs.filter(({ type }) => type === 4 || type === 0),
  internalIPv4s: internalIPs.filter(({ type }) => type === 4),
  internalIPv6s: internalIPs.filter(
    ({ ip, type }) => type === 6 || (type === 0 && ip.includes('::'))
  )
}
