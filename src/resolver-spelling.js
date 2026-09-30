'use strict'

const NOT_PRINTABLE_ASCII = /[^\x20-\x7e]/
const NUMERIC_LABEL = /^(?:\d+|0x[0-9a-f]*)$/i
const NUMERIC_LABEL_LAST_CHARACTER = /^[\da-fx.]$/i
const NON_ASCII = /[\u0080-\uffff]/g
const URL_ONLY_SYNTAX = /[/?#@\\:%[\]]/
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

const toUrlHostnameWithoutUrlSyntax = host =>
  URL_ONLY_SYNTAX.test(host) ? null : toUrlHostname(host)

const toResolvedHostname = hostname => {
  if (NOT_PRINTABLE_ASCII.test(hostname)) {
    return toUrlHostnameWithoutUrlSyntax(truncateAtNul(hostname))
  }
  if (DOTTED_QUAD.test(hostname) || !endsInANumber(hostname)) return null
  return toUrlHostnameWithoutUrlSyntax(hostname)
}

const toResolvedIPv6 = address =>
  NOT_PRINTABLE_ASCII.test(address)
    ? truncateAtNul(address).normalize('NFKC').replace(NON_ASCII, '')
    : address

const toHostnameString = input => {
  if (input === null || (typeof input !== 'string' && typeof input !== 'object')) {
    throw new TypeError('Expected a string')
  }
  return String(input)
}

module.exports = { toHostnameString, toResolvedHostname, toResolvedIPv6 }
