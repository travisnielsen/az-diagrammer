import { TypeFlags } from "typescript";
import { AzureBase } from "./AzureBase";

export interface RouteTable extends AzureBase {
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
    ExtensionResourceinterface?: null;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}

interface Properties {
    provisioningState: string;
    resourceGuid: string;
    disableBgpRoutePropagation: boolean;
    routes?: (RoutesEntity)[] | null;
    subnets?: (SubnetsEntity)[] | null;
}
  
interface RoutesEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties1;
    TypeFlags: string;
}
  
interface Properties1 {
    provisioningState: string;
    addressPrefix: string;
    nextHopType: string;
    nextHopIpAddress: string;
    hasBgpOverride: boolean;
}

interface SubnetsEntity {
    id: string;
}

  