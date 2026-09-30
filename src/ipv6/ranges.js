'use strict'

/**
 * IPv6 ranges treated as local, as regexes matched against the whole
 * hostname (brackets already stripped). The default export matches every
 * entry; the `site-scoped` export matches only entries whose `scope` is
 * `site`. See ../ipv4/ranges.js for what the scopes mean.
 */
module.exports = [
  // Matches IPv4-mapped IPv6 addresses in dotted decimal format: ::ffff:192.168.0.1
  // Accepts any embedded IPv4. The hex form (::ffff:c0a8:1) is instead decoded
  // and classified through the IPv4 matcher, so the site-scoped export leaves
  // this entry out and decodes the dotted form the same way.
  {
    re: /^::f{4}:(?:0:)?([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/,
    scope: 'global'
  },
  // Matches IPv6 addresses in the 64:ff9b::/96 range (NAT64)
  // RFC 6052 well-known prefix; embeds an arbitrary IPv4 in the low 32 bits.
  {
    re: /^64:ff9b::([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/,
    scope: 'global'
  },
  // Matches IPv6 addresses in the 100::/64 range
  { re: /^100:(:[0-9a-fA-F]{0,4}){0,6}$/, scope: 'site' },
  // Matches IPv6 addresses in the 2001::/32 range (Teredo), compressed form: 2001::…
  // RFC 4380: embeds the Teredo server and client public IPv4 addresses.
  { re: /^2001:(:[0-9a-fA-F]{0,4}){0,6}$/, scope: 'global' },
  // Matches IPv6 addresses in the 2001::/32 range (Teredo), explicit zero second hextet: 2001:0:…
  {
    re: /^2001:0{1,4}:([0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}$/,
    scope: 'global'
  },
  // Matches IPv6 addresses in the 2001:10::/28 range (ORCHID)
  {
    re: /^2001:1[0-9a-fA-F]:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
    scope: 'site'
  },
  // Matches IPv6 addresses in the 2001:2::/28 range
  {
    re: /^2001:2[0-9a-fA-F]?:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/,
    scope: 'site'
  },
  // Matches IPv6 addresses in the 2001:db8::/32 range (documentation prefix)
  { re: /^2001:db8:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/, scope: 'site' },
  // Matches IPv6 addresses in the 3fff::/20 range (documentation prefix)
  { re: /^3fff:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/, scope: 'site' },
  // Matches IPv6 addresses in the fc00::/7 range (ULA + optional legacy fb00)
  {
    re: /^f[b-d][0-9a-fA-F]{2}:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/i,
    scope: 'site'
  },
  // Matches IPv6 addresses in the fe80::/10 range (link-local)
  {
    re: /^fe[89ab][0-9a-fA-F]:(?:[0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}$/i,
    scope: 'site'
  },
  // Matches IPv6 multicast addresses in the ff00::/8 range (includes ff02::1)
  {
    re: /^ff[0-9a-fA-F]{2}:(?:[0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}$/i,
    scope: 'site'
  },
  // Matches localhost in IPv6 (:: or ::1)
  { re: /^::1?$/, scope: 'site' },
  // Matches IPv6 addresses in the fec0::/10 range (deprecated site-local unicast)
  { re: /^fec0:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/i, scope: 'site' },
  // Matches IPv6 addresses in the 2002::/16 range (6to4)
  // RFC 3056: bits 16-47 are the public IPv4 of the 6to4 router.
  { re: /^2002:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/, scope: 'global' }
]
