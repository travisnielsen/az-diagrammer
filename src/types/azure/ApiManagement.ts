import { AzureBase } from "./AzureBase";

export interface ApiManagement extends AzureBase {
    ResourceId: string;
    Id: string;
    Identity: Identity;
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
  
export interface Identity {
    PrincipalId: string;
    TenantId: string;
    Type: string;
    UserAssignedIdentities?: null;
}

export interface Properties {
    publisherEmail: string;
    publisherName: string;
    notificationSenderEmail: string;
    provisioningState: string;
    targetProvisioningState: string;
    createdAtUtc: string;
    gatewayUrl: string;
    gatewayRegionalUrl: string;
    portalUrl: string;
    developerPortalUrl: string;
    managementApiUrl: string;
    scmUrl: string;
    hostnameConfigurations?: (HostnameConfigurationsEntity)[] | null;
    publicIPAddresses?: (string)[] | null;
    privateIPAddresses?: (string)[] | null;
    additionalLocations?: null;
    virtualNetworkConfiguration: VirtualNetworkConfiguration;
    customProperties: CustomProperties;
    virtualNetworkType: string;
    certificates?: (CertificatesEntity)[] | null;
    natGatewayState: string;
    outboundPublicIPAddresses?: (string)[] | null;
    apiVersionConstraint: ApiVersionConstraint;
    publicIpAddressId?: null;
    publicNetworkAccess: string;
    privateEndpointConnections?: null;
    platformVersion: string;
}
  
export interface HostnameConfigurationsEntity {
    type: string;
    hostName: string;
    encodedCertificate?: null;
    keyVaultId?: null;
    certificatePassword?: null;
    negotiateClientCertificate: boolean;
    certificate?: Certificate | null;
    defaultSslBinding: boolean;
    identityClientId?: null;
    certificateSource: string;
    certificateStatus?: null;
}
  
export interface Certificate {
    expiry: string;
    thumbprint: string;
    subject: string;
}

export interface VirtualNetworkConfiguration {
    subnetResourceId: string;
    vnetid: string;
    subnetname?: null;
}
  
  export interface CustomProperties {
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Tls10": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Tls11": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Ssl30": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Ciphers.TripleDes168": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls10": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls11": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Ssl30": string;
    "Microsoft.WindowsAzure.ApiManagement.Gateway.Protocols.Server.Http2": string;
}
  
export interface CertificatesEntity {
    encodedCertificate?: null;
    certificatePassword?: null;
    storeName: string;
    certificate: Certificate1;  
}

export interface Certificate1 {
    expiry: string;
    thumbprint: string;
    subject: string;
}
  
export interface ApiVersionConstraint {
    minApiVersion?: null;
}
