# is-local-address

> Check if an URL hostname is a local address, including support for [Bogon IP address](https://ipinfo.io/bogon) ranges.

Most solutions typically determine local IP addresses by checking DNS.

However, this implementation uses the Bogon IP address specification, delivering performance five times faster than alternative approaches.

Check [benchmark](/benchmark) for detailed performance metrics.

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
```

You can also specify to just resolve IPv4:

```js
const isLocalAddress = require('is-local-address/ipv4')
isLocalAddress(new URL('https://127.0.0.1').hostname) // true
```

or just IPv6:

```js
const isLocalAddress = require('is-local-address/ipv6')
isLocalAddress(new URL('http://[::]:3000').hostname) // true
```

## License

**is-local-address** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/is-local-address/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/is-local-address/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · X [@Kikobeats](https://x.com/Kikobeats)
