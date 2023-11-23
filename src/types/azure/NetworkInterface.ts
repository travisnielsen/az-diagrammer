export interface NetworkInterface {
    VirtualMachine?: VirtualMachine;
    ExtendedLocation?: null;
    IpConfigurations: (IpConfigurationsEntity1)[];
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
    Properties?: Properties;
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

interface Properties {
    provisioningState: string;
    resourceGuid: string;
    ipConfigurations: (IpConfigurationsEntity2)[];
    dnsSettings: DnsSettings;
    macAddress: string;
    vnetEncryptionSupported: boolean;
    enableIPForwarding: boolean;
    disableTcpStateTracking: boolean;
    primary: boolean;
    virtualMachine: VirtualMachine;
    hostedWorkloads?: (null)[] | null;
    tapConfigurations?: (null)[] | null;
    nicType: string;
    allowPort25Out: boolean;
    auxiliaryMode: string;
    auxiliarySku: string;
}

interface VirtualMachine {
    id: string;
}

interface IpConfigurationsEntity1 {
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

interface IpConfigurationsEntity2 {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: Properties1;
  }
interface Properties1 {
    provisioningState: string;
    privateIPAddress: string;
    privateIPAllocationMethod: string;
    subnet: VirtualMachine;
    primary: boolean;
    privateIPAddressVersion: string;
  }

interface Subnet {
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



  



















  export interface DnsSettings {
    dnsServers?: (null)[] | null;
    appliedDnsServers?: (null)[] | null;
  }
  