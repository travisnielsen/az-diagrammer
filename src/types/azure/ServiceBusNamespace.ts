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
    TagsTable?: null;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag?: null;
  }
interface Properties {
    disableLocalAuth: boolean;
    zoneRedundant: boolean;
    privateEndpointConnections?: (PrivateEndpointConnectionsEntity)[] | null;
    provisioningState: string;
    metricId: string;
    createdAt: string;
    updatedAt: string;
    serviceBusEndpoint: string;
    status: string;
  }
interface PrivateEndpointConnectionsEntity {
    id: string;
    name: string;
    type: string;
    location: string;
    properties: Properties1;
  }
interface Properties1 {
    provisioningState: string;
    privateEndpoint: PrivateEndpoint;
    privateLinkServiceConnectionState: PrivateLinkServiceConnectionState;
    groupIds?: (string)[] | null;
  }
  export interface PrivateEndpoint {
    id: string;
  }
interface PrivateLinkServiceConnectionState {
    status: string;
    description: string;
  }
