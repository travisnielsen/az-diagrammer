import * as AzureTypes from './AzureTypes';

export class AzureData {
    apiManagement: AzureTypes.ApiManagement[] = [];
    appServicePlans: AzureTypes.AppServicePlan[] = [];
    appServices: AzureTypes.AppService[] = [];
    azureFirewalls: AzureTypes.AzureFirewall[] = [];
    cosmosAccounts: AzureTypes.CosmosAccount[] = [];
    databricksWorkspaces: AzureTypes.DatabricksWorkspace[] = [];
    eventHubClusters: AzureTypes.EventHubCluster[] = [];
    eventHubNamespaces: AzureTypes.EventHubNamespace[] = [];
    eventHubNetworkRuleSets: AzureTypes.NetworkRuleSet[] = [];
    expressRouteCircuits: AzureTypes.ExpressRouteCircuit[] = [];
    gatewayConnections: AzureTypes.GatewayConnection[] = [];
    loadBalancers: AzureTypes.LoadBalancer[] = [];
    networkInterfaces: AzureTypes.NetworkInterface[] = [];
    networkSecurityGroups: AzureTypes.NetworkSecurityGroup[] = [];
    privateEndpoints: AzureTypes.PrivateEndpoint[] = [];
    redisCache: AzureTypes.RedisCache[] = [];
    routeTables: AzureTypes.RouteTable[] = [];
    serviceBusNamespaces: AzureTypes.ServiceBusNamespace[] = [];
    serviceBusNetworkRuleSets: AzureTypes.NetworkRuleSet[] = [];
    storageAccounts: AzureTypes.StorageAccount[] = [];
    subscriptions: AzureTypes.Subscription[] = [];
    virtualMachinesDns: AzureTypes.VirtualMachine[] = [];
    virtualMachineScaleSets: AzureTypes.VirtualMachineScaleSet[] = [];
    virtualNetworks: AzureTypes.VirtualNetwork[] = [];
    vnetGateways: AzureTypes.VnetGateway[] = [];
}