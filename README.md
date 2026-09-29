# is-local-address

> Check if an URL hostname is a local address, including support for [Bogon IP address](https://ipinfo.io/bogon) ranges.

## Why is-local-address?

Most solutions typically determine local IP addresses by checking DNS, which is slow and unreliable. This implementation uses the Bogon IP address specification for static validation, delivering:

- **5x faster** than alternative approaches (DNS-based)
- **100x smaller** bundle size compared to similar libraries
- **100% accuracy** on all RFC-defined private IP ranges
- **Zero dependencies** for core functionality
- **Supports IPv4 and IPv6** including edge cases and mapped addresses

Check the [benchmark](/benchmark) for detailed performance metrics comparison.

## How it works

Instead of performing DNS lookups or complex regex validations, `is-local-address` uses a static, efficient approach:

1. **No network calls** - Validates against RFC specifications offline
2. **Pure regex matching** - Optimized patterns for IPv4 and IPv6
3. **Minimal overhead** - Only ~100 bytes gzipped

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

IPv4-mapped addresses classify by their embedded IPv4 in both the hex form (`::ffff:c0a8:1`, which is what `new URL()` produces) and the dotted form (`::ffff:192.168.0.1`).

## License

**is-local-address** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/is-local-address/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/is-local-address/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · X [@Kikobeats](https://x.com/Kikobeats)
