declare function isSiteScopedAddress(ipAddress: string): boolean;

declare namespace isSiteScopedAddress {
  function ipv4(ipAddress: string): boolean;
  function ipv6(ipAddress: string): boolean;
}

export = isSiteScopedAddress;
