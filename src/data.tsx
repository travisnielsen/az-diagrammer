import { NodeData, EdgeData, NodeProps, ElkNodeLayoutOptions } from 'reaflow';
import routeTableData from './data/routeTables.json'
import vnetData from "./data/vnets.json"
import vmssData from "./data/virtualMachineScaleSets.json"
import databricksWorkspaceData from './data/workspaces.json'
import loadBalancerPrivateData from './data/loadBalancersPrivate.json'
import loadBalancerPublicData from './data/loadBalancersPublic.json'
import firewallData from './data/firewalls.json'
import vnetGatewayData from './data/vnetGateways.json'
import storageAccountData from './data/storageAccounts.json'
import cosmosAccountData from './data/cosmosDbAccounts.json'
import configData from "./config.json"
import { arrayBuffer } from 'stream/consumers';


const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

const shortId = (s: string) => {
    const splitArr = s.split("/")
    const resourceGroup = splitArr[4].replace(/_/g, "").replace(/-/g, "").toLowerCase()
    const item = splitArr[splitArr.length -1].replace(/_/g, "").replace(/-/g, "").toLowerCase()
    return resourceGroup + "-" + item
}

const idFromNetworkIpconfig = (s: string) => {
    const id = s.split("/virtualMachines/")[0]
    return id
}

const getDistinctResourceIds = (ipConfigs: string[]) => {
    const parentResourceIds = ipConfigs.map(id => {
        return id.split("/virtualMachines/",)[0]
    }).flat();
    return [...new Set(parentResourceIds)]

}

const getSubscriptionGuidFromId = (resourceId: string) => {
    const id = resourceId.split("/")[2]
    return id
}

const getRegionIdFromFriendlyName = (name: string) => {
    switch (name) {
        case ("Central US"):
            return "centralus"
        default:
            return ""
    }
}

// TODO: remove duplicates from this arraoy
const targetFirewallIps = routeTableData.filter(routeTable => routeTable.Location.includes(configData.region))
    .map(routeTable => routeTable.Properties.routes.filter(route => route.properties.addressPrefix.includes("0.0.0.0/0"))
    .map(r => r.properties.nextHopIpAddress)).flat()

export const nodeData = () => {

    const vnets: NodeData[] = vnetData.filter(vnet => vnet.Location.includes(configData.region)).map((vnet) => (
        {
            id: shortId(vnet.Id),
            height: 200,
            width: 300,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                label: vnet.Name,
                url: 'images/Networking/virtualnetwork.svg',
                info: vnet.Properties.addressSpace.addressPrefixes.toString()
            }
        }
    ))

    const subnets: NodeData[] = vnetData.filter(vnet => vnet.Location.includes(configData.region)).map(vnet => vnet.Properties.subnets.map(subnet => (
        {
            id: shortId(subnet.id),
            parent: shortId(vnet.Id),
            height: 200,
            width: 250,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                label: subnet.name,
                url: 'images/Networking/subnet.svg',
                info: subnet.properties.addressPrefix
            }
        }
    ))).flat()

    const vmScaleSets: NodeData[] = vmssData.filter(vmss => vmss.Location.includes(configData.region)).map(vmss => (
        {
            id: shortId(vmss.Id),
            parent: shortId(vmss.Properties.virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].properties.ipConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: vmss.Name,
                info: vmss.Properties.virtualMachineProfile.storageProfile.imageReference.publisher + " " + vmss.Properties.virtualMachineProfile.storageProfile.imageReference.version,
                url: 'images/Compute/virtualmachinescaleset.svg'
              }
        }
    ))

    const dataBricksPublic: NodeData[] = databricksWorkspaceData.filter(workspace => workspace.Location.includes(configData.region)).map(workspace => (
        {
            id: shortId(workspace.Id),
            parent: shortId(workspace.Properties.parameters.customVirtualNetworkId.value + "/subnets/" + workspace.Properties.parameters.customPublicSubnetName.value),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: workspace.Name + " (Public)",
                info: workspace.Sku.Name,
                url: 'images/Analytics/databricks.svg'
              }
        }
    ))

    const dataBricksPrivate: NodeData[] = databricksWorkspaceData.filter(workspace => workspace.Location.includes(configData.region)).map(workspace => (
        {
            id: shortId(workspace.Id),
            parent: shortId(workspace.Properties.parameters.customVirtualNetworkId.value + "/subnets/" + workspace.Properties.parameters.customPrivateSubnetName.value),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: workspace.Name + " (Private)",
                info: workspace.Sku.Name,
                url: 'images/Analytics/databricks.svg'
              }
        }
    ))

    // TODO: typescript issue here. not able to find properties. This is due to something wrong in the source json file.
    const loadBalancersPrivate: NodeData[] = loadBalancerPrivateData.filter(lb => lb.Location == configData.region).map(lb => (
        {
            id: shortId(lb.Id),
            parent: shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: lb.Name,
                info: lb.Properties.frontendIPConfigurations[0].properties.privateIPAddress,
                url: 'images/Networking/loadbalancer.svg'
              }
        }
    ))

    const loadBalancersPublic: NodeData[] = loadBalancerPublicData.filter(lb => lb.Location == configData.region).map(lb => (
        {
            id: shortId(lb.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: lb.Name,
                info: "Public",
                url: 'images/Networking/loadbalancer.svg'
              }
        }
    ))
    
    const firewalls: NodeData[] = firewallData
        // TODO: hard-coded tag name here (EnvType). Need to move this to config. 
        .filter(fw => 
            fw.Location.includes(configData.region) && 
            targetFirewallIps.includes(fw.Properties.ipConfigurations[0].properties.privateIPAddress) && 
            !fw.Tags.EnvType.includes(configData.excludeTagValue))
        .map(fw => (
        {
            id: shortId(fw.Id),
            parent: shortId( fw.Properties.ipConfigurations[0].properties.subnet?.id ?? ""  ),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: fw.Name,
                info: fw.Properties.ipConfigurations[0].properties.privateIPAddress,
                url: 'images/Networking/firewall.svg'
              }
        }
    ))

    const gateways: NodeData[] = vnetGatewayData.filter(gw => gw.Location == configData.region && !gw.Tags.EnvType?.includes(configData.excludeTagValue)).map(gw => (
        {
            id: shortId(gw.Id),
            parent: shortId(gw.Properties.ipConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: gw.Name,
                info: gw.Properties.sku.name,
                url: 'images/Networking/vpngateway.svg'
              }          
        }
    ))

    const storageAccounts: NodeData[] = storageAccountData.filter(s => s.Location == configData.region).map(storage => (
        {
            id: shortId(storage.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: storage.Name,
                info: storage.Sku.Name,
                url: 'images/Storage/storage.svg'
              }          
        }
    ))

    const cosmosAccounts: NodeData[] = cosmosAccountData.filter(c => getRegionIdFromFriendlyName(c.Location) == configData.region).map(cosmos => (
        {
            id: shortId(cosmos.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: cosmos.Name,
                info: cosmos.Properties.databaseAccountOfferType,
                url: 'images/Databases/cosmosdb.svg'
              }          
        }
    ))


    const nodeData = [...vnets, ...subnets, ...vmScaleSets, ...dataBricksPublic, ...dataBricksPrivate, ...loadBalancersPrivate, ...loadBalancersPublic, ...firewalls, ...gateways,
        ...storageAccounts, ...cosmosAccounts ]

    return nodeData
}

