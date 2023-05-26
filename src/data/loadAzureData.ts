import { BlobServiceClient } from "@azure/storage-blob";
import configData from "../config.json"
import { Subscription, VirtualNetwork, NetworkSecurityGroup, RouteTable } from '../types/azure/AzureTypes';
import { VirtualMachineScaleSet } from "../types/azure/VirtualMachineScaleSet";

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
                const subscriptions: Subscription[] = await JSON.parse(blobString);
                azureData.subscriptions = subscriptions;
                break;
            case "vnets.json":
                const virtualNetworks: VirtualNetwork[] = await JSON.parse(blobString);
                azureData.virtualNetworks = virtualNetworks;
                break;
            case "networkSecurityGroups.json":
                const networkSecurityGroups: NetworkSecurityGroup[]  = await JSON.parse(blobString);
                azureData.networkSecurityGroups = networkSecurityGroups;
                break;
            case "routeTables.json":
                const routeTables: RouteTable[]  = await JSON.parse(blobString);
                azureData.routeTables = routeTables;
                break;
            case "virtualMachineScaleSets.json":
                const vmss: VirtualMachineScaleSet[]  = await JSON.parse(blobString);
                azureData.vmss = vmss;
                break;       
                
            default:
                break;
        }
    }

}