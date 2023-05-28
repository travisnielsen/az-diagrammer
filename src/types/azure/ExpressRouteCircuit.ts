import { AzureBase } from "./AzureBase";

export interface ExpressRouteCircuit extends AzureBase {
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
    peerings?: (PeeringsEntity)[] | null;
    authorizations?: (AuthorizationsEntity)[] | null;
    serviceProviderProperties: ServiceProviderProperties;
    circuitProvisioningState: string;
    allowClassicOperations: boolean;
    gatewayManagerEtag: string;
    serviceKey: string;
    serviceProviderProvisioningState: string;
    allowGlobalReach: boolean;
    globalReachEnabled: boolean;
    stag: number;
}
  
interface PeeringsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties1;
    type: string;
}
  
interface Properties1 {
    provisioningState: string;
    peeringType: string;
    azureASN: number;
    peerASN: number;
    primaryPeerAddressPrefix: string;
    secondaryPeerAddressPrefix: string;
    primaryAzurePort: string;
    secondaryAzurePort: string;
    state: string;
    vlanId: number;
    gatewayManagerEtag: string;
    lastModifiedBy: string;
    connections?: (null)[] | null;
    peeredConnections?: (null)[] | null;
}
  
interface AuthorizationsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties2;
    type: string;
}
  
interface Properties2 {
    provisioningState: string;
    authorizationKey: string;
    authorizationUseStatus: string;
}
  
interface ServiceProviderProperties {
    serviceProviderName: string;
    peeringLocation: string;
    bandwidthInMbps: number;
}
  

  