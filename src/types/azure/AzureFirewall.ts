import { AzureBase } from "./AzureBase";

export interface AzureFirewall extends AzureBase {
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
    sku: { [key: string]: string; };
    threatIntelMode: string;
    additionalProperties: AdditionalProperties;
    ipConfigurations: (IpConfigurationsEntity)[];
    networkRuleCollections?: (NetworkRuleCollectionsEntity)[] | null;
    applicationRuleCollections?: (ApplicationRuleCollectionsEntity)[] | null;
    natRuleCollections?: (null)[] | null; 
}

interface AdditionalProperties {
    "Network.SNAT.PrivateRanges": string;
}

interface IpConfigurationsEntity {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: Properties1;
}


interface Properties1 {
    provisioningState: string;
    privateIPAddress: string;
    privateIPAllocationMethod: string;
    publicIPAddress: PublicIPAddressOrSubnet;
    subnet: PublicIPAddressOrSubnet;
}


interface PublicIPAddressOrSubnet {
    id: string;
}

interface NetworkRuleCollectionsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties2;
    type: string;
}
  
interface Properties2 {
    provisioningState: string;
    priority: number;
    action: Action;
    rules?: (RulesEntity)[] | null;
}
  
interface Action {
    type: string;
}
  
interface RulesEntity {
    name: string;
    protocols?: (string)[] | null;
    sourceAddresses?: (string | null)[] | null;
    destinationAddresses?: (string | null)[] | null;
    sourceIpGroups?: (string | null)[] | null;
    destinationIpGroups?: (string | null)[] | null;
    destinationFqdns?: (null)[] | null;
    destinationPorts?: (string)[] | null;
}

interface ApplicationRuleCollectionsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties3;
    type: string;
}

interface Properties3 {
    provisioningState: string;
    priority: number;
    action: Action;
    rules?: (RulesEntity1)[] | null;
}
  
interface RulesEntity1 {
    name: string;
    priority: number;
    direction: string;
    protocols?: (ProtocolsEntity)[] | null;
    fqdnTags?: (string | null)[] | null;
    targetFqdns?: (string | null)[] | null;
    actions?: (null)[] | null;
    sourceAddresses?: (string)[] | null;
    sourceIpGroups?: (null)[] | null;
}
  
interface ProtocolsEntity {
    protocolType: string;
    port: number;
}
