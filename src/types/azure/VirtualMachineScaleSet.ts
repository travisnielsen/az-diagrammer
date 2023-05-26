import { Tags } from "./Tags";

export type VirtualMachineScaleSet = {
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
    Sku: Sku;
    Tags: Tags;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag?: null;
  }

export type Identity = {
    PrincipalId: string;
    TenantId: string;
    Type: string;
    UserAssignedIdentities?: null;
}

export type Properties = {
    singlePlacementGroup: boolean;
    orchestrationMode: string;
    upgradePolicy: UpgradePolicy;
    virtualMachineProfile: VirtualMachineProfile;
    provisioningState: string;
    overprovision: boolean;
    doNotRunExtensionsOnOverprovisionedVMs: boolean;
    uniqueId: string;
    timeCreated: string;
}

export type UpgradePolicy = {
    mode: string;
}

export type VirtualMachineProfile = {
    osProfile: OsProfile;
    storageProfile: StorageProfile;
    networkProfile: NetworkProfile;
    diagnosticsProfile: DiagnosticsProfile;
    extensionProfile: ExtensionProfile;
}

export type OsProfile = {
    computerNamePrefix: string;
    adminUsername: string;
    linuxConfiguration: LinuxConfiguration;
    secrets?: (null)[] | null;
    allowExtensionOperations: boolean;
    requireGuestProvisionSignal: boolean;
}

export type LinuxConfiguration = {
    disablePasswordAuthentication: boolean;
    provisionVMAgent: boolean;
}

export type StorageProfile = {
    osDisk: OsDisk;
    imageReference: ImageReference;
}

export type OsDisk = {
    osType: string;
    createOption: string;
    caching: string;
    managedDisk: ManagedDisk;
    diskSizeGB: number;
}

export type ManagedDisk = {
    storageAccountType: string;
}

export type ImageReference = {
    publisher: string;
    offer: string;
    sku: string;
    version: string;
}

export type NetworkProfile = {
    networktypeConfigurations?: (NetworktypeConfigurationsEntity)[] | null;
}

export type NetworktypeConfigurationsEntity = {
    name: string;
    properties: Properties1;
}

export type Properties1 = {
    primary: boolean;
    enableAcceleratedNetworking: boolean;
    dnsSettings: DnsSettings;
    enableIPForwarding: boolean;
    ipConfigurations?: (IpConfigurationsEntity)[] | null;
}

export type DnsSettings = {
    dnsServers?: (null)[] | null;
}

export type IpConfigurationsEntity = {
    name: string;
    properties: Properties2;
}

export type Properties2 = {
    subnet: LoadBalancerBackendAddressPoolsEntityOrSubnet;
    privateIPAddressVersion: string;
    loadBalancerBackendAddressPools?: (LoadBalancerBackendAddressPoolsEntityOrSubnet)[] | null;
}

export type LoadBalancerBackendAddressPoolsEntityOrSubnet = {
    id: string;
}

export type DiagnosticsProfile = {
    bootDiagnostics: BootDiagnostics;
}

export type BootDiagnostics = {
    enabled: boolean;
    storageUri: string;
}

export type ExtensionProfile = {
    extensions?: (ExtensionsEntity)[] | null;
}

export type ExtensionsEntity = {
    name: string;
    properties: Properties3;
}

export type Properties3 = {
    autoUpgradeMinorVersion: boolean;
    publisher: string;
    type: string;
    typeHandlerVersion: string;
    settings: Settings;
    provisionAfterExtensions?: (string)[] | null;
}

export type Settings = {
    chef_daemon_interval?: string | null;
    autoUpgradeMinorVersion?: boolean | null;
    daemon?: string | null;
    custom_json_attr?: CustomJsonAttr | null;
    bootstrap_options?: BootstrapOptions | null;
    CHEF_LICENSE?: string | null;
    runlist?: string | null;
    validation_key_format?: string | null;
}

export type CustomJsonAttr = {
    tags?: (string)[] | null;
}

export type BootstrapOptions = {
    chef_server_url: string;
    node_ssl_verify_mode: string;
    node_verify_api_cert: string;
    environment: string;
    validation_client_name: string;

}

export type Sku = {
    Name: string;
    Tier: string;
    Size?: null;
    Family?: null;
    Model?: null;
    Capacity: number;
}