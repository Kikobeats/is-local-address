'use strict'

/**
 * IPv4 ranges treated as local, as regex sources matched against the whole
 * hostname. The default export matches every entry; the `site-scoped` export
 * matches only entries whose `scope` is `site`.
 *
 * `scope` records how far an address in the range can reach:
 *
 * - `site`: reachable only inside one administrative network (RFC 4007 site
 *   scope or narrower), not routable, or not usable as a unicast source.
 * - `global`: unicast address space that hosts outside the site can hold.
 */
module.exports = [
  // 0.0.0.0 - 0.255.255.255
  { re: '0(?:\\.\\d{1,3}){3}', scope: 'site' },
  // 10.0.0.0 - 10.255.255.255
  { re: '10(?:\\.\\d{1,3}){3}', scope: 'site' },
  // 127.0.0.0 - 127.255.255.255
  { re: '127(?:\\.\\d{1,3}){3}', scope: 'site' },
  // 169.254.1.0 - 169.254.254.255
  {
    re: '169\\.254\\.(?:[1-9]|1?\\d\\d|2[0-4]\\d|25[0-4])\\.\\d{1,3}',
    scope: 'site'
  },
  // 172.16.0.0 - 172.31.255.255
  { re: '172\\.(?:1[6-9]|2\\d|3[01])(?:\\.\\d{1,3}){2}', scope: 'site' },
  // 192.0.0.0 - 192.0.0.255, 192.0.2.0 - 192.0.2.255, 192.168.0.0 - 192.168.255.255
  {
    re: '192\\.(?:0\\.0(?:\\.\\d{1,3})|0\\.2(?:\\.\\d{1,3})|168(?:\\.\\d{1,3}){2})',
    scope: 'site'
  },
  // 100.64.0.0 - 100.127.255.255
  // RFC 6598 shared address space: shared between a provider and all of its
  // subscribers, so other subscribers behind the same carrier NAT hold it.
  {
    re: '100\\.(?:6[4-9]|[7-9]\\d|1[01]\\d|12[0-7])(?:\\.\\d{1,3}){2}',
    scope: 'global'
  },
  // 198.18.0.0 - 198.19.255.255, 198.51.100.0 - 198.51.100.255
  {
    re: '198\\.(?:1[89](?:\\.\\d{1,3}){2}|51\\.100(?:\\.\\d{1,3}))',
    scope: 'site'
  },
  // 203.0.113.0 - 203.0.113.255
  { re: '203\\.0\\.113(?:\\.\\d{1,3})', scope: 'site' },
  // 224.0.0.0 - 239.255.255.255
  { re: '22[4-9](?:\\.\\d{1,3}){3}|23[0-9](?:\\.\\d{1,3}){3}', scope: 'site' },
  // 240.0.0.0 - 255.255.255.255
  { re: '24[0-9](?:\\.\\d{1,3}){3}|25[0-5](?:\\.\\d{1,3}){3}', scope: 'site' },
  // localhost in IPv4
  { re: 'localhost', scope: 'site' }
]
