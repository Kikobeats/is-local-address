'use strict'

const MAPPED_HEX = /^::f{4}:(?:0:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i
const NAT64_HEX = /^64:ff9b::(?:([0-9a-f]{1,4}):)?([0-9a-f]{1,4})?$/
const IPV6_CHARACTERS = /^[0-9a-f:.]+$/i

const hexPairToIPv4 = (hi, lo) =>
  (hi >> 8) + '.' + (hi & 0xff) + '.' + (lo >> 8) + '.' + (lo & 0xff)

function extractMappedIPv4 (addr) {
  if (addr.length < 10 || addr.charCodeAt(1) !== 58) return null
  const match = MAPPED_HEX.exec(addr)
  if (!match) return null
  return hexPairToIPv4(parseInt(match[1], 16), parseInt(match[2], 16))
}

function extractNAT64IPv4 (addr) {
  const match = NAT64_HEX.exec(addr)
  if (!match) return null
  return hexPairToIPv4(parseInt(match[1] || '0', 16), parseInt(match[2] || '0', 16))
}

const extractEmbeddedIPv4 = addr => extractMappedIPv4(addr) || extractNAT64IPv4(addr)

const looksLikeIPv6 = host =>
  host.indexOf(':') !== host.lastIndexOf(':') && IPV6_CHARACTERS.test(host)

const withoutZoneId = host => {
  const zoneIdStart = host.indexOf('%')
  return zoneIdStart === -1 ? host : host.slice(0, zoneIdStart)
}

const toCanonicalIPv6 = host => {
  try {
    return new URL(`http://[${host}]`).hostname.slice(1, -1)
  } catch {
    return null
  }
}

module.exports = (
  ranges,
  ipv4,
  { extractIPv4 = extractMappedIPv4, malformedIsLocal = false } = {}
) => {
  const regex = new RegExp(`^(${ranges.join('|')})$`, 'i')

  const isLocalAddress = input => {
    if (input === null || (typeof input !== 'string' && typeof input !== 'object')) {
      throw new TypeError('Expected a string')
    }
    let host = String(input)

    const len = host.length
    if (len > 2 && host[0] === '[' && host[len - 1] === ']') {
      host = host.slice(1, -1)
    }

    host = withoutZoneId(host)
    if (!looksLikeIPv6(host)) return false

    const canonical = toCanonicalIPv6(host)
    if (canonical === null) return malformedIsLocal

    const embeddedIPv4 = extractIPv4(canonical)
    return embeddedIPv4 ? ipv4(embeddedIPv4) : regex.test(canonical)
  }

  isLocalAddress.regex = regex
  isLocalAddress.extractMappedIPv4 = extractMappedIPv4
  return isLocalAddress
}

module.exports.extractMappedIPv4 = extractMappedIPv4
module.exports.extractEmbeddedIPv4 = extractEmbeddedIPv4
