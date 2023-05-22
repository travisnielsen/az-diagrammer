import { Tags } from "./Tags";

export type VirtualNetwork = {
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
    ExtensionResourceType?: null;
    Sku?: null;
    Tags: Tags;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}

export type Properties = {
    provisioningState: string;
    resourceGuid: string;
    addressSpace: RemoteAddressSpaceOrRemoteVirtualNetworkAddressSpaceOrAddressSpace;
    dhcpOptions: DhcpOptions;
    subnets?: (SubnetsEntity)[] | null;
    virtualNetworkPeerings?: (VirtualNetworkPeeringsEntity)[] | null;
    enableDdosProtection: boolean;
}

export type RemoteAddressSpaceOrRemoteVirtualNetworkAddressSpaceOrAddressSpace = {
    addressPrefixes?: (string)[] | null;
}

export type DhcpOptions = {
    dnsServers?: (string)[] | null;
}

export type SubnetsEntity = {
    name: string;
    id: string;
    etag: string;
    properties: Properties1;
    type: string;
}

export type Properties1 = {
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

export type IpConfigurationsEntityOrNetworkSecurityGroupOrRouteTableOrNetworkIntentPoliciesEntityOrRemoteGatewaysEntityOrRemoteVirtualNetwork = {
    id: string;
}
export type  ServiceEndpointsEntity = {
    provisioningState: string;
    service: string;
    locations?: (string)[] | null;
}

export type DelegationsEntity = {
    name: string;
    id: string;
    etag: string;
    properties: Properties2;
    type: string;
}

export type Properties2 = {
    provisioningState: string;
    serviceName: string;
    actions?: (string)[] | null;
}

export type VirtualNetworkPeeringsEntity = {
    name: string;
    id: string;
    etag: string;
    properties: Properties3;
    type: string;
}

export type Properties3 = {
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

export type RouteServiceVips = {}

  