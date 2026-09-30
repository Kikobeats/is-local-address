'use strict'

const NOT_PRINTABLE_ASCII = /[^\x20-\x7e]/
const STRIP_NOT_PRINTABLE = /[^\x20-\x7e]/g
const NUMERIC_LABEL = /^(?:\d+|0x[0-9a-f]*)$/i
const NUMERIC_LABEL_LAST_CHARACTER = /^[\da-fx.]$/i
const NOT_A_HOSTNAME_CHARACTER = /[^a-z0-9.-]/
const DOTTED_QUAD = /^(?:(?:0|[1-9]\d{0,2})\.){3}(?:0|[1-9]\d{0,2})$/
const DECIMAL_QUAD = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
const SINGLE_NUMBER = /^(?:0x([0-9a-f]*)|(0[0-7]*)|([1-9]\d*))$/i
const IPV4_SPACE = 4294967296
const NO_SPELLINGS = []

const truncateAtNul = host => {
  const nul = host.indexOf('\0')
  return nul === -1 ? host : host.slice(0, nul)
}

const isIPv6Literal = host => host.indexOf(':') !== host.lastIndexOf(':')

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

const toDecimalQuad = host => {
  const match = DECIMAL_QUAD.exec(host)
  if (match === null) return null
  const octets = match.slice(1).map(Number)
  return octets.every(octet => octet <= 255) ? octets.join('.') : null
}

const toWrappedIPv4 = host => {
  const match = SINGLE_NUMBER.exec(host)
  if (match === null) return null
  const [digits, base] =
    match[1] !== undefined ? [match[1], 16] : match[2] !== undefined ? [match[2], 8] : [match[3], 10]
  let value = 0
  for (const digit of digits) value = (value * base + parseInt(digit, base)) % IPV4_SPACE
  return [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join('.')
}

const resolverSpellings = hostname => {
  if (NOT_A_HOSTNAME_CHARACTER.test(hostname)) {
    if (isIPv6Literal(hostname)) return NO_SPELLINGS
  } else if (DOTTED_QUAD.test(hostname) || !endsInANumber(hostname)) {
    return NO_SPELLINGS
  }
  const host = truncateAtNul(hostname)
  return [toUrlHostname(host), toDecimalQuad(host), toWrappedIPv4(host)].filter(Boolean)
}

const toResolvedIPv6 = address => {
  let host = address
  if (NOT_PRINTABLE_ASCII.test(host) || host.endsWith(' ')) {
    host = truncateAtNul(host)
    if (NOT_PRINTABLE_ASCII.test(host)) {
      host = host.normalize('NFKC').replace(STRIP_NOT_PRINTABLE, '')
    }
    host = host.trimEnd()
  }
  if (host[0] === '[' && !host.endsWith(']')) {
    const urlHostname = toUrlHostname(host)
    if (urlHostname !== null && urlHostname[0] === '[') return urlHostname
  }
  return host
}

const toHostnameString = input => {
  if (input === null || (typeof input !== 'string' && typeof input !== 'object')) {
    throw new TypeError('Expected a string')
  }
  return String(input)
}

module.exports = { toHostnameString, resolverSpellings, toResolvedIPv6 }
