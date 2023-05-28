import { AzureBase } from "./AzureBase";

export interface StorageAccount extends AzureBase {
    ResourceId: string;
    Id: string;
    Identity: Identity;
    Kind: string;
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
    CreatedTime: string;
    ChangedTime?: null;
    ETag?: null;
}
  
interface Identity {
    PrincipalId: string;
    TenantId: string;
    Type: string;
    UserAssignedIdentities?: null;
}
  
interface Properties {
    publicNetworkAccess: string;
    keyCreationTime: KeyCreationTime;
    privateEndpointConnections?: (PrivateEndpointConnectionsEntity)[] | null;
    minimumTlsVersion: string;
    allowBlobPublicAccess: boolean;
    largeFileSharesState: string;
    isHnsEnabled: boolean;
    networkAcls: NetworkAcls;
    supportsHttpsTrafficOnly: boolean;
    encryption: Encryption;
    accessTier: string;
    provisioningState: string;
    creationTime: string;
    primaryEndpoints: PrimaryEndpoints;
    primaryLocation: string;
    statusOfPrimary: string;
}
  
interface KeyCreationTime {
    key1: string;
    key2: string;
}
 
interface PrivateEndpointConnectionsEntity {
    id: string;
    name: string;
    type: string;
    properties: Properties1;
}
  
  
interface Properties1 {
    provisioningState: string;
    privateEndpoint: PrivateEndpoint;
    privateLinkServiceConnectionState: PrivateLinkServiceConnectionState;
}

interface PrivateEndpoint {
    id: string;
}
  
interface PrivateLinkServiceConnectionState {
    status: string;
    description: string;
    actionRequired: string;
}
  
interface NetworkAcls {
    resourceAccessRules?: (null)[] | null;
    bypass: string;
    virtualNetworkRules?: (VirtualNetworkRulesEntity)[] | null;
    ipRules?: (IpRulesEntity)[] | null;
    defaultAction: string;
}
  
interface VirtualNetworkRulesEntity {
    id: string;
    action: string;
    state: string;
}
  
interface IpRulesEntity {
    value: string;
    action: string;
}
  
interface Encryption {
    services: Services;
    keySource: string;
}
  
interface Services {
    file: FileOrBlob;
    blob: FileOrBlob;
}
  
interface FileOrBlob {
    keyType: string;
    enabled: boolean;
    lastEnabledTime: string;
}

interface PrimaryEndpoints {
    dfs: string;
    web: string;
    blob: string;
    queue: string;
    table: string;
    file: string;
}
  
  