import { AzureBase } from "./AzureBase";

export interface PublicIpAddress extends AzureBase {
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
    Sku: Sku;
    TagsTable?: null;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}
  
interface Properties {
    provisioningState: string;
    resourceGuid: string;
    ipAddress: string;
    publicIPAddressVersion: string;
    publicIPAllocationMethod: string;
    idleTimeoutInMinutes: number;
    ipTags?: (null)[] | null;
    ipConfiguration?: IpConfiguration;
}
  
interface IpConfiguration {
    id: string;  
}

interface Sku {
    Name: string;
    Tier: string;
    Size?: null;
    Family?: null;
    Model?: null;
    Capacity?: null;  
}
  