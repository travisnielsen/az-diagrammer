import { Tags } from "./Tags";

export type NetworkSecurityGroup = {
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
  securityRules?: (SecurityRulesEntity)[] | null;
  defaultSecurityRules?: (DefaultSecurityRulesEntity)[] | null;
  subnets?: (SubnetsEntity)[] | null;
}

export type SecurityRulesEntity = {
  name: string;
  id: string;
  etag: string;
  type: string;
  properties: Properties1;
}
  
export type Properties1 = {
  provisioningState: string;
  description?: string | null;
  protocol: string;
  sourcePortRange: string;
  destinationPortRange?: string | null;
  sourceAddressPrefix?: string | null;
  destinationAddressPrefix?: string | null;
  access: string;
  priority: number;
  direction: string;
  sourcePortRanges?: (null)[] | null;
  destinationPortRanges?: (string | null)[] | null;
  sourceAddressPrefixes?: (string | null)[] | null;
  destinationAddressPrefixes?: (string | null)[] | null;
}

export type DefaultSecurityRulesEntity = {
  name: string;
  id: string;
  etag: string;
  type: string;
  properties: Properties2;
}
  
 export type Properties2 = {
  provisioningState: string;
  description: string;
  protocol: string;
  sourcePortRange: string;
  destinationPortRange: string;
  sourceAddressPrefix: string;
  destinationAddressPrefix: string;
  access: string;
  priority: number;
  direction: string;
  sourcePortRanges?: (null)[] | null;
  destinationPortRanges?: (null)[] | null;
  sourceAddressPrefixes?: (null)[] | null;
  destinationAddressPrefixes?: (null)[] | null;
}
  
export type SubnetsEntity = {
  id: string;
}
  