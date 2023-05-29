import { AzureBase } from "./AzureBase";

export interface VnetGateway extends AzureBase {
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
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}
  
interface Properties {
    provisioningState: string;
    resourceGuid: string;
    packetCaptureDiagnosticState: string;
    enablePrivateIpAddress: boolean;
    isMigrateToCSES: boolean;
    ipConfigurations: (IpConfigurationsEntity)[];
    natRules?: (NatRulesEntity)[] | null;
    virtualNetworkGatewayPolicyGroups?: (null)[] | null;
    enableBgpRouteTranslationForNat: boolean;
    disableIPSecReplayProtection: boolean;
    sku: AzureBase["Sku"];
    gatewayType: string;
    vpnType: string;
    enableBgp: boolean;
    activeActive: boolean;
    bgpSettings: BgpSettings;
    remoteVirtualNetworkPeerings?: (PublicIPAddressOrSubnetOrRemoteVirtualNetworkPeeringsEntity)[] | null;
    vpnGatewayGeneration: string;
    allowRemoteVnetTraffic: boolean;
    allowVirtualWanTraffic: boolean;
}
  
interface IpConfigurationsEntity {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: Properties1;
}
  
interface Properties1 {
    provisioningState: string;
    privateIPAllocationMethod: string;
    publicIPAddress: PublicIPAddressOrSubnetOrRemoteVirtualNetworkPeeringsEntity;
    subnet: PublicIPAddressOrSubnetOrRemoteVirtualNetworkPeeringsEntity;
}
  
interface PublicIPAddressOrSubnetOrRemoteVirtualNetworkPeeringsEntity {
    id: string;
}
  
interface NatRulesEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties2;
    type: string;
}
  
interface Properties2 {
    provisioningState: string;
    type: string;
    mode: string;
    internalMappings?: (InternalMappingsEntityOrExternalMappingsEntity)[] | null;
    externalMappings?: (InternalMappingsEntityOrExternalMappingsEntity)[] | null;
    ipConfigurationId: string;
}
  
interface InternalMappingsEntityOrExternalMappingsEntity {
    addressSpace: string;
    portRange: string;
}

interface BgpSettings {
    asn: number;
    bgpPeeringAddress: string;
    peerWeight: number;
    bgpPeeringAddresses?: (BgpPeeringAddressesEntity)[] | null;
}
  
interface BgpPeeringAddressesEntity {
    ipconfigurationId: string;
    defaultBgpIpAddresses?: (string)[] | null;
    customBgpIpAddresses?: (null)[] | null;
    tunnelIpAddresses?: (string)[] | null;
}