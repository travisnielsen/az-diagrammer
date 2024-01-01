import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { AzureData } from "../types/azure/AzureData";

export const LoadAzureData = async (connectionString: string, containerName: string, folderName?: string) => {
        
    const azureData: AzureData = new AzureData();
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
    

    return azureData;

    // return list of Blob files
    async function getBlobFiles(containerClient: ContainerClient, folderName?: string) {
        let i = 1;
        const blobNames = [];
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
    
    async function blobToString(blobData) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
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
        const blobString: string = await blobToString(await downloadResponse.blobBody) as string;

        if (folderName) {
            blobName = blobName.replace(folderName + '/', '');
        }

        switch (blobName.toLowerCase()) {
            case "subscriptions.json":
                azureData.subscriptions = await blobToJSONArray(blobString);
                break;
            case "vnets.json":
                azureData.virtualNetworks = await blobToJSONArray(blobString);
                break;
            case "networksecuritygroups.json":
                azureData.networkSecurityGroups = await blobToJSONArray(blobString);
                break;
            case "routetables.json":
                azureData.routeTables = await blobToJSONArray(blobString);
                break;
            case "virtualmachinescalesets.json":
                azureData.virtualMachineScaleSets = await blobToJSONArray(blobString);
                break;
            case "virtualmachines.json":
                azureData.virtualMachines = await blobToJSONArray(blobString);
                break;
            case "virtualmachines-dns.json":
                azureData.virtualMachinesDns = await blobToJSONArray(blobString);
                break;
            case "workspaces.json":
                azureData.databricksWorkspaces = await blobToJSONArray(blobString);
                break;
            case "loadbalancers.json":
                azureData.loadBalancers = await blobToJSONArray(blobString);
                break;
            case "firewalls.json":
                azureData.azureFirewalls = await blobToJSONArray(blobString);
                break;
            case "redis.json":
                azureData.redisCache = await blobToJSONArray(blobString);
                break;
            case "apimanagement.json":
                azureData.apiManagement = await blobToJSONArray(blobString);
                break;
            case "vnetgateways.json":
                azureData.vnetGateways = await blobToJSONArray(blobString);
                break;
            case "storageaccounts.json":
                azureData.storageAccounts = await blobToJSONArray(blobString);
                break;
            case "cosmosdbaccounts.json":
                azureData.cosmosAccounts = await blobToJSONArray(blobString);
                break;
            case "eventhubclusters.json":
                azureData.eventHubClusters = await blobToJSONArray(blobString);
                break;
            case "eventhubnamespaces.json":
                azureData.eventHubNamespaces = await blobToJSONArray(blobString);
                break;
            case "eventhubnetworkrulesets.json":
                azureData.eventHubNetworkRuleSets = await blobToJSONArray(blobString);
                break;
            case "servicebusnamespaces.json":
                azureData.serviceBusNamespaces = await blobToJSONArray(blobString);
                break;
            case "servicebusnetworkrulesets.json":
                azureData.serviceBusNetworkRuleSets = await blobToJSONArray(blobString);
                break;
            case "serverfarms.json":
                azureData.appServicePlans = await blobToJSONArray(blobString);
                break;
            case "sites.json":
                azureData.appServices = await blobToJSONArray(blobString);
                break;
            case "networkinterfaces.json":
                azureData.networkInterfaces = await blobToJSONArray(blobString);
                break;            
            case "privateendpoints.json":
                azureData.privateEndpoints = await blobToJSONArray(blobString);
                break;
            case "expressroutecircuits.json":
                azureData.expressRouteCircuits = await blobToJSONArray(blobString);
                break;
            case "gatewayconnections.json":
                azureData.gatewayConnections = await blobToJSONArray(blobString);
                break;
            case "bastionhosts.json":
                azureData.bastions = await blobToJSONArray(blobString);
                break;            
            case "dnsforwardingrulesets.json":
                azureData.dnsForwardingRulesets = await blobToJSONArray(blobString);
                break;                 
            case "dnsforwardingrulesetrules.json":
                azureData.dnsForwardingRulesetRules = await blobToJSONArray(blobString);
                break;            
            case "dnsforwardingrulesetlinks.json":
                azureData.dnsForwardingRulesetLinks = await blobToJSONArray(blobString);
                break;     
            case "dnsresolvers.json":
                azureData.dnsResolvers = await blobToJSONArray(blobString);
                break;
            case "dnsresolveroutboundendpoints.json":
                azureData.dnsResolverOutboundEndpoints = await blobToJSONArray(blobString);
                break;
            case "keyvaults.json":
                azureData.keyVaults = await blobToJSONArray(blobString);
                break;     
            case "privatednszones.json":
                azureData.privateDnsZones = await blobToJSONArray(blobString);
                break;   
            case "privatednszonelinks.json":
                azureData.privateDnsZoneLinks = await blobToJSONArray(blobString);
                break;
            case "containerregistries.json":
                azureData.containerRegistries = await blobToJSONArray(blobString);
                break;
            case "publicipaddresses.json":
                azureData.publicIpAddresses = await blobToJSONArray(blobString);
                break;
            case "aks.json":
                azureData.aksClusters = await blobToJSONArray(blobString);
                break;
            default:
                break;
        }
    }

}