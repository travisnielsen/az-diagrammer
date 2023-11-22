import * as AzureTypes from './AzureTypes';

export class AzureData {
    apiManagement: AzureTypes.ApiManagement[] = [];
    appServicePlans: AzureTypes.AppServicePlan[] = [];
    appServices: AzureTypes.AppService[] = [];
    azureFirewalls: AzureTypes.AzureFirewall[] = [];
    bastions: AzureTypes.BastionHost[] = [];
    cosmosAccounts: AzureTypes.CosmosAccount[] = [];
    databricksWorkspaces: AzureTypes.DatabricksWorkspace[] = [];
    dnsForwardingRulesets: AzureTypes.DnsForwardingRuleset[] = [];
    dnsForwardingRulesetLinks: AzureTypes.DnsForwardingRulesetLink[] = [];
    dnsForwardingRulesetRules: AzureTypes.DnsForwardingRulesetRule[] = [];
    dnsResolvers: AzureTypes.DnsResolver[] = [];
    eventHubClusters: AzureTypes.EventHubCluster[] = [];
    eventHubNamespaces: AzureTypes.EventHubNamespace[] = [];
    eventHubNetworkRuleSets: AzureTypes.NetworkRuleSet[] = [];
    expressRouteCircuits: AzureTypes.ExpressRouteCircuit[] = [];
    gatewayConnections: AzureTypes.GatewayConnection[] = [];
    keyVaults: AzureTypes.KeyVault[] = [];
    loadBalancers: AzureTypes.LoadBalancer[] = [];
    networkInterfaces: AzureTypes.NetworkInterface[] = [];
    networkSecurityGroups: AzureTypes.NetworkSecurityGroup[] = [];
    privateDnsZones: AzureTypes.PrivateDnsZone[] = [];
    privateDnsZoneLinks: AzureTypes.PrivateDnsZoneLink[] = [];
    privateEndpoints: AzureTypes.PrivateEndpoint[] = [];
    redisCache: AzureTypes.RedisCache[] = [];
    routeTables: AzureTypes.RouteTable[] = [];
    serviceBusNamespaces: AzureTypes.ServiceBusNamespace[] = [];
    serviceBusNetworkRuleSets: AzureTypes.NetworkRuleSet[] = [];
    storageAccounts: AzureTypes.StorageAccount[] = [];
    subscriptions: AzureTypes.Subscription[] = [];
    virtualMachineScaleSets: AzureTypes.VirtualMachineScaleSet[] = [];
    virtualMachinesDns: AzureTypes.VirtualMachine[] = [];
    virtualNetworks: AzureTypes.VirtualNetwork[] = [];
    vnetGateways: AzureTypes.VnetGateway[] = [];
}