import { NodeData, EdgeData, NodeProps, ElkNodeLayoutOptions } from 'reaflow';
import vnetData from "./data/vnets.json"
import vmssData from "./data/virtualMachineScaleSets.json"
import databricksWorkspaceData from './data/workspaces.json'
import loadBalancerData from './data/loadBalancers.json'
import firewallData from './data/firewalls.json'
import vnetGatewayData from './data/vnetGateways.json'
import configData from "./config.json"


const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

const shortId = (s: string) => {
    const splitArr = s.split("/")
    return splitArr[splitArr.length -1]
}

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

    /*
    TODO: typescript issue here. not able to find properties
    const loadBalancers: NodeData[] = loadBalancerData.filter(lb => lb.Location.includes(configData.region)).map(lb => (
        {
            id: shortId(lb.Id),
            parent: shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: lb.Name,
                info: lb.Properties.frontendIPConfigurations[0].,
                url: 'images/Networking/loadbalancer.svg'
              }
        }
    ))
    */
    
    const firewalls: NodeData[] = firewallData.filter(fw => fw.Location.includes(configData.region)).map(fw => (
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

    const gateways: NodeData[] = vnetGatewayData.filter(gw => gw.Location.includes(configData.region)).map(gw => (
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


    
    const nodeData = [...vnets, ...subnets, ...vmScaleSets, ...dataBricksPublic, ...dataBricksPrivate, ...firewalls, ...gateways]

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

    const edgeData = [...vnetPeerings]
    return edgeData

}
