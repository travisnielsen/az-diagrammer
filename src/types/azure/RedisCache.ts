
import { AzureBase } from "./AzureBase";

export interface RedisCache extends AzureBase {
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
    ETag?: null;
}
 
interface Properties {
    provisioningState: string;
    redisVersion: string;
    sku: Sku;
    enableNonSslPort: boolean;
    instances?: (InstancesEntity)[] | null;
    minimumTlsVersion: string;
    publicNetworkAccess: string;
    tenantSettings: TenantSettings;
    redisConfiguration: RedisConfiguration;
    accessKeys?: null;
    hostName: string;
    port: number;
    sslPort: number;
    subnetId: string;
    staticIP: string;
    shardCount: number;
    linkedServers?: (null)[] | null;
}

interface Sku {
    name: string;
    family: string;
    capacity: number;
}
 
interface InstancesEntity {
    sslPort: number;
    shardId: number;
    isMaster: boolean;
    isPrimary: boolean;
}
  
interface TenantSettings {
}
  
interface RedisConfiguration {
    maxclients: string;
    "maxmemory-reserved": string;
    "maxfragmentationmemory-reserved": string;
    "maxmemory-delta": string;
}
