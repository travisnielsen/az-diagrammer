import { AzureBase } from "./AzureBase";

export interface ServiceBusNamespace extends AzureBase {
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
    disableLocalAuth: boolean;
    zoneRedundant: boolean;
    provisioningState: string;
    metricId: string;
    createdAt: string;
    updatedAt: string;
    serviceBusEndpoint: string;
    status: string;
}