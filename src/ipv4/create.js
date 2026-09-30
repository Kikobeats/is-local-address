'use strict'

module.exports = ranges => {
  const regex = new RegExp(`^(${ranges.join('|')})$`)

  const isLocalAddress = hostname => {
    const host = String(hostname).toLowerCase().replace(/\.$/, '')
    return (
      host.endsWith('.localhost') ||
      host === 'localhost.localdomain' ||
      regex.test(host)
    )
  }

  isLocalAddress.regex = regex
  return isLocalAddress
}
