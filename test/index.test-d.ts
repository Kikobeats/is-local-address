import isLocalAddress from '../src'
import isLocalAddressIPv4 from '../src/ipv4'
import isLocalAddressIPv6 from '../src/ipv6'

/* basic */

isLocalAddress('localhost')
isLocalAddressIPv4('localhost')
isLocalAddressIPv6('localhost')
