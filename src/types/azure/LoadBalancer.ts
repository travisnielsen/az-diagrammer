import { AzureBase } from "./AzureBase";

export interface LoadBalancer extends AzureBase {
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
    ETag: string;
}
  
interface Properties {
    provisioningState: string;
    resourceGuid: string;
    frontendIPConfigurations?: (FrontendIPConfigurationsEntity)[] | null;
    backendAddressPools?: (BackendAddressPoolsEntity)[] | null;
    loadBalancingRules?: (LoadBalancingRulesEntity)[] | null;
    probes?: (ProbesEntity)[] | null;
    inboundNatRules?: (null)[] | null;
    outboundRules?: (OutboundRulesEntity)[] | null;
    inboundNatPools?: (null)[] | null;
}
  
interface FrontendIPConfigurationsEntity {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: FrontendIPConfigProperties;
}
  
interface FrontendIPConfigProperties {
    provisioningState: string;
    privateIPAddress?: string;
    privateIPAllocationMethod: string;
    subnet?: PropertyTargetResourceId;
    loadBalancingRules?: (PropertyTargetResourceId)[] | null;
    privateIPAddressVersion?: string;
    publicIPAddress?: PropertyTargetResourceId;
    outboundRules?: (PropertyTargetResourceId)[] | null;
    zones?: (string)[];
}
  
interface PropertyTargetResourceId {
    id: string;
}
  
interface BackendAddressPoolsEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties2;
    type: string;
}
  
interface Properties2 {
    provisioningState: string;
    loadBalancerBackendAddresses?: (LoadBalancerBackendAddressesEntity)[] | null;
    outboundRules?: (PropertyTargetResourceId)[] | null;
    backendIPConfigurations?: (PropertyTargetResourceId)[] | null;
}

interface LoadBalancerBackendAddressesEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties3;
    type: string;
}

interface Properties3 {
    provisioningState: string;
    networkinterfaceIPConfiguration: PropertyTargetResourceId;
}

interface LoadBalancingRulesEntity {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: Properties4;
}

interface Properties4 {
    provisioningState: string;
    frontendIPConfiguration: PropertyTargetResourceId;
    frontendPort: number;
    backendPort: number;
    enableFloatingIP: boolean;
    idleTimeoutInMinutes: number;
    protocol: string;
    enableDestinationServiceEndpoint: boolean;
    enableTcpReset: boolean;
    allowBackendPortConflict: boolean;
    loadDistribution: string;
    disableOutboundSnat: boolean;
    backendAddressPool: PropertyTargetResourceId;
    backendAddressPools?: (PropertyTargetResourceId)[] | null;
    probe: PropertyTargetResourceId;
}
  
interface ProbesEntity {
    name: string;
    id: string;
    etag: string;
    properties: Properties5;
    type: string;
}
  
interface Properties5 {
    provisioningState: string;
    protocol: string;
    port: number;
    intervalInSeconds: number;
    numberOfProbes: number;
    probeThreshold: number;
    loadBalancingRules?: (PropertyTargetResourceId)[] | null;
}
  
interface OutboundRulesEntity {
    name: string;
    id: string;
    etag: string;
    type: string;
    properties: Properties6;
}
  
interface Properties6 {
    provisioningState: string;
    allocatedOutboundPorts: number;
    protocol: string;
    enableTcpReset: boolean;
    idleTimeoutInMinutes: number;
    allocationPolicy: AllocationPolicy;
    backendAddressPool: PropertyTargetResourceId;
    frontendIPConfigurations?: (PropertyTargetResourceId)[] | null;
}
  
interface AllocationPolicy {
    onDemandAllocation: boolean;
    portReuse: string;
}