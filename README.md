# is-local-address

> Check if an URL hostname is a local address, including support for [Bogon IP address](https://ipinfo.io/bogon) ranges.

## Why is-local-address?

Most solutions typically determine local IP addresses by checking DNS, which is slow and unreliable. This implementation uses the Bogon IP address specification for static validation, delivering:

- **Faster** than DNS-based checks
- **2-3.7x smaller** bundle than similar libraries: 1.81KB min+gzip, vs 3.70KB for `ipaddr.js` and 6.72KB for `private-ip`
- **100% accuracy** on all RFC-defined private IP ranges
- **Zero dependencies** for core functionality
- **Supports IPv4 and IPv6** including edge cases and mapped addresses

Check the [benchmark](/benchmark) for detailed performance metrics comparison.

## How it works

Instead of performing DNS lookups or complex regex validations, `is-local-address` uses a static, efficient approach:

1. **No network calls** - Validates against RFC specifications offline
2. **Regex matching** - Optimized patterns for IPv4, and for IPv6 after it is canonicalized by the platform's own `URL` parser, so every spelling of an address gets the same answer
3. **Minimal overhead** - About 1.8KB min+gzip

This makes it ideal for:
- High-performance APIs and microservices
- Edge computing environments with limited resources
- Security checks that need to run frequently
- Any scenario where you need fast, reliable local IP detection

## Install

```bash
$ npm install is-local-address --save
```

## Usage

The method exported by default supports detection of both IPv4 and IPv6 addresses:

```js
const isLocalAddress = require('is-local-address')

isLocalAddress(new URL('https://127.0.0.1').hostname) // true
isLocalAddress(new URL('http://[::]:3000').hostname) // true
isLocalAddress(new URL('https://example.com').hostname) // false
```

You can also specify to just resolve IPv4:

```js
const isLocalAddress = require('is-local-address/ipv4')
isLocalAddress(new URL('https://127.0.0.1').hostname) // true
isLocalAddress(new URL('http://[::1]:3000').hostname) // false
```

or just IPv6:

```js
const isLocalAddress = require('is-local-address/ipv6')
isLocalAddress(new URL('http://[::]:3000').hostname) // true
isLocalAddress(new URL('https://127.0.0.1').hostname) // false
```

## Site scope

The default export answers "is this address non-public", which is the question an SSRF guard asks, so it includes every bogon range. Some of those ranges are held by hosts outside your own network: RFC 6598 shared address space (`100.64.0.0/10`, carrier-grade NAT) is shared with every other subscriber of the same provider, and Teredo (`2001::/32`), 6to4 (`2002::/16`) and NAT64 (`64:ff9b::/96`) embed public IPv4 addresses.

When the question is "is this address inside one administrative network", for example before reflecting a CORS origin, use the site-scoped export. It drops those four ranges and keeps the rest: loopback, RFC 1918, ULA, link-local, documentation and benchmarking prefixes, and the multicast and reserved blocks, which are kept whole because none of them can be a unicast origin.

```js
const isSiteScoped = require('is-local-address/site-scoped')

isSiteScoped('192.168.1.20') // true
isSiteScoped('100.64.0.1') // false, RFC 6598 shared space
isSiteScoped(new URL('http://[2002:808:808::1]').hostname) // false, 6to4

isSiteScoped.ipv4('10.0.0.1') // IPv4 only
isSiteScoped.ipv6('fe80::1') // IPv6 only
```

## IPv6 spellings

IPv6 input is canonicalized before matching, so the same address gets the same answer however it is written: dotted or hex tail, compressed or not, upper or lower case, with or without a zone id.

Input that looks like IPv6 but cannot be parsed, such as nine hextets, two `::` or a leading-zero octet, fails closed. Some operating system resolvers accept spellings the URL standard rejects (macOS reads `::ffff:127.0.0.01` as loopback), so the default export treats it as local and the site-scoped export treats it as outside your network.

```js
isLocalAddress('fe80::1.2.3.4') // true, same as fe80::102:304
isLocalAddress('FE80::1') // true
isLocalAddress('fe80::1%eth0') // true, zone id
isLocalAddress('fe80::1::2') // true, malformed: fails closed
```

Addresses that embed an IPv4 classify by that IPv4, because it is where a connection to them ends up: IPv4-mapped (`::ffff:0:0/96`) in the default and site-scoped exports, and NAT64 (`64:ff9b::/96`) in the default export.

```js
isLocalAddress('::ffff:10.0.0.1') // true
isLocalAddress('::ffff:808:808') // false, 8.8.8.8
isLocalAddress('64:ff9b::a00:1') // true, 10.0.0.1
isLocalAddress('64:ff9b::8.8.8.8') // false
```

## Resolver spellings

An SSRF guard has to classify the address a request actually reaches, not the text it was given. URL parsers and system resolvers accept many spellings of the same IPv4 address, so the default, `/ipv4` and `/ipv6` exports classify both the input and what the platform turns it into, and report local if either is local:

```js
isLocalAddress('0x7f.1') // true, 127.0.0.1
isLocalAddress('2130706433') // true, 127.0.0.1
isLocalAddress('0177.0.0.1') // true, 127.0.0.1
isLocalAddress('127.0.0.1\u00ad') // true, soft hyphen is ignored
isLocalAddress('127.0.0.1\u0000.evil.com') // true, C resolvers stop at NUL
isLocalAddress('::\uff11') // true, fullwidth digit
isLocalAddress('0x8.0x8.0x8.0x8') // false, 8.8.8.8
isLocalAddress('0127.0.0.1') // true, macOS reads leading zeros as decimal
isLocalAddress('6425673729') // true, macOS wraps 2^32 + 127.0.0.1
isLocalAddress('[::1]:80') // true, a URL parser reads the host
```

When platforms disagree, the answer is local if any of them resolves to a local address. In a four-part address made only of digits, macOS reads leading zeros as decimal while the URL standard reads them as octal, so `012.168.127.1` is `12.168.127.1` for macOS and `10.168.127.1` for URL parsers. macOS also wraps a single number past 2^32 where URL parsers reject it. glibc follows `inet_aton`; it is not covered by the tests here.

The site-scoped export does the opposite: it trusts only the literal spelling, so `127.1` or `0x7f.0.0.1` are not site-scoped, because an unusual spelling is not evidence of being inside your network.

## License

**is-local-address** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/is-local-address/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/is-local-address/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · X [@Kikobeats](https://x.com/Kikobeats)
