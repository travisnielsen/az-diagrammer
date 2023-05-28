import { AzureBase } from "./AzureBase";

export interface NetworkSecurityGroup extends AzureBase {
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
  securityRules?: (SecurityRulesEntity)[] | null;
  defaultSecurityRules?: (DefaultSecurityRulesEntity)[] | null;
  subnets?: (SubnetsEntity)[] | null;
}

interface SecurityRulesEntity {
  name: string;
  id: string;
  etag: string;
  type: string;
  properties: Properties1;
}
  
interface Properties1 {
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

interface DefaultSecurityRulesEntity {
  name: string;
  id: string;
  etag: string;
  type: string;
  properties: Properties2;
}
  
 interface Properties2 {
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
  
interface SubnetsEntity {
  id: string;
}
  