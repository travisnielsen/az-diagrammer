import { AzureBase } from "./AzureBase";

export interface DnsResolver extends AzureBase {
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
  export interface Properties {
    virtualNetwork: VirtualNetwork;
    dnsResolverState: string;
    provisioningState: string;
    resourceGuid: string;
  }
  export interface VirtualNetwork {
    id: string;
  }
  