import { Tags } from "./Tags";

export type Subscription = {
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
    Tags: Tags;
}

export type SubscriptionPolicies = {   
    LocationPlacementId: string;
    QuotaId: string;
    SpendingLimit: string;
}

export type ExtendedProperties = {
    SubscriptionPolices: string;
    Environment: string;
    Tags: string;
    Tenants: string;
    AuthorizationSource: string;
    ManagedByTenants: string;
    Account: string;
    HomeTenant: string;
}

