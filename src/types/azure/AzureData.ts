import * as AzureTypes from './AzureTypes';

export class AzureData {
    subscriptions: AzureTypes.Subscription[] = [];
    virtualNetworks: AzureTypes.VirtualNetwork[] = [];
    networkSecurityGroups: AzureTypes.NetworkSecurityGroup[] = [];
    routeTables: AzureTypes.RouteTable[] = [];
    azureFirewalls: AzureTypes.AzureFirewall[] = [];
    databricksWorkspaces: AzureTypes.DatabricksWorkspace[] = [];
    loadBalancers: AzureTypes.LoadBalancer[] = [];
    redisCache: AzureTypes.RedisCache[] = [];
    apiManagement: AzureTypes.ApiManagement[] = [];
    vnetGateways: AzureTypes.VnetGateway[] = [];
    storageAccounts: AzureTypes.StorageAccount[] = [];
    cosmosAccounts: AzureTypes.CosmosAccount[] = [];
    eventHubClusters: AzureTypes.EventHubCluster[] = [];
    eventHubNamespaces: AzureTypes.EventHubNamespace[] = [];
    eventHubNetworkRuleSets: AzureTypes.NetworkRuleSet[] = [];
    appServicePlans: AzureTypes.AppServicePlan[] = [];
    appServices: AzureTypes.AppService[] = [];
    privateEndpoints: AzureTypes.PrivateEndpoint[] = [];
    expressRouteCircuits: AzureTypes.ExpressRouteCircuit[] = [];
    gatewayConnections: AzureTypes.GatewayConnection[] = [];
    virtualMachineScaleSets: AzureTypes.VirtualMachineScaleSet[] = [];
    serviceBusNamespaces: AzureTypes.ServiceBusNamespace[] = [];
    serviceBusNetworkRuleSets: AzureTypes.NetworkRuleSet[] = [];

}