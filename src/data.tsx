import { NodeData, EdgeData, ElkNodeLayoutOptions } from 'reaflow';
import routeTableData from './data/routeTables.json'
import vnetData from "./data/vnets.json"
import vmssData from "./data/virtualMachineScaleSets.json"
import databricksWorkspaceData from './data/workspaces.json'
import loadBalancerPrivateData from './data/loadBalancersPrivate.json'
import loadBalancerPublicData from './data/loadBalancersPublic.json'
import firewallData from './data/firewalls.json'
import redisCacheData from './data/redis.json'
import apiMgmtData from './data/apiManagement.json'
import vnetGatewayData from './data/vnetGateways.json'
import storageAccountData from './data/storageAccounts.json'
import cosmosAccountData from './data/cosmosDbAccounts.json'
import eventHubClusterData from './data/eventHubClusters.json'
import eventHubNamespaceData from './data/eventHubNamespaces.json'
import eventHubNetworkRuleSetData from './data/eventHubNetworkRuleSets.json'
import serviceBusNamespacsData from './data/serviceBusNamespaces.json'
import serviceBusNetworkRuleSetData from './data/serviceBusNetworkRuleSets.json'
import appServicePlanData from './data/serverfarms.json'
import appServiceData from './data/sites.json'
import privateEndpointData from './data/privateEndpoints.json'
import expressRouteData from './data/expressRouteCircuits.json'
import gatewayConnectionData from './data/gatewayConnections.json'


import configData from "./config.json"

const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

const shortId = (s: string | undefined) => {
    if (s === undefined) {
        return ""
    }
    const splitArr = s.split("/")
    const resourceGroup = splitArr[4].replace(/_/g, "").replace(/-/g, "").toLowerCase()
    const item = splitArr[splitArr.length -1].replace(/_/g, "").replace(/-/g, "").toLowerCase()
    return resourceGroup + "-" + item
}

const idFromNetworkIpconfig = (s: string) => {
    const id = s.split("/virtualMachines/")[0]
    return id
}

const getIdFromText = (s: string | undefined) => {
    if (s === undefined) {
        return ""
    }
    const id = s.replace(/_/g, "").replace(/ /g, "").toLowerCase()
    return id
}

