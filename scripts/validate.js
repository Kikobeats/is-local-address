'use strict'

const ipinfo = ip =>
  fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`).then(res =>
    res.json()
  )

const { externalIPs, internalIPs } = require('../test/cases')

;(async () => {
  // validate external IPs
  for (const [index, { ip }] of externalIPs.entries()) {
    const payload = await ipinfo(ip)
    if (payload.bogon) {
      console.log('EXTERNAL WRONG', index, ip, JSON.stringify(payload))
    }
  }

  // validate internal IPs
  for (const [index, { ip }] of internalIPs
    .filter(({ ip }) => ip !== 'localhost')
    .entries()) {
    const payload = await ipinfo(ip)
    if (!payload.bogon) {
      console.log('INTERNAL WRONG', index, ip, JSON.stringify(payload))
    }
  }
})()
