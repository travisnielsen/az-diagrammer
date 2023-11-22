import { AzureBase } from "./AzureBase";

export interface KeyVault extends AzureBase {
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
    sku: Sku;
    tenantId: string;
    networkAcls: NetworkAcls;
    privateEndpointConnections?: (PrivateEndpointConnection)[] | null;
    accessPolicies?: (null)[] | null;
    enabledForDeployment: boolean;
    enableSoftDelete: boolean;
    enableRbacAuthorization: boolean;
    vaultUri: string;
    provisioningState: string;
    publicNetworkAccess: string;
  }
  export interface Sku {
    family: string;
    name: string;
  }
  export interface NetworkAcls {
    bypass: string;
    defaultAction: string;
    ipRules?: (null)[] | null;
    virtualNetworkRules?: (null)[] | null;
  }
  export interface PrivateEndpointConnection {
    id: string;
    properties: PrivateEndpointConnectionProperties;
  }
  interface PrivateEndpointConnectionProperties {
    provisioningState: string;
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