const getParentIdForRulesetId = (s: string) => {
    const id = s.split("/networkRuleSets/")[0]
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

const hasTagFilterMatch = (s: string | undefined) => {
    if (s === undefined) {
        return false
    }
    return configData.excludeTagValues.includes(s)
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

    const redisCache: NodeData[] = redisCacheData.filter(r => getRegionIdFromFriendlyName(r.Location) === configData.region).map(redis => (
        {
            id: shortId(redis.Id),
            parent: shortId(redis.Properties.subnetId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: redis.Name,
                info: "SKU: " + redis.Properties.sku.name + " Capacity: " + redis.Properties.sku.capacity,
                url: 'images/Databases/rediscache.svg'
              }
        }
    ))

    const apiManagementInternal: NodeData[] = apiMgmtData.filter(a => getRegionIdFromFriendlyName(a.Location) === configData.region && a.Properties.virtualNetworkType === "Internal")
        .map(apim => (
        {
            id: shortId(apim.Id),
            parent: shortId(apim.Properties.virtualNetworkConfiguration.subnetResourceId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: apim.Name,
                info: "SKU: " + apim.Sku.Name + " Capacity: " + apim.Sku.Capacity,
                url: 'images/Web/apimanagement.svg'
              }
        }
    ))


    // NOTE: Need to split load balancer source json due to schema differences between public and private configurations
    const loadBalancersPrivate: NodeData[] = loadBalancerPrivateData.filter(lb => lb.Location === configData.region).map(lb => (
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

    const loadBalancersPublic: NodeData[] = loadBalancerPublicData.filter(lb => lb.Location === configData.region).map(lb => (
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
            !configData.excludeTagValues.includes(fw.Tags.EnvType))
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

    const gateways: NodeData[] = vnetGatewayData.filter(g => g.Location === configData.region && !hasTagFilterMatch(g.Tags.EnvType)).map(gw => (
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

    const storageAccounts: NodeData[] = storageAccountData.filter(s => s.Location === configData.region).map(storage => (
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

    const cosmosAccounts: NodeData[] = cosmosAccountData.filter(c => getRegionIdFromFriendlyName(c.Location) === configData.region).map(cosmos => (
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

    const eventHubClusters: NodeData[] = eventHubClusterData.filter(cluster => cluster.Location === configData.region).map(ehCluster => (
        {
            id: shortId(ehCluster.Id),
            height: 200,
            width: 300,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                label: ehCluster.Name,
                info: ehCluster.Sku.Name + " Capacity: " + ehCluster.Sku.Capacity,
                url: 'images/Analytics/eventhubcluster.svg'
              }          
        }
    ))

    const eventHuNamespacesDedicated: NodeData[] = eventHubNamespaceData.filter(n => getRegionIdFromFriendlyName(n.Location) === configData.region && (n.Properties.clusterArmId !== undefined && n.Properties.clusterArmId != null ) )
        .map(ehNamespace => (
        {
            id: shortId(ehNamespace.Id),
            parent: shortId(ehNamespace.Properties.clusterArmId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: ehNamespace.Name,
                info: ehNamespace.Sku.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const eventHuNamespaces: NodeData[] = eventHubNamespaceData.filter(n => getRegionIdFromFriendlyName(n.Location) === configData.region && n.Properties.clusterArmId === undefined )
        .map(ehNamespace => (
        {
            id: shortId(ehNamespace.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: ehNamespace.Name,
                info: ehNamespace.Sku.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const serviceBusNamespaces: NodeData[] = serviceBusNamespacsData.filter(sb => getRegionIdFromFriendlyName(sb.Location) === configData.region)
        .map(sbNamespace => (
        {
            id: shortId(sbNamespace.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: sbNamespace.Name,
                info: sbNamespace.Sku.Name,
                url: 'images/Integration/servicebus.svg'
              }          
        }
        ))
    
    
    const appServicePlans: NodeData[] = appServicePlanData.filter(p => getRegionIdFromFriendlyName(p.Location) === configData.region)
        .map(servicePlan => (
            {
                id: shortId(servicePlan.Id),
                layoutOptions: containerlayoutOptions,
                height: 200,
                width: 300,
                data: {
                    type: 'container',
                    label: servicePlan.Name,
                    info: servicePlan.Properties.workerSize,
                    url: 'images/Compute/appserviceplan.svg'
                }          
            }
        ))
   
    const functionApps: NodeData[] = appServiceData.filter(s => getRegionIdFromFriendlyName(s.Location) === configData.region && s.Kind === "functionapp")
        .map(funcApp => (
            {
                id: shortId(funcApp.Id),
                parent: shortId(funcApp.Properties.serverFarmId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    label: funcApp.Name,
                    info: funcApp.Properties.sku,
                    url: 'images/Compute/function.svg'
                }          
            }
        ))
    
    const appServiceVnetIntegration: NodeData[] = appServiceData.filter(s => getRegionIdFromFriendlyName(s.Location) === configData.region && s.Properties.virtualNetworkSubnetId !== undefined)
        .map(appService => (
            {
                id: shortId(appService.Properties.virtualNetworkSubnetId) + "-appServiceDelegation",
                parent: shortId(appService.Properties.virtualNetworkSubnetId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    label: 'App Service Integration',
                    info: 'Outbound traffic from App Service to VNet',
                    url: 'images/Networking/networkinterface.svg'
                } 
            }
            )).filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
    
    const privateEndpoints: NodeData[] = privateEndpointData.filter(p => p.Location === configData.region).map(pe => (
        {
            id: shortId(pe.Id),
            parent: shortId(pe.Properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: pe.Name,
                info: "abc",
                url: 'images/Networking/privatelink.svg'
            }
        }    
        ))
        
    const expressRoutes: NodeData[] = expressRouteData.map(er => (
        {
            id: shortId(er.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: er.Name,
                info: er.Sku.Tier + " (" + er.Properties.serviceProviderProperties.bandwidthInMbps + " Mbps)",
                url: 'images/Networking/expressroutecircuit.svg'
            }
        }
    ))

    const peeringLocations: NodeData[] = expressRouteData.map(er => (
        {
            id: getIdFromText(er.Properties.serviceProviderProperties.peeringLocation),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                label: er.Properties.serviceProviderProperties.peeringLocation,
                info: er.Properties.serviceProviderProperties.serviceProviderName,
                url: 'images/location.svg'
            }
        }
    )).filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)

    const nodeData = [...vnets, ...subnets, ...vmScaleSets, ...dataBricksPublic, ...dataBricksPrivate, ...loadBalancersPrivate, ...loadBalancersPublic, ...firewalls, ...gateways,
        ...storageAccounts, ...cosmosAccounts, ...eventHubClusters, ...eventHuNamespacesDedicated, ...eventHuNamespaces, ...serviceBusNamespaces, ...redisCache,
        ...apiManagementInternal, ...appServicePlans, ...functionApps, ...appServiceVnetIntegration, ...privateEndpoints, ...expressRoutes, ...peeringLocations]

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
    
    const loadBalancingPrivateVmss: EdgeData[] = loadBalancerPrivateData.filter(lb => lb.Location === configData.region)
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

    
    const loadBalancingPublicVmss: EdgeData[] = loadBalancerPublicData.filter(lb => lb.Location === configData.region)
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
            .filter(rule => getSubscriptionGuidFromId(rule.id) === getSubscriptionGuidFromId(storage.Id))
            .map(vnetRule => (
                {
                    id: shortId(storage.Id) + "-to-" + shortId(vnetRule.id),
                    from: shortId(storage.Id),
                    to: shortId(vnetRule.id),
                    text: ''
                }
            ))).flat()
    
    
    const cosmosVnetRules: EdgeData[] = cosmosAccountData.filter(c => getRegionIdFromFriendlyName(c.Location).includes(configData.region))
        .map(cosmos => cosmos.Properties.virtualNetworkRules
            .filter(rule => getSubscriptionGuidFromId(rule.id) === getSubscriptionGuidFromId(cosmos.Id))
            .map(vnetRule => (
                {
                    id: shortId(cosmos.Id) + "-to-" + shortId(vnetRule.id),
                    from: shortId(cosmos.Id),
                    to: shortId(vnetRule.id),
                    text: ''
                }
            ))
        ).flat()
    
    const eventHubNetworkRules: EdgeData[] = eventHubNetworkRuleSetData
        .map(ehruleset => ehruleset.VirtualNetworkRules
            .map(rule => (
                {
                    id: shortId(getParentIdForRulesetId(ehruleset.Id)) + '-to-' + shortId(rule.Subnet.Id),
                    from: shortId(getParentIdForRulesetId(ehruleset.Id)),
                    to: shortId(rule.Subnet.Id),
                    text: ''
                }
            ))
        ).flat()
    
    
    const serviceBusNetworkRules: EdgeData[] = serviceBusNetworkRuleSetData
        .map(sbruleset => sbruleset.VirtualNetworkRules
            .map(rule => (
                {
                    id: shortId(getParentIdForRulesetId(sbruleset.Id)) + '-to-' + shortId(rule.Subnet.Id),
                    from: shortId(getParentIdForRulesetId(sbruleset.Id)),
                    to: shortId(rule.Subnet.Id),
                    text: ''
                }
            ))
        ).flat()
    
    const appServiceVnetIntegration: EdgeData[] = appServiceData.filter(s => getRegionIdFromFriendlyName(s.Location) === configData.region && s.Properties.virtualNetworkSubnetId !== undefined)
        .map(appService => (
            {
                id: shortId(appService.Id) + '-to-' + shortId(appService.Properties.virtualNetworkSubnetId),
                from: shortId(appService.Properties.virtualNetworkSubnetId) + "-appServiceDelegation",
                to: shortId(appService.Id),
                text: 'VNET integration'
            }
        ))
    
    const expressRouteConnections: EdgeData[] = gatewayConnectionData.filter(g => g.Location === configData.region).map(conn => (
        {
            id: shortId(conn.Id),
            from: shortId(conn.Properties.virtualNetworkGateway1.id),
            to: shortId(conn.Properties.peer?.id),
            text: "Routing Weight: " + conn.Properties.routingWeight
        }
    ))

    // const expressRoutePeerings: EdgeData[] = expressRouteData.map(er => (
    const expressRoutePeerings: EdgeData[] = gatewayConnectionData
        .filter(c => c.Location === configData.region && !hasTagFilterMatch(c.Tags.EnvType))
        .filter((v, i, a) => a.findIndex(t => (t.Properties.peer?.id === v.Properties.peer?.id)) === i)
        .map(conn => (
        {
            id: shortId(conn.Properties.peer?.id) + "-to-peering-location",
            from: shortId(conn.Properties.peer?.id),
            to: getIdFromText(expressRouteData.find(er => er.Id === conn.Properties.peer?.id)?.Properties.serviceProviderProperties.peeringLocation)
        }
    ))
    
    const edgeData = [...vnetPeerings, ...loadBalancingPrivateVmss, ...loadBalancingPublicVmss, ...storageVnetRules, ...cosmosVnetRules, ...eventHubNetworkRules, ...serviceBusNetworkRules,
        ...appServiceVnetIntegration, ...expressRouteConnections, ...expressRoutePeerings]
    
    return edgeData
}
