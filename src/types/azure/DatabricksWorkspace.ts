import { AzureBase } from "./AzureBase";

export interface DatabricksWorkspace extends AzureBase {
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
    ETag?: null;
}
  
interface Properties {
    managedResourceGroupId: string;
    parameters: Parameters;
    provisioningState: string;
    authorizations?: (AuthorizationsEntity)[] | null;
    createdBy: CreatedByOrUpdatedBy;
    updatedBy: CreatedByOrUpdatedBy;
    workspaceId: string;
    workspaceUrl: string;
    createdDateTime: string;
}
  
interface Parameters {
    customPrivateSubnetName: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    customPublicSubnetName: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    customVirtualNetworkId: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    enableFedRampCertification: EnableFedRampCertificationOrEnableNoPublicIpOrPrepareEncryptionOrRequireInfrastructureEncryption;
    enableNoPublicIp: EnableFedRampCertificationOrEnableNoPublicIpOrPrepareEncryptionOrRequireInfrastructureEncryption;
    natGatewayName: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    prepareEncryption: EnableFedRampCertificationOrEnableNoPublicIpOrPrepareEncryptionOrRequireInfrastructureEncryption;
    publicIpName: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    requireInfrastructureEncryption: EnableFedRampCertificationOrEnableNoPublicIpOrPrepareEncryptionOrRequireInfrastructureEncryption;
    resourceTags: ResourceTags;
    storageAccountName: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    storageAccountSkuName: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
    vnetAddressPrefix: CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix;
}
  
interface CustomPrivateSubnetNameOrCustomPublicSubnetNameOrCustomVirtualNetworkIdOrNatGatewayNameOrPublicIpNameOrStorageAccountNameOrStorageAccountSkuNameOrVnetAddressPrefix {
    type: string;
    value: string;
}

interface EnableFedRampCertificationOrEnableNoPublicIpOrPrepareEncryptionOrRequireInfrastructureEncryption {
    type: string;
    value: boolean;
}
  
interface ResourceTags {
    type: string;
    value: { [key: string]: string; };
}
  
interface AuthorizationsEntity {
    principalId: string;
    roleDefinitionId: string;
}
  
interface CreatedByOrUpdatedBy {
    oid: string;
    applicationId: string;
}
