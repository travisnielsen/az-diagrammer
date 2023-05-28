import { AzureBase } from "./AzureBase";

export interface Subscription extends AzureBase {
    Id: string;
    Name: string;
    State: string;
    SubscriptionId: string;
    TenantId: string;
    HomeTenantId: string;
    ManagedByTenantIds?: (string)[] | null;
    CurrentStorageAccountName?: null;
    SubscriptionPolicies: SubscriptionPolicies;
    ExtendedProperties: ExtendedProperties;
    CurrentStorageAccount?: null;
    AuthorizationSource: string;
}

interface SubscriptionPolicies {   
    LocationPlacementId: string;
    QuotaId: string;
    SpendingLimit: string;
}

interface ExtendedProperties {
    SubscriptionPolices: string;
    Environment: string;
    Tags: string;
    Tenants: string;
    AuthorizationSource: string;
    ManagedByTenants: string;
    Account: string;
    HomeTenant: string;
}

