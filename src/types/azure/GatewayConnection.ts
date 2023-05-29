import { AzureBase } from "./AzureBase";

export interface GatewayConnection extends AzureBase {
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
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag: string;
}
  
interface Properties {
    provisioningState: string;
    resourceGuid: string;
    packetCaptureDiagnosticState: string;
    virtualNetworkGateway1: { id: string};
    localNetworkGateway2: { id: string};
    connectionType: string;
    connectionProtocol: string;
    routingWeight: number;
    sharedKey: string;
    enableBgp: boolean;
    useLocalAzureIpAddress: boolean;
    usePolicyBasedTrafficSelectors: boolean;
    ipsecPolicies?: (null)[] | null;
    trafficSelectorPolicies?: (null)[] | null;
    ingressBytesTransferred: number;
    egressBytesTransferred: number;
    expressRouteGatewayBypass: boolean;
    enablePrivateLinkFastPath: boolean;
    dpdTimeoutSeconds: number;
    connectionMode: string;
    gatewayCustomBgpIpAddresses?: (null)[] | null;
    peer: { id: string; };
}
