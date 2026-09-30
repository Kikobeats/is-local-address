'use strict'

module.exports = {
  site: [
    // 100::/64
    '100:(:[0-9a-f]{0,4}){0,4}',
    // 100:0:0:1::/64 (dummy IPv6 prefix)
    '100::1(:[0-9a-f]{1,4}){4}',
    '100:0:0:1:([0-9a-f]{0,4}:){0,4}[0-9a-f]{0,4}',
    // 2001:10::/28 (ORCHID)
    '2001:1[0-9a-f]:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}',
    // 2001:2::/28
    '2001:2[0-9a-f]?:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}',
    // 2001:db8::/32 (documentation prefix)
    '2001:db8:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}',
    // 3fff::/20 (documentation prefix)
    '3fff:[0-9a-f]{0,3}:([0-9a-f]{0,4}:){0,6}[0-9a-f]{0,4}',
    // 5f00::/16 (SRv6 SIDs, RFC 9602)
    '5f00:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}',
    // fc00::/7 (ULA + optional legacy fb00)
    'f[b-d][0-9a-f]{2}:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}',
    // fe80::/10 (link-local)
    'fe[89ab][0-9a-f]:(?:[0-9a-f]{0,4}:){0,6}[0-9a-f]{0,4}',
    // ff00::/8 (multicast)
    'ff[0-9a-f]{2}:(?:[0-9a-f]{0,4}:){0,6}[0-9a-f]{0,4}',
    // :: and ::1
    '::1?',
    // fec0::/10 (deprecated site-local unicast)
    'fe[c-f][0-9a-f]:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}'
  ],
  global: [
    // 2001::/32 (Teredo, RFC 4380), compressed form 2001::…, embeds public IPv4 addresses
    '2001:(:[0-9a-f]{0,4}){0,6}',
    // 2001::/32 (Teredo), explicit zero second hextet 2001:0:…
    '2001:0{1,4}:([0-9a-f]{0,4}:){0,6}[0-9a-f]{0,4}',
    // 2002::/16 (6to4, RFC 3056): embeds the router's public IPv4
    '2002:([0-9a-f]{0,4}:){0,7}[0-9a-f]{0,4}',
    // 64:ff9b:1::/48 (local-use NAT64, RFC 8215): embeds an IPv4 at an operator-chosen offset
    '64:ff9b:1:([0-9a-f]{0,4}:){0,5}[0-9a-f]{0,4}'
  ]
}