export const edgeData = () => {

    const vnetPeerings: EdgeData[] = vnetData.filter(vnet => vnet.Location.includes(configData.region) && vnet.SubscriptionId.includes(configData.subscriptionId))
        .map(vnet => vnet.Properties.virtualNetworkPeerings.map(peering => (
        {
            id: peering.id,
            from: shortId(vnet.Id),
            to: shortId(peering.properties.remoteVirtualNetwork.id),
            text: 'peering'
        }
        ))).flat()
    
    const loadBalancingPrivateVmss: EdgeData[] = loadBalancerPrivateData.filter(lb => lb.Location == configData.region)
        .map(function (lb) {

            const ipconfigIds = lb.Properties.backendAddressPools.map(bePool =>
                bePool.properties.loadBalancerBackendAddresses.map(beAddress => {
                    return beAddress.properties.networkInterfaceIPConfiguration.id
                })).flat()
            
            const distinctIds = getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + shortId(id),
                    parent: shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet.id),
                    from: shortId(lb.Id),
                    to: shortId(id),
                    text: "load balancing"
                }
            ));
        }).flat()

    
    const loadBalancingPublicVmss: EdgeData[] = loadBalancerPublicData.filter(lb => lb.Location == configData.region)
        .map(function (lb) {

            const ipconfigIds = lb.Properties.backendAddressPools.map(bePool =>
                bePool.properties.loadBalancerBackendAddresses.map(beAddress => {
                    return beAddress.properties.networkInterfaceIPConfiguration.id
                })).flat()
            
            const distinctIds = getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + shortId(id),
                    from: shortId(lb.Id),
                    to: shortId(id),
                    text: "load balancing"
                }
            ));
        }).flat()
    
    
    const storageVnetRules: EdgeData[] = storageAccountData.filter(s => s.Location.includes(configData.region))
        .map(storage => storage.Properties.networkAcls.virtualNetworkRules
            .filter(rule => getSubscriptionGuidFromId(rule.id) == getSubscriptionGuidFromId(storage.Id))
            .map(vnetRule => (
            {
                id: shortId(storage.Id) + shortId(vnetRule.id),
                from: shortId(storage.Id),
                to: shortId(vnetRule.id),
                text: 'service endpoint'
            }
            ))).flat()
    
    
    const cosmosVnetRules: EdgeData[] = cosmosAccountData.filter(c => getRegionIdFromFriendlyName(c.Location).includes(configData.region))
            .map(cosmos => cosmos.Properties.virtualNetworkRules
                .filter(rule => getSubscriptionGuidFromId(rule.id) == getSubscriptionGuidFromId(cosmos.Id))
                .map(vnetRule => (
                {
                    id: shortId(cosmos.Id) + shortId(vnetRule.id),
                    from: shortId(cosmos.Id),
                    to: shortId(vnetRule.id),
                    text: 'service endpoint'
                }
                ))).flat()    
    
    
    
    
    const edgeData = [...vnetPeerings, ...loadBalancingPrivateVmss, ...loadBalancingPublicVmss, ...storageVnetRules, ...cosmosVnetRules]
    return edgeData
}
