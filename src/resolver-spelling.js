'use strict'

const NOT_PRINTABLE_ASCII = /[^\x20-\x7e]/
const STRIP_NOT_PRINTABLE = /[^\x20-\x7e]/g
const NUMERIC_LABEL = /^(?:\d+|0x[0-9a-f]*)$/i
const NUMERIC_LABEL_LAST_CHARACTER = /^[\da-fx.]$/i
const HOSTNAME_CHARS = /[^a-z0-9.-]/
const DOTTED_QUAD = /^(?:(?:0|[1-9]\d{0,2})\.){3}(?:0|[1-9]\d{0,2})$/

const truncateAtNul = host => {
  const nul = host.indexOf('\0')
  return nul === -1 ? host : host.slice(0, nul)
}

const endsInANumber = host => {
  if (!NUMERIC_LABEL_LAST_CHARACTER.test(host.slice(-1))) return false
  const labels = host.endsWith('.') ? host.slice(0, -1) : host
  return NUMERIC_LABEL.test(labels.slice(labels.lastIndexOf('.') + 1))
}

const toUrlHostname = host => {
  try {
    return new URL(`http://${host}`).hostname
  } catch {
    return null
  }
}

const toResolvedHostname = hostname => {
  if (
    HOSTNAME_CHARS.test(hostname) ||
    (!DOTTED_QUAD.test(hostname) && endsInANumber(hostname))
  ) {
    return toUrlHostname(truncateAtNul(hostname))
  }
  return null
}

const toResolvedIPv6 = address => {
  if (!NOT_PRINTABLE_ASCII.test(address) && !address.endsWith(' ')) return address
  let host = truncateAtNul(address)
  if (NOT_PRINTABLE_ASCII.test(host)) {
    host = host.normalize('NFKC').replace(STRIP_NOT_PRINTABLE, '')
  }
  return host.trimEnd()
}

const toHostnameString = input => {
  if (input === null || (typeof input !== 'string' && typeof input !== 'object')) {
    throw new TypeError('Expected a string')
  }
  return String(input)
}

module.exports = { toHostnameString, toResolvedHostname, toResolvedIPv6 }
