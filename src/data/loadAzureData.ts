import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import * as AzureTypes from '../types/azure/AzureTypes';
import { AzureData } from "../types/azure/AzureData";

export const LoadAzureData = async (connectionString: string, containerName: string, folderName?: string) => {
        
    let azureData: AzureData = new AzureData();

    if (connectionString.toLowerCase() === 'demo') {

        // const demoData = await import('../data/aks.json');


    } else {

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
    
        const fileNames = await getBlobFiles(containerClient, folderName).catch((err) => {
            console.error(err);
        });

        if (fileNames) {
            for (const fileName of fileNames) {
                await getAzureDataFromBlob(fileName, containerClient, folderName);
            }
        } else {
            console.log("no blob files found")
        }
    }

    return azureData;

    // return list of Blob files
    async function getBlobFiles(containerClient: ContainerClient, folderName?: string) {
        let i = 1;
        let blobNames = [];
        let blobs = null
        
        if (folderName) {
            blobs = containerClient.listBlobsFlat({ prefix: folderName });
        } else {
            blobs = containerClient.listBlobsFlat();
        }

        // containerClient.listBlobsFlat({ prefix: folderName || '' });
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

    async function blobToJSONArray(blobString: string) {
        const result = await JSON.parse(blobString);

        if (Array.isArray(result)) {
            return result;
        } else {
            return Array.of(result);
        }
    }

    async function getAzureDataFromBlob(blobName: string, containerClient: ContainerClient, folderName?: string) {
        const blobClient = await containerClient.getBlobClient(blobName)
        const downloadResponse = await blobClient.download();
        const blobString = await blobToString(await downloadResponse.blobBody);

        if (folderName) {
            blobName = blobName.replace(folderName + '/', '');
        }

        switch (blobName.toLowerCase()) {
            case "subscriptions.json":
                const subscriptions: AzureTypes.Subscription[] = await blobToJSONArray(blobString);
                azureData.subscriptions = subscriptions;
                break;
            case "vnets.json":
                const virtualNetworks: AzureTypes.VirtualNetwork[] = await blobToJSONArray(blobString);
                azureData.virtualNetworks = virtualNetworks;
                break;
            case "networksecuritygroups.json":
                const networkSecurityGroups: AzureTypes.NetworkSecurityGroup[]  = await blobToJSONArray(blobString);
                azureData.networkSecurityGroups = networkSecurityGroups;
                break;
            case "routetables.json":
                const routeTables: AzureTypes.RouteTable[]  = await blobToJSONArray(blobString);
                azureData.routeTables = routeTables;
                break;
            case "virtualmachinescalesets.json":
                const virtualMachineScaleSets: AzureTypes.VirtualMachineScaleSet[]  = await blobToJSONArray(blobString);
                azureData.virtualMachineScaleSets = virtualMachineScaleSets;
                break;
            case "virtualmachines.json":
                const vms: AzureTypes.VirtualMachine[]  = await blobToJSONArray(blobString);
                azureData.virtualMachines = vms;
                break;
            case "virtualmachines-dns.json":
                const virtualMachines: AzureTypes.VirtualMachine[]  = await blobToJSONArray(blobString);
                azureData.virtualMachinesDns = virtualMachines;
                break;
            case "workspaces.json":
                const databricksWorkspaces: AzureTypes.DatabricksWorkspace[]  = await blobToJSONArray(blobString);
                azureData.databricksWorkspaces = databricksWorkspaces;
                break;
            case "loadbalancers.json":
                const loadBalancers: AzureTypes.LoadBalancer[]  = await blobToJSONArray(blobString);
                azureData.loadBalancers = loadBalancers;
                break;
            case "firewalls.json":
                const azureFirewalls: AzureTypes.AzureFirewall[]  = await blobToJSONArray(blobString);
                azureData.azureFirewalls = azureFirewalls;
                break;
            case "redis.json":
                const redisCache: AzureTypes.RedisCache[]  = await blobToJSONArray(blobString);
                azureData.redisCache = redisCache;
                break;
            case "apimanagement.json":
                const apiManagement: AzureTypes.ApiManagement[]  = await blobToJSONArray(blobString);
                azureData.apiManagement = apiManagement;
                break;
            case "vnetgateways.json":
                const vnetGateways: AzureTypes.VnetGateway[]  = await blobToJSONArray(blobString);
                azureData.vnetGateways = vnetGateways;
                break;
            case "storageaccounts.json":
                const storageAccounts: AzureTypes.StorageAccount[]  = await blobToJSONArray(blobString);
                azureData.storageAccounts = storageAccounts;
                break;
            case "cosmosdbaccounts.json":
                const cosmosAccounts: AzureTypes.CosmosAccount[]  = await blobToJSONArray(blobString);
                azureData.cosmosAccounts = cosmosAccounts;
                break;
            case "eventhubclusters.json":
                const eventHubClusters: AzureTypes.EventHubCluster[]  = await blobToJSONArray(blobString);
                azureData.eventHubClusters = eventHubClusters;
                break;
            case "eventhubnamespaces.json":
                const eventHubNamespaces: AzureTypes.EventHubNamespace[]  = await blobToJSONArray(blobString);
                azureData.eventHubNamespaces = eventHubNamespaces;
                break;
            case "eventhubnetworkrulesets.json":
                const eventHubNetworkRuleSets: AzureTypes.NetworkRuleSet[]  = await blobToJSONArray(blobString);
                azureData.eventHubNetworkRuleSets = eventHubNetworkRuleSets;
                break;
            case "servicebusnamespaces.json":
                const serviceBusNamespaces: AzureTypes.ServiceBusNamespace[]  = await blobToJSONArray(blobString);
                azureData.serviceBusNamespaces = serviceBusNamespaces;
                break;
            case "servicebusnetworkrulesets.json":
                const serviceBusNetworkRuleSets: AzureTypes.NetworkRuleSet[]  = await blobToJSONArray(blobString);
                azureData.serviceBusNetworkRuleSets = serviceBusNetworkRuleSets;
                break;
            case "serverfarms.json":
                const appServicePlans: AzureTypes.AppServicePlan[]  = await blobToJSONArray(blobString);
                azureData.appServicePlans = appServicePlans;
                break;
            case "sites.json":
                const appServices: AzureTypes.AppService[]  = await blobToJSONArray(blobString);
                azureData.appServices = appServices;
                break;
            case "networkinterfaces.json":
                const nics: AzureTypes.NetworkInterface[]  = await blobToJSONArray(blobString);
                azureData.networkInterfaces = nics;
                break;            
            case "privateendpoints.json":
                const privateEndpoints: AzureTypes.PrivateEndpoint[]  = await blobToJSONArray(blobString);
                azureData.privateEndpoints = privateEndpoints;
                break;
            case "expressroutecircuits.json":
                const expressRouteCircuits: AzureTypes.ExpressRouteCircuit[]  = await blobToJSONArray(blobString);
                azureData.expressRouteCircuits = expressRouteCircuits;
                break;
            case "gatewayconnections.json":
                const gatewayConnections: AzureTypes.GatewayConnection[]  = await blobToJSONArray(blobString);
                azureData.gatewayConnections = gatewayConnections;
                break;
            case "bastionhosts.json":
                const bastionHosts: AzureTypes.BastionHost[]  = await blobToJSONArray(blobString);
                azureData.bastions = bastionHosts;
                break;            
            case "dnsforwardingrulesets.json":
                const dnsForwardingRulesets: AzureTypes.DnsForwardingRuleset[]  = await blobToJSONArray(blobString);
                azureData.dnsForwardingRulesets = dnsForwardingRulesets;
                break;                 
            case "dnsforwardingrulesetrules.json":
                const dnsForwardingRulesetRules: AzureTypes.DnsForwardingRulesetRule[]  = await blobToJSONArray(blobString);
                azureData.dnsForwardingRulesetRules = dnsForwardingRulesetRules;
                break;            
            case "dnsforwardingrulesetlinks.json":
                const dnsForwardingRulesetLinks: AzureTypes.DnsForwardingRulesetLink[]  = await blobToJSONArray(blobString);
                azureData.dnsForwardingRulesetLinks = dnsForwardingRulesetLinks;
                break;     
            case "dnsresolvers.json":
                const dnsResolvers: AzureTypes.DnsResolver[]  = await blobToJSONArray(blobString);
                azureData.dnsResolvers = dnsResolvers;
                break;
            case "dnsresolveroutboundendpoints.json":
                const dnsResolverOutboundEndpoints: AzureTypes.DnsResolverOutboundEndpoint[]  = await blobToJSONArray(blobString);
                azureData.dnsResolverOutboundEndpoints = dnsResolverOutboundEndpoints;
                break;
            case "keyvaults.json":
                const keyVaults: AzureTypes.KeyVault[]  = await blobToJSONArray(blobString);
                azureData.keyVaults = keyVaults;
                break;     
            case "privatednszones.json":
                const privateDnsZones: AzureTypes.PrivateDnsZone[]  = await blobToJSONArray(blobString);
                azureData.privateDnsZones = privateDnsZones;
                break;   
            case "privatednszonelinks.json":
                const privateDnsZoneLinks: AzureTypes.PrivateDnsZoneLink[]  = await blobToJSONArray(blobString);
                azureData.privateDnsZoneLinks = privateDnsZoneLinks;
                break;
            case "containerregistries.json":
                const containerRegistries: AzureTypes.ContainerRegistry[]  = await blobToJSONArray(blobString);
                azureData.containerRegistries = containerRegistries;
                break;            
            default:
                break;
        }
    }

}