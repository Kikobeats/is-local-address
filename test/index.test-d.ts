import { expectType } from 'tsd'
import isLocalAddress from 'is-local-address'
import isLocalAddressIPv4 from 'is-local-address/ipv4'
import isLocalAddressIPv6 from 'is-local-address/ipv6'
import isSiteScopedAddress from 'is-local-address/site-scoped'

/* basic */

expectType<boolean>(isLocalAddress('localhost'))
expectType<boolean>(isLocalAddressIPv4('localhost'))
expectType<boolean>(isLocalAddressIPv6('localhost'))
expectType<boolean>(isSiteScopedAddress('localhost'))
expectType<boolean>(isSiteScopedAddress.ipv4('localhost'))
expectType<boolean>(isSiteScopedAddress.ipv6('localhost'))
