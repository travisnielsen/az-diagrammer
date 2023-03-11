import { NodeData, EdgeData } from 'reaflow';
import vnetData from "./data/vnets.json"
import configData from "./config.json"

export const nodeData = () => {

    const vnets: NodeData[] = vnetData.filter(vnet => vnet.Location.includes(configData.region)).map((vnet) => (
        {
            id: vnet.Id,
            height: 200,
            width: 300,
            layoutOptions: {
            'portConstraints': 'FREE',
            'elk.padding': '[top=150,left=25,bottom=25,right=25]',
            'elk.direction': 'RIGHT'
            },
            data: {
                type: 'container',
                label: vnet.Name,
                url: 'images/Networking/virtualnetwork.svg'
            }     
        }
        
    ))

    const subnets: NodeData[] = vnetData.filter(vnet => vnet.Location.includes(configData.region)).map(vnet => vnet.Properties.subnets.map(subnet => (
        {
            id: subnet.id,
            parent: vnet.Id,
            height: 200,
            width: 250,
            data: {
              type: 'container',
              label: subnet.name,
              url: 'images/Networking/subnet.svg'
            }
        }
    ))).flat()
    
    const nodeData = [...vnets, ...subnets]
    return nodeData
}

export const edgeData = () => {

    const vnetPeerings: EdgeData[] = vnetData.filter(vnet => vnet.Location.includes(configData.region) && vnet.SubscriptionId.includes(configData.subscriptionId))
        .map(vnet => vnet.Properties.virtualNetworkPeerings.map(peering => (
        {
            id: peering.id,
            from: vnet.Id,
            to: peering.properties.remoteVirtualNetwork.id,
            text: 'peering'
        }
    ))).flat()

    const edgeData = [...vnetPeerings]
    return edgeData

}
