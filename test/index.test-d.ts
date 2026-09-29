import isLocalAddress from '../src'
import isLocalAddressIPv4 from '../src/ipv4'
import isLocalAddressIPv6 from '../src/ipv6'
import isSiteScopedAddress from '../src/site-scoped'

/* basic */

isLocalAddress('localhost')
isLocalAddressIPv4('localhost')
isLocalAddressIPv6('localhost')
isSiteScopedAddress('localhost')
isSiteScopedAddress.ipv4('localhost')
isSiteScopedAddress.ipv6('localhost')
