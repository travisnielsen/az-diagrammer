import { Tags } from "./Tags";

export type RouteTable = {
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
    Sku?: null;
    Tags: Tags;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}

export type Properties = {
    provisioningState: string;
    resourceGuid: string;
    disableBgpRoutePropagation: boolean;
    routes?: (RoutesEntity)[] | null;
    subnets?: (SubnetsEntity)[] | null;
}
  
export type RoutesEntity = {
    name: string;
    id: string;
    etag: string;
    properties: Properties1;
    type: string;
}
  
  export type Properties1 = {
    provisioningState: string;
    addressPrefix: string;
    nextHopType: string;
    nextHopIpAddress: string;
    hasBgpOverride: boolean;
}

export type SubnetsEntity = {
    id: string;
}

  