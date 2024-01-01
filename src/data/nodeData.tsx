import { NodeData, ElkNodeLayoutOptions } from 'reaflow'
import { AzureData } from '../types/azure/AzureData'
import { LayoutZone } from '../types/LayoutZone'
// import { DiagramConfiguration } from '../types/DiagramConfiguration'
// import { DiagramNode } from '../types/DiagramNode'
import * as utils from '../utility/nodeUtils'

const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

export const getNodeData = (azureData: AzureData) => {
    
    const subnetIds = azureData.virtualNetworks.map((vnet) => vnet.Properties.subnets.map((subnet) => subnet.id)).flat()
    
    const vnets: NodeData[] = azureData.virtualNetworks.map((vnet) => (
        {
            id: utils.shortId(vnet.Id),
            // parent: 'private-network',
            height: 200,
            width: 750,
            className: 'node-container',
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                layoutZone: LayoutZone.NETWORKCORE,
                region: vnet.Location,
                servicename: 'vnet',
                label: vnet.Name,
                url: 'images/Networking/virtualnetwork.svg',
                info: vnet.Properties.addressSpace.addressPrefixes?.toString(),
                status: 'open'
            }
        }
    ))

    const subnets: NodeData[] = azureData.virtualNetworks.map((vnet) => vnet.Properties.subnets.map((subnet) => (
        {
            id: utils.shortId(subnet.id),
            parent: utils.shortId(vnet.Id),
            height: 120,
            width: 700,
            className: 'node-container',
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                region: vnet.Location,
                servicename: 'subnet',
                label: subnet.name,
                url: 'images/Networking/subnet.svg',
                info: subnet.properties.addressPrefix,
                status: 'open'
            }
        }
    ))).flat()

    const nsgs: NodeData[] = azureData.virtualNetworks.map((vnet: { Properties: { subnets }; }) => vnet.Properties.subnets
            .map((subnet) => azureData.networkSecurityGroups.filter((nsg: { Id }) => nsg.Id === subnet.properties.networkSecurityGroup?.id)
                .map((securityGroup) => (
                    {
                        id: utils.shortId(securityGroup.Id) + "-" + utils.shortId(subnet.id),
                        parent: utils.shortId(subnet.id),
                        height: 150,
                        width: 250,
                        data: {
                            type: 'service',
                            category: 'networking',
                            region: securityGroup.Location,
                            servicename: 'nsg',
                            label: securityGroup.Name,
                            url: 'images/Networking/nsg.svg',
                            info: securityGroup.Properties.securityRules?.length + " rules"
                        }
                    }
        )))).flat().flat()


    const routeTables: NodeData[] = azureData.virtualNetworks.map((vnet: { Properties: { subnets }; }) => vnet.Properties.subnets
        .map((subnet) => azureData.routeTables.filter((route: { Id }) => route.Id === subnet.properties.routeTable?.id)
            .map((rt) => (
            {
                id: utils.shortId(rt.Id),
                parent: utils.shortId(subnet.id),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'networking',
                    region: rt.Location,
                    servicename: 'routetable',
                    label: rt.Name,
                    url: 'images/Networking/routetable.svg',
                    info: rt.Properties.routes?.length + " routes"
                }
            }
            )))).flat().flat()
    
    // get virtual machines from virtualMachinesDns and matching networkinterface where networkinterface.virualmachine.id = virtualmachine.id
    const vmsDns: NodeData[] = azureData.virtualMachinesDns.map((vm) => (azureData.networkInterfaces.filter((ni) => ni.VirtualMachine?.id === vm.Id).map((ni) => (
        {
            id: utils.shortId(vm.Id),
            parent: utils.shortId(ni.IpConfigurations[0].Subnet.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'compute',
                region: vm.Location,
                servicename: 'virtualmachine-dns',
                label: vm.Name,
                info: vm.Properties.hardwareProfile.vmSize,
                url: 'images/Compute/virtualmachine.svg',
                ipAddressPrivate: ni.IpConfigurations[0].PrivateIpAddress
            }
        }
    )))).flat()


    const virtualMachines: NodeData[] = azureData.virtualMachines.map((vm) => (azureData.networkInterfaces.filter((ni) => ni.Properties.virtualMachine?.id.toLowerCase() === vm.Id.toLowerCase()).map((ni) => (
        {
            id: utils.shortId(vm.Id),
            parent: utils.shortId(ni.Properties?.ipConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'compute',
                region: vm.Location,
                servicename: 'virtualmachine',
                label: vm.Name,
                info: vm.Properties.hardwareProfile.vmSize,
                url: 'images/Compute/virtualmachine.svg',
                privateIpAddress: ni.Properties?.ipConfigurations[0].properties.privateIPAddress
            }
        }
    )))).flat()

    const vmScaleSets: NodeData[] = azureData.virtualMachineScaleSets.map((vmss) => (
        {
            id: utils.shortId(vmss.Id),
            parent: utils.shortId(vmss.Properties.virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].properties.ipConfigurations[0].properties.subnet.id),
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

    const dataBricksPublic: NodeData[] = azureData.databricksWorkspaces.map((workspace) => (
        {
            id: utils.shortId(workspace.Id) + "-public",
            parent: utils.shortId(workspace.Properties.parameters.customVirtualNetworkId.value + "/subnets/" + workspace.Properties.parameters.customPublicSubnetName.value),
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

    const dataBricksPrivate: NodeData[] = azureData.databricksWorkspaces.map((workspace) => (
        {
            id: utils.shortId(workspace.Id) + "-private",
            parent: utils.shortId(workspace.Properties.parameters.customVirtualNetworkId.value + "/subnets/" + workspace.Properties.parameters.customPrivateSubnetName.value),
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

    const redisCache: NodeData[] = azureData.redisCache.map((redis) => (
        {
            id: utils.shortId(redis.Id),
            parent: utils.shortId(redis.Properties.subnetId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'databases',
                region: utils.getRegionIdFromFriendlyName(redis.Location),
                servicename: 'rediscache',
                label: redis.Name,
                info: "SKU: " + redis.Properties.sku.name + " Capacity: " + redis.Properties.sku.capacity,
                url: 'images/Databases/rediscache.svg'
              }
        }
    ))

    const apiManagementInternal: NodeData[] = azureData.apiManagement.filter((a) => a.Properties.virtualNetworkType === "Internal").map((apim) => (
        {
            id: utils.shortId(apim.Id),
            parent: utils.shortId(apim.Properties.virtualNetworkConfiguration.subnetResourceId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'web',
                region: utils.getRegionIdFromFriendlyName(apim.Location),
                servicename: 'apimanagement',
                label: apim.Name,
                info: "SKU: " + apim.Sku?.Name + " Capacity: " + apim.Sku?.Capacity,
                url: 'images/Web/apimanagement.svg'
              }
        }
    ))


    // NOTE: Need to split load balancer source json due to schema differences between public and private configurations
    const loadBalancersPrivate: NodeData[] = azureData.loadBalancers.filter((lb) => lb.Properties.frontendIPConfigurations[0].properties.subnet != null).map((lb) => (
        {
            id: utils.shortId(lb.Id),
            parent: utils.shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet?.id),
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

    const loadBalancersPublic: NodeData[] = azureData.loadBalancers.filter((lb) => lb.Properties.frontendIPConfigurations[0].properties.publicIPAddress != null).map((lb) => (
        {
            id: utils.shortId(lb.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                layoutZone: LayoutZone.PAAS,
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
        /*
        .filter((fw) => targetFirewallIps.includes(fw.Properties.ipConfigurations[0].properties.privateIPAddress) && 
            !configData.excludeTagValues.includes(fw.Tags.EnvType))
        */
        // .filter((fw) => targetFirewallIps.includes(fw.Properties.ipConfigurations[0].properties.privateIPAddress))
        .map((firewall) => (
        {
            id: utils.shortId(firewall.Id),
            parent: utils.shortId( firewall.Properties.ipConfigurations[0].properties.subnet?.id ?? ""  ),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: firewall.Location,
                servicename: 'firewall',
                label: firewall.Name,
                privateIpAddress: firewall.Properties.ipConfigurations[0].properties.privateIPAddress,
                info: firewall.Properties.ipConfigurations[0].properties.privateIPAddress,
                url: 'images/Networking/firewall.svg',
              }
        }
    ))

    // const gateways: NodeData[] = azureData.vnetGateways.filter((g) => !hasTagFilterMatch(g.Tags.EnvType)).map((gw) => (
    const gateways: NodeData[] = azureData.vnetGateways.filter((g) => subnetIds.indexOf(g.Properties.ipConfigurations[0].properties.subnet.id) > -1).map((gw) => (
        {
            id: utils.shortId(gw.Id),
            parent: utils.shortId(gw.Properties.ipConfigurations[0].properties.subnet.id),
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

    const storageAccounts: NodeData[] = azureData.storageAccounts.map((storage) => (
        {
            id: utils.shortId(storage.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'storage',
                layoutZone: LayoutZone.PAAS,
                region: storage.Location,
                servicename: 'storage',
                label: storage.Name,
                info: storage.Sku?.Name,
                url: 'images/Storage/storage.svg'
              }          
        }
    ))

    const cosmosAccounts: NodeData[] = azureData.cosmosAccounts.map((cosmos) => (
        {
            id: utils.shortId(cosmos.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'databases',
                layoutZone: LayoutZone.PAAS,
                region: utils.getRegionIdFromFriendlyName(cosmos.Location),
                servicename: 'cosmosdb',
                label: cosmos.Name,
                info: cosmos.Properties.databaseAccountOfferType,
                url: 'images/Databases/cosmosdb.svg'
              }          
        }
    ))

    const eventHubClusters: NodeData[] = azureData.eventHubClusters.map((ehCluster) => (
        {
            id: utils.shortId(ehCluster.Id),
            // parent: 'paas',
            height: 200,
            width: 300,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'analytics',
                layoutZone: LayoutZone.PAAS,
                region: ehCluster.Location,
                servicename: 'eventhubcluster',
                label: ehCluster.Name,
                info: ehCluster.Sku?.Name + " Capacity: " + ehCluster.Sku?.Capacity,
                url: 'images/Analytics/eventhubcluster.svg'
              }          
        }
    ))

    const eventHuNamespacesDedicated: NodeData[] = azureData.eventHubNamespaces.filter((n) => (n.Properties.clusterArmId !== undefined && n.Properties.clusterArmId != null ) )
        .map((ehNamespace) => (
        {
            id: utils.shortId(ehNamespace.Id),
            parent: utils.shortId(ehNamespace.Properties.clusterArmId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                layoutZone: LayoutZone.PAAS,
                region: utils.getRegionIdFromFriendlyName(ehNamespace.Location),
                servicename: 'eventhub',
                label: ehNamespace.Name,
                info: ehNamespace.Sku?.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const eventHuNamespaces: NodeData[] = azureData.eventHubNamespaces.filter((n) => n.Properties.clusterArmId === undefined )
        .map((ehNamespace) => (
        {
            id: utils.shortId(ehNamespace.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                layoutZone: LayoutZone.PAAS,
                region: utils.getRegionIdFromFriendlyName(ehNamespace.Location),
                servicename: 'eventhub',
                label: ehNamespace.Name,
                info: ehNamespace.Sku?.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const serviceBusNamespaces: NodeData[] = azureData.serviceBusNamespaces.map((sbNamespace) => (
        {
            id: utils.shortId(sbNamespace.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'integration',
                layoutZone: LayoutZone.PAAS,
                region: utils.getRegionIdFromFriendlyName(sbNamespace.Location),
                servicename: 'servicebus',
                label: sbNamespace.Name,
                info: sbNamespace.Sku?.Name,
                url: 'images/Integration/servicebus.svg'
              }          
        }
        ))
    
    
    const appServicePlans: NodeData[] = azureData.appServicePlans.map((servicePlan) => (
            {
                id: utils.shortId(servicePlan.Id),
                height: 200,
                width: 300,
                layoutOptions: containerlayoutOptions,
                data: {
                    type: 'container',
                    category: 'compute',
                    layoutZone: LayoutZone.PAAS,
                    region: utils.getRegionIdFromFriendlyName(servicePlan.Location),
                    servicename: 'appserviceplan',
                    label: servicePlan.Name,
                    info: servicePlan.Properties.workerSize,
                    url: 'images/Compute/appserviceplan.svg'
                }          
            }
        ))
   
    const functionApps: NodeData[] = azureData.appServices.filter((s) => s.Kind.includes("functionapp"))
        .map((funcApp) => (
            {
                id: utils.shortId(funcApp.Id),
                parent: utils.shortId(funcApp.Properties.serverFarmId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'compute',
                    layoutZone: LayoutZone.PAAS,
                    region: utils.getRegionIdFromFriendlyName(funcApp.Location),
                    servicename: 'function',
                    label: funcApp.Name,
                    info: funcApp.Properties.sku,
                    url: 'images/Compute/function.svg'
                }          
            }
        ))
    
    const appServiceVnetIntegration: NodeData[] = azureData.appServices.filter((s) => s.Properties.virtualNetworkSubnetId !== undefined || s.Properties.virtualNetworkSubnetId !== null)
        .map((appService) => (
            {
                id: utils.shortId(appService.Properties.virtualNetworkSubnetId) + "-appServiceDelegation",
                parent: utils.shortId(appService.Properties.virtualNetworkSubnetId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'networking',
                    region: utils.getRegionIdFromFriendlyName(appService.Location),
                    servicename: 'networkinterface',
                    label: 'App Service Integration',
                    info: 'Outbound traffic from App Service to VNet',
                    url: 'images/Networking/networkinterface.svg'
                } 
            }
            )).filter((v: { id }, i, a) => a.findIndex((t: { id }) => (t.id === v.id)) === i)
    
    const privateEndpoints: NodeData[] = azureData.privateEndpoints.map((pe) => (
        {
            id: utils.shortId(pe.Id),
            parent: utils.shortId(pe.Properties.subnet.id),
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
            id: utils.shortId(er.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                layoutZone: LayoutZone.GLOBAL,
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
            id: utils.getIdFromText(er.Properties.serviceProviderProperties.peeringLocation),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                layoutZone: LayoutZone.EDGE,
                region: 'global',
                servicename: 'location',
                label: er.Properties.serviceProviderProperties.peeringLocation,
                info: er.Properties.serviceProviderProperties.serviceProviderName,
                url: 'images/location.svg'
            }
        }
    )).filter((v: { id }, i, a) => a.findIndex((t: { id }) => (t.id === v.id)) === i)

    const bastionHosts: NodeData[] = azureData.bastions.map((bastion) => (
        {
            id: utils.shortId(bastion.Id),
            parent: utils.shortId(bastion.Properties.ipConfigurations[0].properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: bastion.Location,
                servicename: 'bastion',
                label: bastion.Name,
                info: bastion.Sku?.Name,
                url: 'images/Networking/bastion.svg'
            }
        }
    ))

    const containerRegistries: NodeData[] = azureData.containerRegistries.map((registry) => (
        {
            id: utils.shortId(registry.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'compute',
                layoutZone: LayoutZone.PAAS,
                region: registry.Location,
                servicename: 'containerregistry',
                label: registry.Name,
                info: registry.Sku?.Name,
                url: 'images/Containers/containerregistry.svg'
            }
        }
    ))

    const keyVaults: NodeData[] = azureData.keyVaults.map((keyVault) => (
        {
            id: utils.shortId(keyVault.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'security',
                layoutZone: LayoutZone.PAAS,
                region: keyVault.Location,
                servicename: 'keyvault',
                label: keyVault.Name,
                info: keyVault.Properties.sku?.name,
                url: 'images/Security/keyvault.svg'
            }
        }
    ))

    const privateDnsZoneContainers: NodeData[] = (
        [
            {
                id: 'privatednszone-container',
                height: 150,
                width: 250,
                layoutOptions: containerlayoutOptions,
                data: {
                    type: 'container',
                    category: 'networking',
                    layoutZone: LayoutZone.GLOBAL,
                    region: 'global',
                    servicename: 'privatednszone-container',
                    label: 'Private DNS Zones',
                    url: 'images/Networking/dns.svg',
                    status: 'open'
                }
            }
        ]
    )

    const privateDnsZones: NodeData[] = azureData.privateDnsZones.map((dnsZone) => (
        {
            id: utils.shortId(dnsZone.Id),
            parent: 'privatednszone-container',
            height: 75,
            width: 350,
            data: {
                type: 'listitem',
                category: 'networking',
                layoutZone: LayoutZone.GLOBAL,
                region: dnsZone.Location,
                servicename: 'privatednszone',
                label: dnsZone.Name,
                info: dnsZone.Properties.numberOfRecordSets + " record sets",
            }
        }
    ))

    /*
    const dnsPrivateResolvers: NodeData[] = azureData.dnsResolvers.map((dnsResolver) => (
        {
            id: utils.shortId(dnsResolver.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                layoutZone: LayoutZone.NETWORKCORE,
                region: dnsResolver.Location,
                servicename: 'dnsprivateresolver',
                label: dnsResolver.Name,
                info: '',
                url: 'images/Networking/dnsprivateresolver.svg'
            }
        }
    ))
    */

    const dnsResolverOutboundEndpoints: NodeData[] = azureData.dnsResolverOutboundEndpoints.map((endpoint) => (
        {
            id: utils.shortId(endpoint.Id),
            parent: utils.shortId(endpoint.Properties.subnet.id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                region: endpoint.Location,
                servicename: 'dnsresolveroutboundendpoint',
                label: endpoint.Name,
                info: 'Outbound traffic for DNS queries',
                url: 'images/Networking/dnsprivateresolver.svg'
            }
        }
    ))

    const dnsForwardingRulesets: NodeData[] = azureData.dnsForwardingRulesets.map((ruleset) => (
        {
            id: utils.shortId(ruleset.Id),
            height: 150,
            width: 250,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                layoutZone: LayoutZone.NETWORKCORE,
                region: ruleset.Location,
                servicename: 'dnsforwardingruleset',
                label: ruleset.Name,
                url: 'images/Networking/dnsforwardingruleset.svg'
            }
        }
    ))

    const dnsForwardingRulesetRules: NodeData[] = azureData.dnsForwardingRulesetRules.map((rule) => (
        {
            id: utils.shortId(rule.Id),
            parent: utils.shortId(rule.Id.split("/forwardingRules/")[0]),
            height: 75,
            width: 300,
            data: {
                type: 'service',
                category: 'networking',
                layoutZone: LayoutZone.NETWORKCORE,
                region: '',
                servicename: 'dnsforwardingrulesetrule',
                label: rule.DomainName,
                info: `${rule.TargetDnsServer[0].IPAddress}:${rule.TargetDnsServer[0].Port}`,
                url: 'images/Networking/dnsforwardingrulesetrule.svg'
            }
        }
    ))

    const publicIpAddresses: NodeData[] = azureData.publicIpAddresses.map((ip) => (
        {
            id: utils.shortId(ip.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                layoutZone: LayoutZone.PAAS,
                region: ip.Location,
                servicename: 'publicipaddress',
                label: ip.Name,
                info: ip.Properties.publicIPAddressVersion,
                url: 'images/Networking/publicipaddress.svg'
            }
        }
    ))

    const aksInstances: NodeData[] = azureData.aksClusters.map((cluster) => (
        {
            id: utils.shortId(cluster.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'compute',
                layoutZone: LayoutZone.PAAS,
                region: cluster.Location,
                servicename: 'aks',
                label: cluster.Name,
                info: cluster.Properties.kubernetesVersion,
                url: 'images/Containers/kubernetesservice.svg'
            }
        }
    ))

    const nodeData = [
        ...vnets, ...subnets, ...nsgs, ...routeTables, ...vmsDns, ...virtualMachines, ...vmScaleSets,
        ...dataBricksPublic, ...dataBricksPrivate, ...loadBalancersPrivate, ...loadBalancersPublic, ...firewalls, ...gateways,
        ...storageAccounts, ...cosmosAccounts, ...eventHubClusters, ...eventHuNamespacesDedicated, ...eventHuNamespaces, ...serviceBusNamespaces, ...redisCache,
        ...apiManagementInternal, ...appServicePlans, ...functionApps, ...appServiceVnetIntegration, ...privateEndpoints, ...expressRoutes, ...peeringLocations,
        ...bastionHosts, ...containerRegistries, ...keyVaults,
        ...privateDnsZoneContainers, ...privateDnsZones, ...dnsForwardingRulesets, ...dnsForwardingRulesetRules, ...dnsResolverOutboundEndpoints,
        ...publicIpAddresses, ...aksInstances
    ]

    return nodeData
}

