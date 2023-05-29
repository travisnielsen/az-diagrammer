import { AzureBase } from "./AzureBase";

export interface PrivateEndpoint extends AzureBase {
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
    ETag: string;
}
  
 interface Properties {
    provisioningState: string;
    resourceGuid: string;
    privateLinkServiceConnections?: (null)[] | null;
    manualPrivateLinkServiceConnections?: (ManualPrivateLinkServiceConnectionsEntity)[] | null;
    customNetworkInterfaceName: string;
    subnet: NetworkInterfacesEntityOrSubnet;
    ipConfigurations?: (null)[] | null;
    networkInterfaces?: (NetworkInterfacesEntityOrSubnet)[] | null;
    customDnsConfigs?: (null)[] | null;
}
  
interface ManualPrivateLinkServiceConnectionsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties1;
    type: string;
}
  
 interface Properties1 {
    provisioningState: string;
    privateLinkServiceId: string;
    groupIds?: (null)[] | null;
    requestMessage: string;
    privateLinkServiceConnectionState: PrivateLinkServiceConnectionState;
}
  
interface PrivateLinkServiceConnectionState {
    status: string;
    description: string;
    actionsRequired: string;
}
  
interface NetworkInterfacesEntityOrSubnet {
    id: string;
}
  
