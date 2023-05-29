import { AzureBase } from "./AzureBase";

export interface VirtualNetwork extends AzureBase {
    ResourceId: string;
    Id: string;
    Identity?: null;
    Kind?: null;
    Location: string;
    ManagedBy?: null;
    ResourceName: string;
    Name: string;
    ExtensionResourceName?: null;
    ParentResource?: null;
    Plan?: null;
    Properties: Properties;
    ResourceGroupName: string;
    Type: string;
    ResourceType: string;
    ExtensionResourceinterface?: null;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}

interface Properties {
    provisioningState: string;
    resourceGuid: string;
    addressSpace: RemoteAddressSpaceOrRemoteVirtualNetworkAddressSpaceOrAddressSpace;
    dhcpOptions: DhcpOptions;
    subnets: (SubnetsEntity)[];
    virtualNetworkPeerings: (VirtualNetworkPeeringsEntity)[];
    enableDdosProtection: boolean;
}

interface RemoteAddressSpaceOrRemoteVirtualNetworkAddressSpaceOrAddressSpace {
    addressPrefixes?: (string)[] | null;
}

interface DhcpOptions {
    dnsServers?: (string)[] | null;
}

interface SubnetsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties1;
    type: string;
}

interface Properties1 {
    provisioningState: string;
    addressPrefix: string;
    networkSecurityGroup: IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork;
    routeTable: IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork;
    ipConfigurations?: (IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork)[] | null;
    serviceEndpoints?: (ServiceEndpointsEntity)[] | null;
    delegations?: (DelegationsEntity | null)[] | null;
    privateEndpointNetworkPolicies: string;
    privateLinkServiceNetworkPolicies: string;
    networkIntentPolicies?: (IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork)[] | null;
}

interface IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork {
    id: string;
}
interface  ServiceEndpointsEntity {
    provisioningState: string;
    service: string;
    locations?: (string)[] | null;
}

interface DelegationsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties2;
    type: string;
}

interface Properties2 {
    provisioningState: string;
    serviceName: string;
    actions?: (string)[] | null;
}

interface VirtualNetworkPeeringsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties3;
    type: string;
}

interface Properties3 {
    provisioningState: string;
    resourceGuid: string;
    peeringState: string;
    peeringSyncLevel: string;
    remoteVirtualNetwork: IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork;
    allowVirtualNetworkAccess: boolean;
    allowForwardedTraffic: boolean;
    allowGatewayTransit: boolean;
    useRemoteGateways: boolean;
    doNotVerifyRemoteGateways: boolean;
    peerCompleteVnets: boolean;
    remoteGateways?: (IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork)[] | null;
    remoteAddressSpace: RemoteAddressSpaceOrRemoteVirtualNetworkAddressSpaceOrAddressSpace;
    remoteVirtualNetworkAddressSpace: RemoteAddressSpaceOrRemoteVirtualNetworkAddressSpaceOrAddressSpace;
    routeServiceVips: RouteServiceVips;
}

 interface RouteServiceVips {}
