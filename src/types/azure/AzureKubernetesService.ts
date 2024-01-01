import { AzureBase } from "./AzureBase";

export interface AzureKubernetesService extends AzureBase {
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
    TagsTable?: null;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag?: null;
}

interface Identity {
    PrincipalId?: null;
    TenantId?: null;
    Type: string;
    UserAssignedIdentities?: null;
}

interface Properties {
    provisioningState: string;
    powerState: PowerState;
    kubernetesVersion: string;
    currentKubernetesVersion: string;
    dnsPrefix: string;
    fqdn: string;
    azurePortalFQDN: string;
    agentPoolProfiles?: (AgentPoolProfilesEntity)[] | null;
    linuxProfile: LinuxProfile;
    windowsProfile: WindowsProfile;
    servicePrincipalProfile: ServicePrincipalProfile;
    nodeResourceGroup: string;
    enableRBAC: boolean;
    supportPlan: string;
    networkProfile: NetworkProfile;
    maxAgentPools: number;
    identityProfile: IdentityProfile;
    autoScalerProfile: AutoScalerProfile;
    autoUpgradeProfile: AutoUpgradeProfile;
    securityProfile: SecurityProfileOrWorkloadAutoScalerProfile;
    storageProfile: StorageProfile;
    oidcIssuerProfile: DiskCSIDriverOrFileCSIDriverOrSnapshotControllerOrOidcIssuerProfile;
    workloadAutoScalerProfile: SecurityProfileOrWorkloadAutoScalerProfile;
    resourceUID: string;
}

interface PowerState {
    code: string;
}

interface AgentPoolProfilesEntity {
    name: string;
    count: number;
    vmSize: string;
    osDiskSizeGB: number;
    osDiskType: string;
    kubeletDiskType: string;
    vnetSubnetID: string;
    maxPods: number;
    type: string;
    maxCount: number;
    minCount: number;
    enableAutoScaling: boolean;
    provisioningState: string;
    powerState: PowerState;
    orchestratorVersion: string;
    currentOrchestratorVersion: string;
    enableNodePublicIP: boolean;
    mode: string;
    osType: string;
    osSKU: string;
    nodeImageVersion: string;
    enableFIPS: boolean;
}

interface LinuxProfile {
    adminUsername: string;
    ssh: Ssh;
}

interface Ssh {
    publicKeys?: (PublicKeysEntity)[] | null;
}

interface PublicKeysEntity {
    keyData: string;
}

interface WindowsProfile {
    adminUsername: string;
    enableCSIProxy: boolean;
}

interface ServicePrincipalProfile {
    clientId: string;
}

interface NetworkProfile {
    networkPlugin: string;
    networkPolicy: string;
    networkDataplane: string;
    loadBalancerSku: string;
    loadBalancerProfile: LoadBalancerProfile;
    serviceCidr: string;
    dnsServiceIP: string;
    outboundType: string;
    serviceCidrs?: (string)[] | null;
    ipFamilies?: (string)[] | null;
}

interface LoadBalancerProfile {
    managedOutboundIPs: ManagedOutboundIPs;
    effectiveOutboundIPs?: (EffectiveOutboundIPsEntity)[] | null;
}

interface ManagedOutboundIPs {
    count: number;
}

interface EffectiveOutboundIPsEntity {
    id: string;
}

interface IdentityProfile {
    kubeletidentity: Kubeletidentity;
}

interface Kubeletidentity {
    resourceId: string;
    clientId: string;
    objectId: string;
}

interface AutoScalerProfile {
    'balance-similar-node-groups': string;
    'expander': string;
    'max-empty-bulk-delete': string;
    'max-graceful-termination-sec': string;
    'max-node-provision-time': string;
    'max-total-unready-percentage': string;
    'new-pod-scale-up-delay': string;
    'ok-total-unready-count': string;
    'scale-down-delay-after-add': string;
    'scale-down-delay-after-delete': string;
    'scale-down-delay-after-failure': string;
    'scale-down-unneeded-time': string;
    'scale-down-unready-time': string;
    'scale-down-utilization-threshold': string;
    'scan-interval': string;
    'skip-nodes-with-local-storage': string;
    'skip-nodes-with-system-pods': string;
}

interface AutoUpgradeProfile {
    nodeOSUpgradeChannel: string;
}

interface SecurityProfileOrWorkloadAutoScalerProfile {
}

interface StorageProfile {
    diskCSIDriver: DiskCSIDriverOrFileCSIDriverOrSnapshotControllerOrOidcIssuerProfile;
    fileCSIDriver: DiskCSIDriverOrFileCSIDriverOrSnapshotControllerOrOidcIssuerProfile;
    snapshotController: DiskCSIDriverOrFileCSIDriverOrSnapshotControllerOrOidcIssuerProfile;
}

interface DiskCSIDriverOrFileCSIDriverOrSnapshotControllerOrOidcIssuerProfile {
    enabled: boolean;
}
