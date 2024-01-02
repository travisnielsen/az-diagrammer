import { AzureData } from "../types/azure/AzureData"
import { VirtualMachineScaleSet } from "../types/azure/VirtualMachineScaleSet"


export const shortId = (s: string | undefined | null) => {
    if (s === undefined || s === null) {
        return ""
    }
    const splitArr = s.split("/")
    const resourceGroup = splitArr[4].replace(/_/g, "").replace(/-/g, "").toLowerCase()
    const item = splitArr[splitArr.length - 1].replace(/_/g, "").replace(/-/g, "").toLowerCase()
    
    // its possible to have two subnets in the same resource group with the same name. Example: AzureFirewallSubnet
    if (s.includes("/subnets/")) {
        const vnetToken = s.split("/virtualNetworks/")[1]
        const vnetName = vnetToken.split("/")[0].replace(/-/g, "").toLowerCase()
        return resourceGroup + "-" + vnetName + "-" + item
    }

    // handle uniqueness for private dns zone links
    if (s.includes("/virtualNetworkLinks/")) {
        const zoneName = splitArr[8]
        const linkDnsToken = s.split("/virtualNetworkLinks/")[1]
        return resourceGroup + "-" + item + "-" + zoneName + "-" + linkDnsToken.replace(/-/g, "").toLowerCase()
    }
    
    return resourceGroup + "-" + item
}

export const getDistinctResourceIds = (ipConfigs: (string | undefined)[] | undefined) => {
    if (ipConfigs === undefined) {
        return []
    }
    const parentResourceIds = ipConfigs.map(id => {
        if (id === undefined) {
            return ""
        }
        return id.split("/virtualMachines/",)[0]
    }).flat();
    return [...new Set(parentResourceIds)]
}

export const getSubscriptionGuidFromId = (resourceId: string) => {
    const id = resourceId.split("/")[2]
    return id
}

export const getParentIdForRulesetId = (s: string) => {
    const id = s.toLowerCase().split("/networkrulesets/")[0]
    return id
}

export const getIdFromText = (s: string | undefined) => {
    if (s === undefined) {
        return ""
    }
    const id = s.replace(/_/g, "").replace(/ /g, "").toLowerCase()
    return id
}

export const getVmsWithPrivateIp = (azureData: AzureData) => {
    // iterate thoguh all networkInterfaces and get the private IP address. set this as a the PrivateIpAddress property on the matching virtual machine
    const vms = azureData.virtualMachinesDns.map((vm) => {
        const networkInterface = azureData.networkInterfaces.find((ni) => ni.VirtualMachine?.id === vm.Id)
        if (networkInterface !== undefined) {
            vm.PrivateIpAddress = networkInterface.IpConfigurations[0].PrivateIpAddress
        }
        return vm
    })
    return vms
}

export const getFromResourceIdforPublicIp = (publicIpId: string) => {
    const resourceDelimiters = ['/bastionHostIpConfigurations/', '/azureFirewallIpConfigurations/', '/ipConfigurations/', '/frontendIPConfigurations/']
    const resourceDelimiter = resourceDelimiters.find((delimiter) => publicIpId.includes(delimiter))

    if (resourceDelimiter === undefined) {
        return ""
    }

    const resourceId = publicIpId.split(resourceDelimiter)[0]
    return resourceId
}

export const getRegionIdFromFriendlyName = (name: string) => {
    switch (name) {
        case ("Central US"):
            return "centralus"
        case ("East US2"):
            return "eastus2"
        case ("East US"):
            return "eastus"
        case ("North Central US"):
            return "northcentralus"
        default:
            return ""
    }
}

export const getAgentPoolShortIdFromSubnetId = (agentPoolName: string, subnetId: string, azureData: AzureData) => {

    const vmssList: VirtualMachineScaleSet[] = []
    
    azureData.virtualMachineScaleSets.forEach((vmss) => {
        vmss.Properties.virtualMachineProfile.networkProfile.networkInterfaceConfigurations.forEach((nic) => {
            if (nic.properties.primary === true) {
                const subnet = nic.properties.ipConfigurations[0].properties.subnet
                if (subnet.id === subnetId) {
                    vmssList.push(vmss)
                }
            }
        })})
    
    const vmssMatch = vmssList.find((vmss) => vmss.Name.includes(agentPoolName))
    if (vmssMatch === undefined) { return "" }
    return shortId(vmssMatch.Id)
}

export const vnetGatewaysIdExistsInDiagram = (gatewayId: string, azureData: AzureData) => {
    const subnetIds = azureData.virtualNetworks.map((vnet) => vnet.Properties.subnets.map((subnet) => subnet.id)).flat()
    const gateway = azureData.vnetGateways.find((vnetGateway) => vnetGateway.Id === gatewayId)

    if (gateway === undefined) {
        return false
    }

    const subnetId = gateway.Properties.ipConfigurations.map(config => config.properties.subnet.id).flat()[0]

    if (subnetIds.includes(subnetId)) {
        return true
    }

    return false
}

// TODO: integrate this async code with synchronous calls from the rest of this code using promises
/*
const hashValue = async (s: string) => {
    const hash = await sha256(s);
    return hash.slice(0, 10);
}
*/



/*
const hasTagFilterMatch = (s: string | undefined) => {
    if (s === undefined) {
        return false
    }
    // TODO: need to solve for tag filtering
    // return excludeTagValues.includes(s)
}
*/
