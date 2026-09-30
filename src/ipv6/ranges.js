'use strict'

module.exports = {
  site: [
    // 100::/64
    '100:(:[0-9a-fA-F]{0,4}){0,6}',
    // 2001:10::/28 (ORCHID)
    '2001:1[0-9a-fA-F]:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}',
    // 2001:2::/28
    '2001:2[0-9a-fA-F]?:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}',
    // 2001:db8::/32 (documentation prefix)
    '2001:db8:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}',
    // 3fff::/20 (documentation prefix)
    '3fff:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}',
    // fc00::/7 (ULA + optional legacy fb00)
    'f[b-d][0-9a-fA-F]{2}:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}',
    // fe80::/10 (link-local)
    'fe[89ab][0-9a-fA-F]:(?:[0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}',
    // ff00::/8 (multicast)
    'ff[0-9a-fA-F]{2}:(?:[0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}',
    // :: and ::1
    '::1?',
    // fec0::/10 (deprecated site-local unicast)
    'fec0:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}'
  ],
  global: [
    // ::ffff:192.168.0.1, any embedded IPv4; the hex form is decoded by extractMappedIPv4 instead
    '::f{4}:(?:0:)?[0-9]{1,3}(?:\\.[0-9]{1,3}){3}',
    // 64:ff9b::/96 (NAT64, RFC 6052): embeds an arbitrary IPv4
    '64:ff9b::[0-9]{1,3}(?:\\.[0-9]{1,3}){3}',
    // 2001::/32 (Teredo, RFC 4380), compressed form 2001::…, embeds public IPv4 addresses
    '2001:(:[0-9a-fA-F]{0,4}){0,6}',
    // 2001::/32 (Teredo), explicit zero second hextet 2001:0:…
    '2001:0{1,4}:([0-9a-fA-F]{0,4}:){0,6}[0-9a-fA-F]{0,4}',
    // 2002::/16 (6to4, RFC 3056): embeds the router's public IPv4
    '2002:([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}'
  ]
}
