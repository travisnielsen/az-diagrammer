import { EdgeData } from 'reaflow'
import { AzureData } from '../types/azure/AzureData'
import { DiagramConfiguration } from '../types/DiagramConfiguration'
import * as utils from '../utility/nodeUtils'

export const getEdgeData = (azureData: AzureData, config: DiagramConfiguration) => {

    const vnetPeerings: EdgeData[] = azureData.virtualNetworks.filter((vnet) => 
        vnet.SubscriptionId.includes(config.subscriptionId) &&
        vnet.Properties.virtualNetworkPeerings !== undefined &&
        vnet.Properties.virtualNetworkPeerings !== null)
        .map((vnet) => vnet.Properties.virtualNetworkPeerings?.map((peering) => (
            {
                id: peering.id,
                from: utils.shortId(peering.properties.remoteVirtualNetwork.id),
                to: utils.shortId(vnet.Id),
                className: 'edge-vnet-peering',
                text: 'peering',
                data: {
                    type: 'vnetpeering'
                }
            }
        ))).flat()
    
    const loadBalancingPrivateVmss: EdgeData[] = azureData.loadBalancers.filter((lb) => lb.Properties.frontendIPConfigurations[0].properties.subnet != null)
        .map(function (lb) {

            const ipconfigIds = lb.Properties.backendAddressPools?.map((bePool) =>
                bePool.properties.loadBalancerBackendAddresses?.map((beAddress) => {
                    return beAddress.properties.networkInterfaceIPConfiguration.id
                })).flat()
            
            const distinctIds = utils.getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + utils.shortId(id),
                    parent: utils.shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet?.id),
                    from: utils.shortId(lb.Id),
                    to: utils.shortId(id),
                    text: "load balancing",
                    data: {
                        type: 'loadbalancing'
                    }
                }
            ));
        }).flat()

    const loadBalancingPublicVmss: EdgeData[] = azureData.loadBalancers.filter((lb) => lb.Properties.frontendIPConfigurations[0].properties.publicIPAddress != null)
        .map(function (lb) {
            const ipconfigIds = lb.Properties.backendAddressPools?.map((bePool) =>
                bePool.properties.loadBalancerBackendAddresses?.map((beAddress) => {
                    return beAddress.properties.networkInterfaceIPConfiguration.id
                })).flat()
            
            const distinctIds = utils.getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + utils.shortId(id) + '-to-' + utils.shortId(lb.Id),
                    from: utils.shortId(id),
                    to: utils.shortId(lb.Id),
                    text: "load balancing",
                    data: {
                        type: 'loadbalancing'
                    }
                }
            ));
        }).flat()
    
    const storageVnetRules: EdgeData[] = azureData.storageAccounts
        .map((storage) => storage.Properties.networkAcls.virtualNetworkRules.filter((rule) => utils.getSubscriptionGuidFromId(rule.id) === utils.getSubscriptionGuidFromId(storage.Id))
            .map((vnetRule: { id: string | undefined; }) => (
                {
                    id: 'storage-serviceendpointrule-' + utils.shortId(vnetRule.id + "-to-" + utils.shortId(storage.Id)),
                    from: utils.shortId(vnetRule.id),
                    to: utils.shortId(storage.Id),
                    text: '',
                    data: {
                        type: 'serviceendpointrule'
                    }
                }
            ))).flat()
    
    
    // TODO: Need to fix the data model for cosmos accounts. Azure API version differences impact virtualNetworkRules and probably other settings
    /*
    const cosmosVnetRules: EdgeData[] = azureData.cosmosAccounts.map((cosmos) => cosmos.Properties.virtualNetworkRules
            .filter((rule: { id: string; }) => utils.getSubscriptionGuidFromId(rule.id) === utils.getSubscriptionGuidFromId(cosmos.Id))
            .map((vnetRule: { id: string | undefined; }) => (
                {
                    id: utils.shortId(vnetRule.id) + "-to-" + utils.shortId(cosmos.Id),
                    from: utils.shortId(vnetRule.id),
                    to: utils.shortId(cosmos.Id),
                    text: '',
                    data: {
                        type: 'serviceendpointrule'
                    }
                }
            ))
        ).flat()
    */
    
    const cosmosPrivateEndpointConnections: EdgeData[] = azureData.cosmosAccounts.filter((c) => c.Properties.privateEndpointConnections !== undefined)
        .map((cosmos) => cosmos.Properties.privateEndpointConnections?.map((pe) => (
        {
            id: utils.shortId(pe.id),
            from: utils.shortId(pe.properties.privateEndpoint.id),
                to: utils.shortId(cosmos.Id),
            className: 'edge-privateendpoint-connection',
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    const eventHubPrivateEndpointConnections: EdgeData[] = azureData.eventHubNamespaces.filter((eh) => eh.Properties.privateEndpointConnections !== undefined)
        .map((eh) => eh.Properties.privateEndpointConnections?.map((pe) => (
            {
                id: utils.shortId(pe.id),
                from: utils.shortId(pe.properties.privateEndpoint.id),
                to: utils.shortId(eh.Id),
                className: 'edge-privateendpoint-connection',
                text: '',
                data: {
                    type: 'privateendpoint-connection'
                }
            }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    const serviceBusPrivateEndpointConnections: EdgeData[] = azureData.serviceBusNamespaces.filter((sb) => sb.Properties.privateEndpointConnections !== undefined)
        .map((sb) => sb.Properties.privateEndpointConnections?.map((pe) => (
            {
                id: utils.shortId(pe.id),
                from: utils.shortId(pe.properties.privateEndpoint.id),
                to: utils.shortId(sb.Id),
                className: 'edge-privateendpoint-connection',
                text: '',
                data: {
                    type: 'privateendpoint-connection'
                    }
            }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    const keyVaultPrivateEndpointConnections = azureData.keyVaults.filter((kv) => kv.Properties.privateEndpointConnections !== undefined)
        .map((kv) => kv.Properties.privateEndpointConnections?.map((pe) => (
            {
                id: utils.shortId(pe.id),
                from: utils.shortId(pe.properties.privateEndpoint.id),
                to: utils.shortId(kv.Id),
                className: 'edge-privateendpoint-connection',
                text: '',
                data: {
                    type: 'privateendpoint-connection'
                    }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    const containerRegistryPrivateEndpointConnections = azureData.containerRegistries.filter((cr) => cr.Properties.privateEndpointConnections !== undefined)
        .map((cr) => cr.Properties.privateEndpointConnections?.map((pe) => (
            {
                id: utils.shortId(pe.id),
                from: utils.shortId(pe.properties.privateEndpoint.id),
                to: utils.shortId(cr.Id),
                className: 'edge-privateendpoint-connection',
                text: '',
                data: {
                    type: 'privateendpoint-connection'
                    }
            }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    const appServicePrivateEndpointConnections = azureData.appServices.filter((app) => app.Properties.privateEndpointConnections !== undefined)
        .map((app) => app.Properties.privateEndpointConnections?.map((pe) => (
            {
                id: utils.shortId(pe.id),
                from: utils.shortId(pe.properties.privateEndpoint.id),
                to: utils.shortId(app.Id),
                className: 'edge-privateendpoint-connection',
                text: '',
                data: {
                    type: 'privateendpoint-connection'
                    }
            }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];    
        
    const eventHubNetworkRules: EdgeData[] = azureData.eventHubNetworkRuleSets.map((ehruleset) => ehruleset.VirtualNetworkRule
        .filter((rule) => rule.SubnetId.includes(config.subscriptionId))
        .map((rule) => (
            {
                id: 'eventhub-serviceendpointrule-' + utils.shortId(rule.SubnetId) + '-to-' + utils.shortId(utils.getParentIdForRulesetId(ehruleset.Id)),
                from: utils.shortId(rule.SubnetId),
                to: utils.shortId(utils.getParentIdForRulesetId(ehruleset.Id)),
                text: '',
                data: {
                    type: 'serviceendpointrule'
                }
            }
        ))
    ).flat()
    
    const serviceBusNetworkRules: EdgeData[] = azureData.serviceBusNetworkRuleSets.map((sbruleset) => sbruleset.VirtualNetworkRule
        .filter((rule) => rule.SubnetId.includes(config.subscriptionId))
        .map((rule) => (
            {
                id: 'servicebus-serviceendpointrule-' + utils.shortId(rule.SubnetId) + '-to-' + utils.shortId(utils.getParentIdForRulesetId(sbruleset.Id)),
                from: utils.shortId(rule.SubnetId),
                to: utils.shortId(utils.getParentIdForRulesetId(sbruleset.Id)),
                text: '',
                data: {
                    type: 'serviceendpointrule'
                }
            }
        ))
    ).flat()
    
    const appServiceVnetIntegration: EdgeData[] = azureData.appServices.filter((s) => s.Properties.virtualNetworkSubnetId !== undefined)
        .map((appService) => (
            {
                id: utils.shortId(appService.Id) + '-to-' + utils.shortId(appService.Properties.virtualNetworkSubnetId),
                from: utils.shortId(appService.Properties.virtualNetworkSubnetId) + "-appServiceDelegation",
                to: utils.shortId(appService.Id),
                className: 'edge-appsvc-vnetintegration',
                data: {
                    type: 'vnetintegration'
                }
            }
        ))
    
    const expressRouteConnections: EdgeData[] = azureData.gatewayConnections
        .filter(c => c.Properties.connectionType === "ExpressRoute")
        .filter(c => utils.vnetGatewaysIdExistsInDiagram(c.Properties.virtualNetworkGateway1.id, azureData))
        .map((conn) => (
        {
            id: 'expressrouteconnection-' + utils.shortId(conn.Id),
            from: utils.shortId(conn.Properties.peer?.id),
            to: utils.shortId(conn.Properties.virtualNetworkGateway1.id),
            text: "Routing Weight: " + conn.Properties.routingWeight,
            className: 'edge-expressroute',
            data: {
                    type: 'expressroute'
            }
        }
    ))

    const expressRoutePeerings: EdgeData[] = azureData.gatewayConnections
        // TODO: Cannot assume tags are present. Need to move this to config or find another way to remove unwanted connections
        // .filter((c) => !hasTagFilterMatch(c.Tags.EnvType))
        .filter((c) => c.Properties.connectionType === "ExpressRoute")
        .filter((c) => c.Properties.peer !== undefined)
        .filter((v, i, a) => a.findIndex((t) => (t.Properties.peer?.id === v.Properties.peer?.id)) === i)
        .map((conn) => (
        {
                id: utils.shortId(conn.Properties.peer?.id) + "-to-peering-location",
                from: utils.getIdFromText(azureData.expressRouteCircuits.find((er: { Id }) => er.Id === conn.Properties.peer?.id)?.Properties.serviceProviderProperties.peeringLocation),
                to: utils.shortId(conn.Properties.peer?.id),
                text: '',
                className: 'edge-expressroute',
                data: {
                    type: 'expressroute'
                }
            }))
    
    const dnsConnections: EdgeData[] = utils.getVmsWithPrivateIp(azureData)
        .map((vm) => azureData.virtualNetworks
            .filter((vnet) => vnet.Properties.dhcpOptions?.dnsServers?.includes(vm.PrivateIpAddress || ''))
            .map((vnet) => (
        {
            id: utils.shortId(vm.Id) + "-to-" + utils.shortId(vnet.Id),
            from: utils.shortId(vm.Id),
            to: utils.shortId(vnet.Id),
            className: 'edge-dns',
            data: {
                type: 'dns'
                    }
        }))).flat()
    
    const privateDnsZoneLinks: EdgeData[] = azureData.privateDnsZoneLinks
        .filter((link) => utils.vnetIdIsInDiagram(link.Properties.virtualNetwork.id, azureData))
        .map((link) => (
        {
            id: utils.shortId(link.Id),
            from: utils.shortId(link.Id.split("/virtualNetworkLinks/")[0]),
            to: utils.shortId(link.Properties.virtualNetwork.id),
            className: 'edge-dns',
            data: {
                type: 'privatednszonelink'
            }
        }
    ))

    const dnsForwardingRulesetLinks: EdgeData[] = azureData.dnsForwardingRulesetLinks.map((link) => (
        {
            id: utils.shortId(link.Id),
            from: utils.shortId(link.Id.split("/virtualNetworkLinks/")[0]),
            to: utils.shortId(link.VirtualNetworkId),
            className: 'edge-dns',
            data: {
                type: 'dnsforwardingrulesetlink'
            }
        }
    ))

    const dnsResolverOutboundEndpointLinks: EdgeData[] = azureData.dnsForwardingRulesets.map((rs) => rs.Properties.dnsResolverOutboundEndpoints
        .map((ep) => (
            {
                id: utils.shortId(rs.Id) + "-to-" + utils.shortId(ep.id),
                from: utils.shortId(rs.Id),
                to: utils.shortId(ep.id),
                className: 'edge-dns-reverse',
                data: {
                    type: 'dnsresolveroutboundendpoint'
                }
            }
        ))).flat()
    
    const publicIpAddressLinks: EdgeData[] = azureData.publicIpAddresses
        .filter((ipAddress) => ipAddress.Properties.ipConfiguration !== undefined)
        .map((ip) => (
        {
            id: utils.shortId(ip.Id),
            from: utils.shortId(utils.getFromResourceIdforPublicIp(ip.Properties.ipConfiguration.id)),
            to: utils.shortId(ip.Id),
            className: 'edge-publicipaddress',
            data: {
                type: 'publicipaddress'
            }
        }
    ))

    const aksLinks: EdgeData[] = azureData.aksClusters.map((aks => aks.Properties.agentPoolProfiles.map(agentPool => {
        return {
            id: "akslink-" + agentPool.name + "-to-" + utils.shortId(aks.Id),
            from: utils.getAgentPoolShortIdFromSubnetId(agentPool.name, agentPool.vnetSubnetID, azureData),
            to: utils.shortId(aks.Id),
            className: 'edge-aks',
            data: {
                type: 'aks'
            }
        }
    }))).flat()

    const edgeData = [
        ...vnetPeerings, ...loadBalancingPrivateVmss, ...loadBalancingPublicVmss,
        ...cosmosPrivateEndpointConnections, ...eventHubPrivateEndpointConnections, ...serviceBusPrivateEndpointConnections,
        ...keyVaultPrivateEndpointConnections, ...containerRegistryPrivateEndpointConnections, ...appServicePrivateEndpointConnections,
        ...storageVnetRules, ...eventHubNetworkRules, ...serviceBusNetworkRules,
        ...appServiceVnetIntegration, ...expressRouteConnections, ...expressRoutePeerings,
        ...dnsConnections, ...privateDnsZoneLinks, ...dnsForwardingRulesetLinks, ...dnsResolverOutboundEndpointLinks,
        ...publicIpAddressLinks, ...aksLinks
    ]
    
    return edgeData
}