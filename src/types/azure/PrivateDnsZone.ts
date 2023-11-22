import { AzureBase } from "./AzureBase";


export interface PrivateDnsZone extends AzureBase {
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
    TagsTable?: null;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
  }
  interface Properties {
    internalId: string;
    maxNumberOfRecordSets: number;
    maxNumberOfVirtualNetworkLinks: number;
    maxNumberOfVirtualNetworkLinksWithRegistration: number;
    numberOfRecordSets: number;
    numberOfVirtualNetworkLinks: number;
    numberOfVirtualNetworkLinksWithRegistration: number;
    provisioningState: string;
  }
  