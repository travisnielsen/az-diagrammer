export interface NetworkInterface {
    VirtualMachine: VirtualMachine;
    ExtendedLocation?: null;
    IpConfigurations: (IpConfigurationsEntity)[];
    TapConfigurations?: (null)[] | null;
    DnsSettings: DnsSettings;
    MacAddress: string;
    Primary: boolean;
    EnableAcceleratedNetworking: boolean;
    EnableIPForwarding: boolean;
    DisableTcpStateTracking: string;
    HostedWorkloads?: (null)[] | null;
    NetworkSecurityGroup?: null;
    PrivateEndpoint?: null;
    ProvisioningState: string;
    VnetEncryptionSupported: boolean;
    AuxiliaryMode: string;
    AuxiliarySku: string;
    ResourceGroupName: string;
    Location: string;
    ResourceGuid: string;
    Type: string;
    Tag: { [key: string]: string; }
    TagsTable: string;
    Name: string;
    Etag: string;
    Id: string;
}
interface VirtualMachine {
    Id: string;
}
export interface IpConfigurationsEntity {
    PrivateIpAddressVersion: string;
    LoadBalancerBackendAddressPools?: (null)[] | null;
    LoadBalancerInboundNatRules?: (null)[] | null;
    Primary: boolean;
    ApplicationGatewayBackendAddressPools?: (null)[] | null;
    ApplicationSecurityGroups?: (null)[] | null;
    VirtualNetworkTaps?: (null)[] | null;
    PrivateLinkConnectionProperties?: null;
    GatewayLoadBalancer?: null;
    PrivateIpAddress: string;
    PrivateIpAllocationMethod: string;
    Subnet: Subnet;
    PublicIpAddress?: null;
    ProvisioningState: string;
    Name: string;
    Etag: string;
    Id: string;
}
export interface Subnet {
    AddressPrefix?: null;
    IpConfigurations?: (null)[] | null;
    ServiceAssociationLinks?: (null)[] | null;
    ResourceNavigationLinks?: (null)[] | null;
    NetworkSecurityGroup?: null;
    RouteTable?: null;
    NatGateway?: null;
    ServiceEndpoints?: (null)[] | null;
    ServiceEndpointPolicies?: (null)[] | null;
    Delegations?: (null)[] | null;
    PrivateEndpoints?: (null)[] | null;
    ProvisioningState?: null;
    PrivateEndpointNetworkPolicies?: null;
    PrivateLinkServiceNetworkPolicies?: null;
    IpAllocations?: (null)[] | null;
    Name?: null;
    Etag?: null;
    Id: string;
}
interface DnsSettings {
    DnsServers?: (null)[] | null;
    AppliedDnsServers?: (null)[] | null;
    InternalDnsNameLabel?: null;
    InternalFqdn?: null;
    InternalDomainNameSuffix: string;
}

  