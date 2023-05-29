import { AzureBase } from "./AzureBase";

export interface CosmosAccount extends AzureBase {
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
    CreatedTime?: null;
    ChangedTime?: null;
    ETag?: null;
}
  
interface Identity {
    PrincipalId?: null;
    TenantId?: null;
    Type: string;
    UserAssignedIdentities?: null;
}

interface Properties {
    provisioningState: string;
    documentEndpoint: string;
    sqlEndpoint: string;
    publicNetworkAccess: string;
    enableAutomaticFailover: boolean;
    enableMultipleWriteLocations: boolean;
    enablePartitionKeyMonitor: boolean;
    isVirtualNetworkFilterEnabled: boolean;
    virtualNetworkRules: (VirtualNetworkRulesEntity)[];
    EnabledApiTypes: string;
    disableKeyBasedMetadataWriteAccess: boolean;
    enableFreeTier: boolean;
    enableAnalyticalStorage: boolean;
    analyticalStorageConfiguration: {};
    instanceId: string;
    createMode: string;
    databaseAccountOfferType: string;
    defaultIdentity: string;
    networkAclBypass: string;
    enableClientTelemetry: boolean;
    disableLocalAuth: boolean;
    enablePartitionMerge: boolean;
    minimalTlsVersion: string;
    consistencyPolicy: ConsistencyPolicy;
    configurationOverrides: {};
    writeLocations?: (WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity)[] | null;
    readLocations?: (WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity)[] | null;
    locations?: (WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity)[] | null;
    failoverPolicies?: (FailoverPoliciesEntity)[] | null;
    cors?: (null)[] | null;
    capabilities?: (null)[] | null;
    ipRules?: (IpRulesEntity)[] | null;
    backupPolicy: BackupPolicy;
    networkAclBypassResourceIds?: (null)[] | null;
    keysMetadata: {
        primaryMasterKey: { generationTime: string; };
        secondaryMasterKey: { generationTime: string; };
        primaryReadonlyMasterKey: { generationTime: string; };
        secondaryReadonlyMasterKey: { generationTime: string; };
    };
}

interface VirtualNetworkRulesEntity {
    id: string;
    ignoreMissingVNetServiceEndpoint: boolean;
}

  
interface ConsistencyPolicy {
    defaultConsistencyLevel: string;
    maxIntervalInSeconds: number;
    maxStalenessPrefix: number;
}
  
interface WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity {
    id: string;
    locationName: string;
    documentEndpoint: string;
    provisioningState: string;
    failoverPriority: number;
    isZoneRedundant: boolean;
}
  
interface FailoverPoliciesEntity {
    id: string;
    locationName: string;
    failoverPriority: number;
}
  
interface IpRulesEntity {
    ipAddressOrRange: string;
}
  
interface BackupPolicy {
    type: string;
}
 
  