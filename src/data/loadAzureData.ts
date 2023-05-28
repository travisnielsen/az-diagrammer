import { BlobServiceClient } from "@azure/storage-blob";
import configData from "../config.json"
import * as AzureTypes from '../types/azure/AzureTypes';

export const loadAzureData = async () => {

    const STORAGE_CONNECTION_STRING = configData.storageConnectionString
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING)
    const containerClient = blobServiceClient.getContainerClient(configData.storageContainerName);
    const azureData: { [key: string]: any } = {};
    
    const fileNames = await getBlobFiles().catch((err) => {
        console.error(err);
    });

    if (fileNames) {
        for (const fileName of fileNames) {
            await getAzureData(fileName);
        }
    } else {
        console.log("no blob files found")
    }

    return azureData;

    // return list of Blob files
    async function getBlobFiles() {
        let i = 1;
        let blobNames = [];
        let blobs = containerClient.listBlobsFlat();
        for await (const blob of blobs) {
            blobNames.push(blob.name);
            console.log(`Blob ${i++}: ${blob.name}`);
        }
        return blobNames;
    }
    
    async function blobToString(blobData: any) {
        const fileReader = new FileReader();
        return new Promise<any>((resolve, reject) => {
          fileReader.onloadend = (ev) => {
            resolve(ev.target?.result);
          };
          fileReader.onerror = reject;
          fileReader.readAsText(blobData);
        });
    }

    async function getAzureData(blobName: string) {
        const blobClient = await containerClient.getBlobClient(blobName)
        const downloadResponse = await blobClient.download();
        const blobString = await blobToString(await downloadResponse.blobBody);

        switch (blobName) {
            case "subscriptions.json":
                const subscriptions: AzureTypes.Subscription[] = await JSON.parse(blobString);
                azureData.subscriptions = subscriptions;
                break;
            case "vnets.json":
                const virtualNetworks: AzureTypes.VirtualNetwork[] = await JSON.parse(blobString);
                azureData.virtualNetworks = virtualNetworks;
                break;
            case "networkSecurityGroups.json":
                const networkSecurityGroups: AzureTypes.NetworkSecurityGroup[]  = await JSON.parse(blobString);
                azureData.networkSecurityGroups = networkSecurityGroups;
                break;
            case "routeTables.json":
                const routeTables: AzureTypes.RouteTable[]  = await JSON.parse(blobString);
                azureData.routeTables = routeTables;
                break;
            case "virtualMachineScaleSets.json":
                const vmss: AzureTypes.VirtualMachineScaleSet[]  = await JSON.parse(blobString);
                azureData.vmss = vmss;
                break;       
            case "workspaces.json":
                const databricksWorkspaces: AzureTypes.DatabricksWorkspace[]  = await JSON.parse(blobString);
                azureData.databricksWorkspaces = databricksWorkspaces;
                break;
            case "loadBalancers.json":
                const loadBalancers: AzureTypes.LoadBalancer[]  = await JSON.parse(blobString);
                azureData.loadBalancers = loadBalancers;
                break;
            case "firewalls.json":
                const azureFirewalls: AzureTypes.AzureFirewall[]  = await JSON.parse(blobString);
                azureData.azureFirewalls = azureFirewalls;
                break;
            case "redis.json":
                const redisCache: AzureTypes.RedisCache[]  = await JSON.parse(blobString);
                azureData.redisCache = redisCache;
                break;
            case "apiManagement.json":
                const apiManagement: AzureTypes.ApiManagement[]  = await JSON.parse(blobString);
                azureData.apiManagement = apiManagement;
                break;
            case "vnetGateways.json":
                const vnetGateways: AzureTypes.VnetGateway[]  = await JSON.parse(blobString);
                azureData.vnetGateways = vnetGateways;
                break;
            case "storageAccounts.json":
                const storageAccounts: AzureTypes.StorageAccount[]  = await JSON.parse(blobString);
                azureData.storageAccounts = storageAccounts;
                break;
            case "cosmosDbAccounts.json":
                const cosmosAccounts: AzureTypes.CosmosAccount[]  = await JSON.parse(blobString);
                azureData.cosmosAccounts = cosmosAccounts;
                break;
            case "eventHubClusters.json":
                const eventHubClusters: AzureTypes.EventHubCluster[]  = await JSON.parse(blobString);
                azureData.eventHubClusters = eventHubClusters;
                break;
            case "eventHubNamespaces.json":
                const eventHubNamespaces: AzureTypes.EventHubNamespace[]  = await JSON.parse(blobString);
                azureData.eventHubNamespaces = eventHubNamespaces;
                break;
            case "eventHubNetworkRuleSets.json":
                const eventHubNetworkRuleSets: AzureTypes.NetworkRuleSet[]  = await JSON.parse(blobString);
                azureData.eventHubNetworkRuleSets = eventHubNetworkRuleSets;
                break;
            case "serviceBusNamespaces.json":
                const serviceBusNamespaces: AzureTypes.ServiceBusNamespace[]  = await JSON.parse(blobString);
                azureData.serviceBusNamespaces = serviceBusNamespaces;
                break;
            case "serviceBusNetworkRuleSets.json":
                const serviceBusNetworkRuleSets: AzureTypes.NetworkRuleSet[]  = await JSON.parse(blobString);
                azureData.serviceBusNetworkRuleSets = serviceBusNetworkRuleSets;
                break;
            case "serverFarms.json":
                const appServicePlans: AzureTypes.AppServicePlan[]  = await JSON.parse(blobString);
                azureData.appServicePlans = appServicePlans;
                break;
            case "sites.json":
                const appServices: AzureTypes.AppService[]  = await JSON.parse(blobString);
                azureData.appServices = appServices;
                break;
            case "privateEndpoints.json":
                const privateEndpoints: AzureTypes.PrivateEndpoint[]  = await JSON.parse(blobString);
                azureData.privateEndpoints = privateEndpoints;
                break;
            case "expressRouteCircuits.json":
                const expressRouteCircuits: AzureTypes.ExpressRouteCircuit[]  = await JSON.parse(blobString);
                azureData.expressRouteCircuits = expressRouteCircuits;
                break;
            case "gatewayConnections.json":
                const gatewayConnections: AzureTypes.GatewayConnection[]  = await JSON.parse(blobString);
                azureData.gatewayConnections = gatewayConnections;
                break;
            default:
                break;
        }
    }

}