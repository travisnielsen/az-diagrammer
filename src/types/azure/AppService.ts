import { AzureBase } from "./AzureBase";

export interface AppService extends AzureBase {
    ResourceId: string;
    Id: string;
    Identity?: {
        PrincipalId: string,
        TenantId: string,
        Type: string,
        UserAssignedIdentities: null
    } | null;
    Kind: string;
    Location: string;
    ManagedBy?: null;
    ResourceName: string;
    Name: string;
    ExtensionResourceName?: string | null;
    ParentResource?: string | null;
    Plan?: string | null;
    Properties: Properties;
    ResourceGroupName: string;
    Type: string;
    ResourceType: string;
    ExtensionResourceType?: string | null;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: string | null;
    ChangedTime?: string | null;
    ETag?: string | null;
}
  
interface Properties {
    serverFarmId: string;
    name: string;
    workerSize: string;
    workerSizeId: number;
    workerTierName?: null;
    numberOfWorkers: number;
    currentWorkerSize: string;
    currentWorkerSizeId: number;
    currentNumberOfWorkers: number;
    status: string;
    webSpace: string;
    subscription: string;
    adminSiteName?: null;
    hostingEnvironment?: null;
    hostingEnvironmentProfile?: null;
    maximumNumberOfWorkers: number;
    planName: string;
    adminRuntimeSiteName?: null;
    computeMode: string;
    siteMode?: null;
    geoRegion: string;
    perSiteScaling: boolean;
    elasticScaleEnabled: boolean;
    maximumElasticWorkerCount: number;
    numberOfSites: number;
    hostingEnvironmentId?: null;
    isSpot: boolean;
    spotExpirationTime?: null;
    freeOfferExpirationTime?: null;
    tags: AzureBase["Tags"];
    kind: string;
    resourceGroup: string;
    reserved: boolean;
    isXenon: boolean;
    hyperV: boolean;
    mdmId: string;
    targetWorkerCount: number;
    targetWorkerSizeId: number;
    provisioningState: string;
    webSiteId?: null;
    existingServerFarmIds?: null;
    kubeEnvironmentProfile?: null;
    zoneRedundant: boolean;
    sku: string | null;
    virtualNetworkSubnetId?: string | null;
}
  

  