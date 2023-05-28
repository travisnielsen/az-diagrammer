import { AzureBase } from "./AzureBase";

export interface EventHubCluster extends AzureBase {
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
    createdAt: string;
    updatedAt: string;
    provisioningState: string;
    status: string;
    supportsScaling: boolean;
    metricId: string;
}
  

  