import { AzureBase } from "./AzureBase";

export interface NetworkRuleSet extends AzureBase {
    DefaultAction: {};
    IPRule?: (IPRuleEntity)[] | null;
    Id: string;
    Location: string;
    Name: string;
    PublicNetworkAccess: {};
    ResourceGroupName: string;
    SystemDataCreatedAt?: string | null;
    SystemDataCreatedBy?: string | null;
    SystemDataCreatedByType?: string | null;
    SystemDataLastModifiedAt?: string | null;
    SystemDataLastModifiedBy?: string | null;
    SystemDataLastModifiedByType?: string | null;
    TrustedServiceAccessEnabled: boolean;
    Type: string;
    VirtualNetworkRule: (VirtualNetworkRuleEntity)[];
}

interface IPRuleEntity {
    Action: {};
    IPMask: string;
}
  
interface VirtualNetworkRuleEntity {
    IgnoreMissingVnetServiceEndpoint: boolean;
    SubnetId: string;
}
