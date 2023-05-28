import { AzureBase } from "./AzureBase";

export interface VirtualMachineScaleSet extends AzureBase {
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
    Resourceinterface: string;
    ExtensionResourceinterface?: null;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag?: null;
  }

interface Identity {
    PrincipalId: string;
    TenantId: string;
    interface: string;
    UserAssignedIdentities?: null;
}

interface Properties {
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

interface UpgradePolicy {
    mode: string;
}

interface VirtualMachineProfile {
    osProfile: OsProfile;
    storageProfile: StorageProfile;
    networkProfile: NetworkProfile;
    diagnosticsProfile: DiagnosticsProfile;
    extensionProfile: ExtensionProfile;
}

interface OsProfile {
    computerNamePrefix: string;
    adminUsername: string;
    linuxConfiguration: LinuxConfiguration;
    secrets?: (null)[] | null;
    allowExtensionOperations: boolean;
    requireGuestProvisionSignal: boolean;
}

interface LinuxConfiguration {
    disablePasswordAuthentication: boolean;
    provisionVMAgent: boolean;
}

interface StorageProfile {
    osDisk: OsDisk;
    imageReference: ImageReference;
}

interface OsDisk {
    osinterface: string;
    createOption: string;
    caching: string;
    managedDisk: ManagedDisk;
    diskSizeGB: number;
}

interface ManagedDisk {
    storageAccountinterface: string;
}

interface ImageReference {
    publisher: string;
    offer: string;
    sku: string;
    version: string;
}

interface NetworkProfile {
    networkinterfaceConfigurations?: (NetworkinterfaceConfigurationsEntity)[] | null;
}

interface NetworkinterfaceConfigurationsEntity {
    name: string;
    properties: Properties1;
}

interface Properties1 {
    primary: boolean;
    enableAcceleratedNetworking: boolean;
    dnsSettings: DnsSettings;
    enableIPForwarding: boolean;
    ipConfigurations?: (IpConfigurationsEntity)[] | null;
}

interface DnsSettings {
    dnsServers?: (null)[] | null;
}

interface IpConfigurationsEntity {
    name: string;
    properties: Properties2;
}

interface Properties2 {
    subnet: LoadBalancerBackendAddressPoolsEntityOrSubnet;
    privateIPAddressVersion: string;
    loadBalancerBackendAddressPools?: (LoadBalancerBackendAddressPoolsEntityOrSubnet)[] | null;
}

interface LoadBalancerBackendAddressPoolsEntityOrSubnet {
    id: string;
}

interface DiagnosticsProfile {
    bootDiagnostics: BootDiagnostics;
}

interface BootDiagnostics {
    enabled: boolean;
    storageUri: string;
}

interface ExtensionProfile {
    extensions?: (ExtensionsEntity)[] | null;
}

interface ExtensionsEntity {
    name: string;
    properties: Properties3;
}

interface Properties3 {
    autoUpgradeMinorVersion: boolean;
    publisher: string;
    interface: string;
    interfaceHandlerVersion: string;
    settings: Settings;
    provisionAfterExtensions?: (string)[] | null;
}

interface Settings {
    chef_daemon_interval?: string | null;
    autoUpgradeMinorVersion?: boolean | null;
    daemon?: string | null;
    custom_json_attr?: CustomJsonAttr | null;
    bootstrap_options?: BootstrapOptions | null;
    CHEF_LICENSE?: string | null;
    runlist?: string | null;
    validation_key_format?: string | null;
}

interface CustomJsonAttr {
    tags?: (string)[] | null;
}

interface BootstrapOptions {
    chef_server_url: string;
    node_ssl_verify_mode: string;
    node_verify_api_cert: string;
    environment: string;
    validation_client_name: string;

}