import { AzureBase } from "./AzureBase";


 export interface ContainerRegistry extends AzureBase {
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
    ETag?: null;
  }
   interface Properties {
    loginServer: string;
    creationDate: string;
    provisioningState: string;
    adminUserEnabled: boolean;
    networkRuleSet: NetworkRuleSet;
    policies: Policies;
    encryption: QuarantinePolicyOrPolicyOrAzureADAuthenticationAsArmPolicyOrEncryption;
    dataEndpointEnabled: boolean;
    dataEndpointHostNames?: (string)[] | null;
    privateEndpointConnections?: (PrivateEndpointConnectionsEntity)[] | null;
    publicNetworkAccess: string;
    networkRuleBypassOptions: string;
    zoneRedundancy: string;
    anonymousPullEnabled: boolean;
  }
   interface NetworkRuleSet {
    defaultAction: string;
    ipRules?: (null)[] | null;
  }
   interface Policies {
    quarantinePolicy: QuarantinePolicyOrPolicyOrAzureADAuthenticationAsArmPolicyOrEncryption;
    trustPolicy: TrustPolicy;
    retentionPolicy: RetentionPolicy;
    Policy: QuarantinePolicyOrPolicyOrAzureADAuthenticationAsArmPolicyOrEncryption;
    azureADAuthenticationAsArmPolicy: QuarantinePolicyOrPolicyOrAzureADAuthenticationAsArmPolicyOrEncryption;
    softDeletePolicy: SoftDeletePolicy;
  }
   interface QuarantinePolicyOrPolicyOrAzureADAuthenticationAsArmPolicyOrEncryption {
    status: string;
  }
   interface TrustPolicy {
    type: string;
    status: string;
  }
   interface RetentionPolicy {
    days: number;
    lastUpdatedTime: string;
    status: string;
  }
   interface SoftDeletePolicy {
    retentionDays: number;
    lastUpdatedTime: string;
    status: string;
  }
   interface PrivateEndpointConnectionsEntity {
    type: string;
    id: string;
    name: string;
    properties: Properties1;
  }
   interface Properties1 {
    privateEndpoint: PrivateEndpoint;
    privateLinkServiceConnectionState: PrivateLinkServiceConnectionState;
    provisioningState: string;
  }
   interface PrivateEndpoint {
    id: string;
  }
   interface PrivateLinkServiceConnectionState {
    status: string;
    description: string;
  }

  