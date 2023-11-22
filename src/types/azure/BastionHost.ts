import { AzureBase } from "./AzureBase";

export interface BastionHost extends AzureBase {
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
    ETag: string;  
}

interface Properties {
    provisioningState: string;
    dnsName: string;
    scaleUnits: number;
    ipConfigurations?: (IpConfigurationsEntity)[] | null;
}

interface IpConfigurationsEntity {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: IpConfigurationsEntityProperties;
}

interface IpConfigurationsEntityProperties {
    provisioningState: string;
    privateIPAllocationMethod: string;
    publicIPAddress: PublicIPAddressOrSubnet;
    subnet: PublicIPAddressOrSubnet;
}

interface PublicIPAddressOrSubnet {
    id: string;
}
