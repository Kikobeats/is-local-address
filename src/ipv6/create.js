'use strict'

const MAPPED_HEX = /^::f{4}:(?:0:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i

function extractMappedIPv4 (addr) {
  if (addr.length < 10 || addr.charCodeAt(1) !== 58) return null
  const match = MAPPED_HEX.exec(addr)
  if (!match) return null
  const hi = parseInt(match[1], 16)
  const lo = parseInt(match[2], 16)
  return (hi >> 8) + '.' + (hi & 0xff) + '.' + (lo >> 8) + '.' + (lo & 0xff)
}

module.exports = (ranges, ipv4) => {
  const regex = new RegExp(`^(${ranges.join('|')})$`)

  const isLocalAddress = input => {
    let host = input

    const len = host.length
    if (len > 2 && host[0] === '[' && host[len - 1] === ']') {
      host = host.slice(1, -1)
    }

    const mappedIPv4 = extractMappedIPv4(host)
    return mappedIPv4 ? ipv4(mappedIPv4) : regex.test(host)
  }

  isLocalAddress.regex = regex
  isLocalAddress.extractMappedIPv4 = extractMappedIPv4
  return isLocalAddress
}

module.exports.extractMappedIPv4 = extractMappedIPv4
