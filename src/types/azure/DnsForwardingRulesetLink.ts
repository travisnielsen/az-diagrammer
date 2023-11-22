import { AzureBase } from "./AzureBase";

export interface DnsForwardingRulesetLink extends AzureBase {
    Etag: string;
    Id: string;
    Metadata?: object | null;
    Name: string;
    ProvisioningState?: object | null;
    SystemDataCreatedAt: string;
    SystemDataCreatedBy?: null;
    SystemDataCreatedByType?: object | null ;
    SystemDataLastModifiedAt: string;
    SystemDataLastModifiedBy?: null;
    SystemDataLastModifiedByType?: object | null;
    Type: string;
    VirtualNetworkId: string;  
}
