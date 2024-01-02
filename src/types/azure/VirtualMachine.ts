import { AzureBase } from "./AzureBase";

export interface VirtualMachine extends AzureBase {
  ResourceId: string;
  Id: string;
  Identity?: Identity;
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
  ETag?: null;
  PrivateIpAddress?: string;
  }

interface Identity {
  PrincipalId?: null;
  TenantId?: null;
  Type: string;
  UserAssignedIdentities?: null;
}

interface Properties {
    hardwareProfile: HardwareProfile;
    provisioningState: string;
    vmId: string;
    storageProfile: StorageProfile;
    osProfile: OsProfile;
    networkProfile: NetworkProfile;
    diagnosticsProfile?: DiagnosticsProfile;
    timeCreated?: string;
  }
interface HardwareProfile {
    vmSize: string;
  }
interface StorageProfile {
    imageReference: ImageReference;
    osDisk: OsDisk;
    dataDisks?: (DataDisksEntity)[] | null;
  }
interface ImageReference {
    publisher: string;
    offer: string;
    sku: string;
    version: string;
    exactVersion: string;
  }
interface OsDisk {
    osType: string;
    name: string;
    createOption: string;
    caching: string;
    managedDisk: ManagedDisk;
    diskSizeGB: number;
  }
interface ManagedDisk {
    storageAccountType: string;
    id: string;
  }
interface DataDisksEntity {
    lun: number;
    name: string;
    createOption: string;
    caching: string;
    managedDisk: ManagedDisk;
    diskSizeGB: number;
    toBeDetached: boolean;
  }
interface OsProfile {
    computerName: string;
    adminUsername: string;
    linuxConfiguration: LinuxConfiguration;
    secrets?: (null)[] | null;
    allowExtensionOperations: boolean;
  }
interface LinuxConfiguration {
    disablePasswordAuthentication: boolean;
    ssh?: Ssh;
    provisionVMAgent: boolean;
    patchSettings: PatchSettings;
    enableVMAgentPlatformUpdates?: boolean;
  }
interface Ssh {
  publicKeys?: (PublicKeysEntity)[] | null;
}

interface PublicKeysEntity {
  path: string;
  keyData: string;
}

interface PatchSettings {
    patchMode: string;
    assessmentMode: string;
  }
interface NetworkProfile {
    networkInterfaces?: (NetworkInterfacesEntity)[] | null;
  }
interface NetworkInterfacesEntity {
    id: string;
    properties?: Properties1;
  }
 interface Properties1 {
    primary: boolean;
    deleteOption: string;
  }
interface DiagnosticsProfile {
    bootDiagnostics: BootDiagnostics;
  }
interface BootDiagnostics {
    enabled: boolean;
  }

  