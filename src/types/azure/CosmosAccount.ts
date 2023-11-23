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
    TagsTable?: null;
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
    virtualNetworkRules?: (null)[] | null;
    privateEndpointConnections?: (PrivateEndpointConnectionsEntity)[] | null;
    EnabledApiTypes: string;
    disableKeyBasedMetadataWriteAccess: boolean;
    enableFreeTier: boolean;
    enableAnalyticalStorage: boolean;
    analyticalStorageConfiguration: AnalyticalStorageConfiguration;
    instanceId: string;
    databaseAccountOfferType: string;
    defaultIdentity: string;
    networkAclBypass: string;
    disableLocalAuth: boolean;
    enablePartitionMerge: boolean;
    enableBurstCapacity: boolean;
    minimalTlsVersion: string;
    consistencyPolicy: ConsistencyPolicy;
    configurationOverrides: ConfigurationOverridesOrTags;
    writeLocations?: (WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity)[] | null;
    readLocations?: (WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity)[] | null;
    locations?: (WriteLocationsEntityOrReadLocationsEntityOrLocationsEntity)[] | null;
    failoverPolicies?: (FailoverPoliciesEntity)[] | null;
    cors?: (null)[] | null;
    capabilities?: (null)[] | null;
    ipRules?: (null)[] | null;
    backupPolicy: BackupPolicy;
    networkAclBypassResourceIds?: (null)[] | null;
    keysMetadata: KeysMetadata;
  }
interface PrivateEndpointConnectionsEntity {
    id: string;
    properties: Properties1;
  }
interface Properties1 {
    privateEndpoint: PrivateEndpoint;
    privateLinkServiceConnectionState: PrivateLinkServiceConnectionState;
  }
interface PrivateEndpoint {
    id: string;
  }
interface PrivateLinkServiceConnectionState {
    status: string;
    actionsRequired: string;
  }
interface AnalyticalStorageConfiguration {
    schemaType: string;
  }
interface ConsistencyPolicy {
    defaultConsistencyLevel: string;
    maxIntervalInSeconds: number;
    maxStalenessPrefix: number;
  }
interface ConfigurationOverridesOrTags {
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
interface BackupPolicy {
    type: string;
    periodicModeProperties: PeriodicModeProperties;
  }
interface PeriodicModeProperties {
    backupIntervalInMinutes: number;
    backupRetentionIntervalInHours: number;
    backupStorageRedundancy: string;
  }
interface KeysMetadata {
    primaryMasterKey: PrimaryMasterKeyOrSecondaryMasterKeyOrPrimaryReadonlyMasterKeyOrSecondaryReadonlyMasterKey;
    secondaryMasterKey: PrimaryMasterKeyOrSecondaryMasterKeyOrPrimaryReadonlyMasterKeyOrSecondaryReadonlyMasterKey;
    primaryReadonlyMasterKey: PrimaryMasterKeyOrSecondaryMasterKeyOrPrimaryReadonlyMasterKeyOrSecondaryReadonlyMasterKey;
    secondaryReadonlyMasterKey: PrimaryMasterKeyOrSecondaryMasterKeyOrPrimaryReadonlyMasterKeyOrSecondaryReadonlyMasterKey;
  }
  interface PrimaryMasterKeyOrSecondaryMasterKeyOrPrimaryReadonlyMasterKeyOrSecondaryReadonlyMasterKey {
    generationTime: string;
  }
  