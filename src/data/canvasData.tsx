import { NodeData, EdgeData, ElkNodeLayoutOptions } from 'reaflow'
import configData from "../config.json"
import { AzureData } from '../types/azure/AzureData'

const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

const shortId = (s: string | undefined | null) => {
    if (s === undefined || s === null) {
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

const getDistinctResourceIds = (ipConfigs: (string | undefined)[] | undefined) => {
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

const getSubscriptionGuidFromId = (resourceId: string) => {
    const id = resourceId.split("/")[2]
    return id
}

const getRegionIdFromFriendlyName = (name: string) => {
    switch (name) {
        case ("Central US"):
            return "centralus"
        case ("East US2"):
            return "eastus2"
        case ("East US"):
            return "eastus"
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

export const getNodeData = (azureData: AzureData) => {

    // TODO: remove duplicates from this arraoy
    const targetFirewallIps = azureData.routeTables.filter((routeTable) => routeTable.Location.includes(configData.region))
        .map((routeTable) => routeTable.Properties.routes?.filter((route) => route.properties.addressPrefix.includes("0.0.0.0/0"))
        .map((r: { properties: { nextHopIpAddress: any; }; }) => r.properties.nextHopIpAddress)).flat()

    const vnets: NodeData[] = azureData.virtualNetworks.filter((vnet) => vnet.Location.includes(configData.region)).map((vnet) => (
        {
            id: shortId(vnet.Id),
            // parent: 'private-network',
            height: 200,
            width: 750,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                tier: 'private-network',
                region: vnet.Location,
                servicename: 'vnet',
                label: vnet.Name,
                url: 'images/Networking/virtualnetwork.svg',
                info: vnet.Properties.addressSpace.addressPrefixes?.toString(),
                status: 'open'
            }
        }
    ))

    const subnets: NodeData[] = azureData.virtualNetworks.filter((vnet) => vnet.Location.includes(configData.region)).map((vnet) => vnet.Properties.subnets.map((subnet) => (
        {
            id: shortId(subnet.id),
            parent: shortId(vnet.Id),
            height: 200,
            width: 700,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                tier: 'private-network',
                region: vnet.Location,
                servicename: 'subnet',
                label: subnet.name,
                url: 'images/Networking/subnet.svg',
                info: subnet.properties.addressPrefix,
                status: 'open'
            }
        }
    ))).flat()

    const nsgs: NodeData[] = azureData.virtualNetworks.filter((vnet) => vnet.Location.includes(configData.region))
        .map((vnet: { Properties: { subnets: any[]; }; }) => vnet.Properties.subnets
            .map((subnet) => azureData.networkSecurityGroups.filter((nsg: { Id: any; }) => nsg.Id === subnet.properties.networkSecurityGroup?.id)
                .map((securityGroup) => (
                    {
                        id: shortId(securityGroup.Id),
                        parent: shortId(subnet.id),
                        height: 150,
                        width: 250,
                        data: {
                            type: 'service',
                            category: 'networking',
                            tier: 'private-network',
                            region: securityGroup.Location,
                            servicename: 'nsg',
                            label: securityGroup.Name,
                            url: 'images/Networking/nsg.svg',
                            info: securityGroup.Properties.securityRules?.length + " rules"
                        }
                    }
        )))).flat().flat()


    const routeTables: NodeData[] = azureData.virtualNetworks.filter((vnet) => vnet.Location.includes(configData.region))
    .map((vnet: { Properties: { subnets: any[]; }; }) => vnet.Properties.subnets
        .map((subnet) => azureData.routeTables.filter((route: { Id: any; }) => route.Id === subnet.properties.routeTable?.id)
            .map((rt) => (
            {
                id: shortId(rt.Id),
                parent: shortId(subnet.id),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'networking',
                    tier: 'private-network',
                    region: rt.Location,
                    servicename: 'routetable',
                    label: rt.Name,
                    url: 'images/Networking/routetable.svg',
                    info: rt.Properties.routes?.length + " routes"
                }
            }
        )))).flat().flat()

    const vmScaleSets: NodeData[] = azureData.virtualMachineScaleSets.filter((vmss) => vmss.Location.includes(configData.region)).map((vmss) => (
        {
            id: shortId(vmss.Id),
            parent: shortId(vmss.Properties.virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].properties.ipConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'compute',
                region: vmss.Location,
                servicename: 'virtualmachinescaleset',
                label: vmss.Name,
                info: vmss.Properties.virtualMachineProfile.storageProfile.imageReference.publisher + " " + vmss.Properties.virtualMachineProfile.storageProfile.imageReference.version,
                url: 'images/Compute/virtualmachinescaleset.svg'
              }
        }
    ))

    const dataBricksPublic: NodeData[] = azureData.databricksWorkspaces.filter((workspace) => workspace.Location.includes(configData.region)).map((workspace) => (
        {
            id: shortId(workspace.Id) + "-public",
            parent: shortId(workspace.Properties.parameters.customVirtualNetworkId.value + "/subnets/" + workspace.Properties.parameters.customPublicSubnetName.value),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                region: workspace.Location,
                servicename: 'databricks',
                label: workspace.Name + " (Public)",
                info: workspace.Sku?.Name,
                url: 'images/Analytics/databricks.svg'
              }
        }
    ))

    const dataBricksPrivate: NodeData[] = azureData.databricksWorkspaces.filter((workspace) => workspace.Location.includes(configData.region)).map((workspace) => (
        {
            id: shortId(workspace.Id) + "-private",
            parent: shortId(workspace.Properties.parameters.customVirtualNetworkId.value + "/subnets/" + workspace.Properties.parameters.customPrivateSubnetName.value),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                region: workspace.Location,
                servicename: 'databricks',
                label: workspace.Name + " (Private)",
                info: workspace.Sku?.Name,
                url: 'images/Analytics/databricks.svg'
              }
        }
    ))

    const redisCache: NodeData[] = azureData.redisCache.filter((r) => getRegionIdFromFriendlyName(r.Location) === configData.region).map((redis) => (
        {
            id: shortId(redis.Id),
            parent: shortId(redis.Properties.subnetId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'databases',
                region: getRegionIdFromFriendlyName(redis.Location),
                servicename: 'rediscache',
                label: redis.Name,
                info: "SKU: " + redis.Properties.sku.name + " Capacity: " + redis.Properties.sku.capacity,
                url: 'images/Databases/rediscache.svg'
              }
        }
    ))

    const apiManagementInternal: NodeData[] = azureData.apiManagement.filter((a) => getRegionIdFromFriendlyName(a.Location) === configData.region && a.Properties.virtualNetworkType === "Internal")
        .map((apim) => (
        {
            id: shortId(apim.Id),
            parent: shortId(apim.Properties.virtualNetworkConfiguration.subnetResourceId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'web',
                region: getRegionIdFromFriendlyName(apim.Location),
                servicename: 'apimanagement',
                label: apim.Name,
                info: "SKU: " + apim.Sku?.Name + " Capacity: " + apim.Sku?.Capacity,
                url: 'images/Web/apimanagement.svg'
              }
        }
    ))


    // NOTE: Need to split load balancer source json due to schema differences between public and private configurations
    const loadBalancersPrivate: NodeData[] = azureData.loadBalancers.filter((lb) => lb.Location === configData.region && lb.Properties.frontendIPConfigurations[0].properties.subnet != null).map((lb) => (
        {
            id: shortId(lb.Id),
            parent: shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet?.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: lb.Location,
                servicename: 'loadbalancer',
                label: lb.Name,
                info: lb.Properties.frontendIPConfigurations[0].properties.privateIPAddress,
                url: 'images/Networking/loadbalancer.svg'
              }
        }
    ))

    const loadBalancersPublic: NodeData[] = azureData.loadBalancers.filter((lb) => lb.Location === configData.region && lb.Properties.frontendIPConfigurations[0].properties.publicIPAddress != null).map((lb) => (
        {
            id: shortId(lb.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: lb.Location,
                servicename: 'loadbalancer',
                label: lb.Name,
                info: "Public",
                url: 'images/Networking/loadbalancer.svg'
            }
        }
    ))
    
    const firewalls: NodeData[] = azureData.azureFirewalls
        // TODO: hard-coded tag name here (EnvType). Need to move this to config. 
        .filter((fw) => fw.Location.includes(configData.region) && targetFirewallIps.includes(fw.Properties.ipConfigurations[0].properties.privateIPAddress) && 
            !configData.excludeTagValues.includes(fw.Tags.EnvType))
        .map((firewall) => (
        {
            id: shortId(firewall.Id),
            parent: shortId( firewall.Properties.ipConfigurations[0].properties.subnet?.id ?? ""  ),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: firewall.Location,
                servicename: 'firewall',
                label: firewall.Name,
                info: firewall.Properties.ipConfigurations[0].properties.privateIPAddress,
                url: 'images/Networking/firewall.svg'
              }
        }
    ))

    const gateways: NodeData[] = azureData.vnetGateways.filter((g) => g.Location === configData.region && !hasTagFilterMatch(g.Tags.EnvType)).map((gw) => (
        {
            id: shortId(gw.Id),
            parent: shortId(gw.Properties.ipConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: gw.Location,
                servicename: 'vpngateway',
                label: gw.Name,
                info: gw.Properties.sku?.Name,
                url: 'images/Networking/vpngateway.svg'
              }          
        }
    ))

    const storageAccounts: NodeData[] = azureData.storageAccounts.filter((s) => s.Location === configData.region).map((storage) => (
        {
            id: shortId(storage.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'storage',
                region: storage.Location,
                servicename: 'storage',
                label: storage.Name,
                info: storage.Sku?.Name,
                url: 'images/Storage/storage.svg'
              }          
        }
    ))

    const cosmosAccounts: NodeData[] = azureData.cosmosAccounts.filter((c) => getRegionIdFromFriendlyName(c.Location) === configData.region).map((cosmos) => (
        {
            id: shortId(cosmos.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'databases',
                region: getRegionIdFromFriendlyName(cosmos.Location),
                servicename: 'cosmosdb',
                label: cosmos.Name,
                info: cosmos.Properties.databaseAccountOfferType,
                url: 'images/Databases/cosmosdb.svg'
              }          
        }
    ))

    const eventHubClusters: NodeData[] = azureData.eventHubClusters.filter((cluster) => cluster.Location === configData.region).map((ehCluster) => (
        {
            id: shortId(ehCluster.Id),
            // parent: 'paas',
            height: 200,
            width: 300,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'analytics',
                region: ehCluster.Location,
                servicename: 'eventhubcluster',
                label: ehCluster.Name,
                info: ehCluster.Sku?.Name + " Capacity: " + ehCluster.Sku?.Capacity,
                url: 'images/Analytics/eventhubcluster.svg'
              }          
        }
    ))

    const eventHuNamespacesDedicated: NodeData[] = azureData.eventHubNamespaces.filter((n) => getRegionIdFromFriendlyName(n.Location) === configData.region && (n.Properties.clusterArmId !== undefined && n.Properties.clusterArmId != null ) )
        .map((ehNamespace) => (
        {
            id: shortId(ehNamespace.Id),
            parent: shortId(ehNamespace.Properties.clusterArmId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                region: getRegionIdFromFriendlyName(ehNamespace.Location),
                servicename: 'eventhub',
                label: ehNamespace.Name,
                info: ehNamespace.Sku?.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const eventHuNamespaces: NodeData[] = azureData.eventHubNamespaces.filter((n) => getRegionIdFromFriendlyName(n.Location) === configData.region && n.Properties.clusterArmId === undefined )
        .map((ehNamespace) => (
        {
            id: shortId(ehNamespace.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                region: getRegionIdFromFriendlyName(ehNamespace.Location),
                servicename: 'eventhub',
                label: ehNamespace.Name,
                info: ehNamespace.Sku?.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const serviceBusNamespaces: NodeData[] = azureData.serviceBusNamespaces.filter((sb) => getRegionIdFromFriendlyName(sb.Location) === configData.region)
        .map((sbNamespace) => (
        {
            id: shortId(sbNamespace.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'integration',
                region: getRegionIdFromFriendlyName(sbNamespace.Location),
                servicename: 'servicebus',
                label: sbNamespace.Name,
                info: sbNamespace.Sku?.Name,
                url: 'images/Integration/servicebus.svg'
              }          
        }
        ))
    
    
    const appServicePlans: NodeData[] = azureData.appServicePlans.filter((p) => getRegionIdFromFriendlyName(p.Location) === configData.region)
        .map((servicePlan) => (
            {
                id: shortId(servicePlan.Id),
                height: 200,
                width: 300,
                layoutOptions: containerlayoutOptions,
                data: {
                    type: 'container',
                    category: 'compute',
                    region: getRegionIdFromFriendlyName(servicePlan.Location),
                    servicename: 'appserviceplan',
                    label: servicePlan.Name,
                    info: servicePlan.Properties.workerSize,
                    url: 'images/Compute/appserviceplan.svg'
                }          
            }
        ))
   
    const functionApps: NodeData[] = azureData.appServices.filter((s) => getRegionIdFromFriendlyName(s.Location) === configData.region && s.Kind === "functionapp")
        .map((funcApp) => (
            {
                id: shortId(funcApp.Id),
                parent: shortId(funcApp.Properties.serverFarmId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'compute',
                    region: getRegionIdFromFriendlyName(funcApp.Location),
                    servicename: 'function',
                    label: funcApp.Name,
                    info: funcApp.Properties.sku,
                    url: 'images/Compute/function.svg'
                }          
            }
        ))
    
    const appServiceVnetIntegration: NodeData[] = azureData.appServices.filter((s) => getRegionIdFromFriendlyName(s.Location) === configData.region && s.Properties.virtualNetworkSubnetId !== undefined || s.Properties.virtualNetworkSubnetId !== null)
        .map((appService) => (
            {
                id: shortId(appService.Properties.virtualNetworkSubnetId) + "-appServiceDelegation",
                parent: shortId(appService.Properties.virtualNetworkSubnetId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'networking',
                    region: getRegionIdFromFriendlyName(appService.Location),
                    servicename: 'networkinterface',
                    label: 'App Service Integration',
                    info: 'Outbound traffic from App Service to VNet',
                    url: 'images/Networking/networkinterface.svg'
                } 
            }
            )).filter((v: { id: any; }, i: any, a: any[]) => a.findIndex((t: { id: any; }) => (t.id === v.id)) === i)
    
    const privateEndpoints: NodeData[] = azureData.privateEndpoints.filter((p) => p.Location === configData.region).map((pe) => (
        {
            id: shortId(pe.Id),
            parent: shortId(pe.Properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: pe.Location,
                servicename: 'privatelink',
                label: pe.Name,
                info: "abc",
                url: 'images/Networking/privatelink.svg'
            }
        }    
        ))
        
    const expressRoutes: NodeData[] = azureData.expressRouteCircuits.map((er) => (
        {
            id: shortId(er.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: 'global',
                servicename: 'expressroutecircuit',
                label: er.Name,
                info: er.Sku?.Tier + " (" + er.Properties.serviceProviderProperties.bandwidthInMbps + " Mbps)",
                url: 'images/Networking/expressroutecircuit.svg'
            }
        }
    ))

    const peeringLocations: NodeData[] = azureData.expressRouteCircuits.map((er) => (
        {
            id: getIdFromText(er.Properties.serviceProviderProperties.peeringLocation),
            // parent: 'hybrid',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: 'global',
                servicename: 'location',
                label: er.Properties.serviceProviderProperties.peeringLocation,
                info: er.Properties.serviceProviderProperties.serviceProviderName,
                url: 'images/location.svg'
            }
        }
    )).filter((v: { id: any; }, i: any, a: any[]) => a.findIndex((t: { id: any; }) => (t.id === v.id)) === i)

    const nodeData = [...vnets, ...subnets, ...nsgs, ...routeTables, ...vmScaleSets, ...dataBricksPublic, ...dataBricksPrivate, ...loadBalancersPrivate, ...loadBalancersPublic, ...firewalls, ...gateways,
        ...storageAccounts, ...cosmosAccounts, ...eventHubClusters, ...eventHuNamespacesDedicated, ...eventHuNamespaces, ...serviceBusNamespaces, ...redisCache,
        ...apiManagementInternal, ...appServicePlans, ...functionApps, ...appServiceVnetIntegration, ...privateEndpoints, ...expressRoutes, ...peeringLocations]

    return nodeData
}

export const getEdgeData = (azureData: AzureData) => {

    const vnetPeerings: EdgeData[] = azureData.virtualNetworks.filter((vnet) => vnet.Location.includes(configData.region) &&
        vnet.SubscriptionId.includes(configData.subscriptionId) &&
        vnet.Properties.virtualNetworkPeerings !== undefined &&
        vnet.Properties.virtualNetworkPeerings !== null)
        .map((vnet) => vnet.Properties.virtualNetworkPeerings?.map((peering) => (
            {
                id: peering.id,
                from: shortId(peering.properties.remoteVirtualNetwork.id),
                to: shortId(vnet.Id),
                text: 'peering',
                data: {
                    type: 'vnet-peering'
                }
            }
        ))).flat()
    
    const loadBalancingPrivateVmss: EdgeData[] = azureData.loadBalancers.filter((lb) => lb.Location === configData.region && lb.Properties.frontendIPConfigurations[0].properties.subnet != null)
        .map(function (lb) {

            const ipconfigIds = lb.Properties.backendAddressPools?.map((bePool) =>
                bePool.properties.loadBalancerBackendAddresses?.map((beAddress) => {
                    return beAddress.properties.networkInterfaceIPConfiguration.id
                })).flat()
            
            const distinctIds = getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + shortId(id),
                    parent: shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet?.id),
                    from: shortId(lb.Id),
                    to: shortId(id),
                    text: "load balancing"
                }
            ));
        }).flat()

    
    const loadBalancingPublicVmss: EdgeData[] = azureData.loadBalancers.filter((lb) => lb.Location === configData.region && lb.Properties.frontendIPConfigurations[0].properties.publicIPAddress != null)
        .map(function (lb) {
            const ipconfigIds = lb.Properties.backendAddressPools?.map((bePool) =>
                bePool.properties.loadBalancerBackendAddresses?.map((beAddress) => {
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
    
    
    const storageVnetRules: EdgeData[] = azureData.storageAccounts.filter((s) => s.Location.includes(configData.region))
        .map((storage) => storage.Properties.networkAcls.virtualNetworkRules.filter((rule) => getSubscriptionGuidFromId(rule.id) === getSubscriptionGuidFromId(storage.Id))
            .map((vnetRule: { id: string | undefined; }) => (
                {
                    id: shortId(vnetRule.id + "-to-" + shortId(storage.Id)),
                    from: shortId(vnetRule.id),
                    to: shortId(storage.Id),
                    text: ''
                }
            ))).flat()
    
    
    const cosmosVnetRules: EdgeData[] = azureData.cosmosAccounts.filter((c: { Location: string; }) => getRegionIdFromFriendlyName(c.Location).includes(configData.region))
        .map((cosmos) => cosmos.Properties.virtualNetworkRules
            .filter((rule: { id: string; }) => getSubscriptionGuidFromId(rule.id) === getSubscriptionGuidFromId(cosmos.Id))
            .map((vnetRule: { id: string | undefined; }) => (
                {
                    id: shortId(vnetRule.id) + "-to-" + shortId(cosmos.Id),
                    from: shortId(vnetRule.id),
                    to: shortId(cosmos.Id),
                    text: ''
                }
            ))
        ).flat()
    
    const eventHubNetworkRules: EdgeData[] = azureData.eventHubNetworkRuleSets.map((ehruleset) => ehruleset.VirtualNetworkRule
        .map((rule) => (
            {
                id: shortId(rule.SubnetId) + '-to-' + shortId(getParentIdForRulesetId(ehruleset.Id)),
                from: shortId(rule.SubnetId),
                to: shortId(getParentIdForRulesetId(ehruleset.Id)),
                text: ''
            }
        ))
    ).flat()
    
    const serviceBusNetworkRules: EdgeData[] = azureData.serviceBusNetworkRuleSets.map((sbruleset) => sbruleset.VirtualNetworkRule
        .map((rule) => (
            {
                id: shortId(rule.SubnetId) + '-to-' + shortId(getParentIdForRulesetId(sbruleset.Id)),
                from: shortId(rule.SubnetId),
                to: shortId(getParentIdForRulesetId(sbruleset.Id)),
                text: ''
            }
        ))
    ).flat()
    
    const appServiceVnetIntegration: EdgeData[] = azureData.appServices.filter((s) => getRegionIdFromFriendlyName(s.Location) === configData.region && s.Properties.virtualNetworkSubnetId !== undefined)
        .map((appService) => (
            {
                id: shortId(appService.Id) + '-to-' + shortId(appService.Properties.virtualNetworkSubnetId),
                from: shortId(appService.Id),
                to: shortId(appService.Properties.virtualNetworkSubnetId),
                data: {
                    type: 'vnetintegration'
                }
            }
        ))
    
    const expressRouteConnections: EdgeData[] = azureData.gatewayConnections.filter((g: { Location: string; }) => g.Location === configData.region)
        .map((conn) => (
        {
            id: shortId(conn.Id),
            from: shortId(conn.Properties.peer?.id),
            to: shortId(conn.Properties.virtualNetworkGateway1.id),
            text: "Routing Weight: " + conn.Properties.routingWeight
        }
    ))

    // const expressRoutePeerings: EdgeData[] = expressRouteData.map(er => (
    const expressRoutePeerings: EdgeData[] = azureData.gatewayConnections
        .filter((c) => c.Location === configData.region && !hasTagFilterMatch(c.Tags.EnvType))
        .filter((v, i: any, a: any[]) => a.findIndex((t) => (t.Properties.peer?.id === v.Properties.peer?.id)) === i)
        .map((conn) => (
        {
                id: shortId(conn.Properties.peer?.id) + "-to-peering-location",
                from: getIdFromText(azureData.expressRouteCircuits.find((er: { Id: any; }) => er.Id === conn.Properties.peer?.id)?.Properties.serviceProviderProperties.peeringLocation),
                to: shortId(conn.Properties.peer?.id)
        }
    ))
    
    const edgeData = [...vnetPeerings, ...loadBalancingPrivateVmss, ...loadBalancingPublicVmss, ...storageVnetRules, ...cosmosVnetRules, ...eventHubNetworkRules, ...serviceBusNetworkRules,
        ...appServiceVnetIntegration, ...expressRouteConnections, ...expressRoutePeerings]
    
    return edgeData
}
