import { NodeData, EdgeData, ElkNodeLayoutOptions } from 'reaflow'
import { AzureData } from '../types/azure/AzureData'
import { LayoutZone } from '../types/LayoutZone'
import { DiagramConfiguration, Tags } from '../types/DiagramConfiguration'
import { sha256 } from 'crypto-hash'

const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

// TODO: integrate this async code with synchronous calls from the rest of this code using promises
const hashValue = async (s: string) => {
    const hash = await sha256(s);
    return hash.slice(0, 10);
}

const shortId = (s: string | undefined | null) => {
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
        case ("North Central US"):
            return "northcentralus"
        default:
            return ""
    }
}

const hasTagFilterMatch = (s: string | undefined, excludeTagValues: Tags ) => {
    if (s === undefined) {
        return false
    }
    // TODO: need to solve for tag filtering
    // return excludeTagValues.includes(s)
}

const getVmsWithPrivateIp = (azureData: AzureData) => {
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

export const getNodeData = (azureData: AzureData, config: DiagramConfiguration) => {

    // TODO: remove duplicates from this arraoy
    const targetFirewallIps = azureData.routeTables
        .map((routeTable) => routeTable.Properties.routes?.filter((route) => route.properties.addressPrefix.includes("0.0.0.0/0"))
            .map((r: { properties: { nextHopIpAddress: any; }; }) => r.properties.nextHopIpAddress)).flat()
    
    const subnetIds = azureData.virtualNetworks.map((vnet) => vnet.Properties.subnets.map((subnet) => subnet.id)).flat()
    
    const vnets: NodeData[] = azureData.virtualNetworks.map((vnet) => (
        {
            id: shortId(vnet.Id),
            // parent: 'private-network',
            height: 200,
            width: 750,
            className: 'node-container',
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                tier: LayoutZone.NETWORKCORE,
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
            id: shortId(subnet.id),
            parent: shortId(vnet.Id),
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

    const nsgs: NodeData[] = azureData.virtualNetworks.map((vnet: { Properties: { subnets: any[]; }; }) => vnet.Properties.subnets
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
                            region: securityGroup.Location,
                            servicename: 'nsg',
                            label: securityGroup.Name,
                            url: 'images/Networking/nsg.svg',
                            info: securityGroup.Properties.securityRules?.length + " rules"
                        }
                    }
        )))).flat().flat()


    const routeTables: NodeData[] = azureData.virtualNetworks.map((vnet: { Properties: { subnets: any[]; }; }) => vnet.Properties.subnets
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
            id: shortId(vm.Id),
            parent: shortId(ni.IpConfigurations[0].Subnet.Id),
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
            id: shortId(vm.Id),
            parent: shortId(ni.Properties?.ipConfigurations[0].properties.subnet.id),
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
                ipAddressPrivate: ni.Properties?.ipConfigurations[0].properties.privateIPAddress
            }
        }
    )))).flat()


    
    const vmScaleSets: NodeData[] = azureData.virtualMachineScaleSets.map((vmss) => (
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

    const dataBricksPublic: NodeData[] = azureData.databricksWorkspaces.map((workspace) => (
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

    const dataBricksPrivate: NodeData[] = azureData.databricksWorkspaces.map((workspace) => (
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

    const redisCache: NodeData[] = azureData.redisCache.map((redis) => (
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

    const apiManagementInternal: NodeData[] = azureData.apiManagement.filter((a) => a.Properties.virtualNetworkType === "Internal").map((apim) => (
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
    const loadBalancersPrivate: NodeData[] = azureData.loadBalancers.filter((lb) => lb.Properties.frontendIPConfigurations[0].properties.subnet != null).map((lb) => (
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

    const loadBalancersPublic: NodeData[] = azureData.loadBalancers.filter((lb) => lb.Properties.frontendIPConfigurations[0].properties.publicIPAddress != null).map((lb) => (
        {
            id: shortId(lb.Id),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                tier: LayoutZone.PAAS,
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

    // const gateways: NodeData[] = azureData.vnetGateways.filter((g) => !hasTagFilterMatch(g.Tags.EnvType)).map((gw) => (
    const gateways: NodeData[] = azureData.vnetGateways.filter((g) => subnetIds.indexOf(g.Properties.ipConfigurations[0].properties.subnet.id) > -1).map((gw) => (
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

    const storageAccounts: NodeData[] = azureData.storageAccounts.map((storage) => (
        {
            id: shortId(storage.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'storage',
                tier: LayoutZone.PAAS,
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
            id: shortId(cosmos.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'databases',
                tier: LayoutZone.PAAS,
                region: getRegionIdFromFriendlyName(cosmos.Location),
                servicename: 'cosmosdb',
                label: cosmos.Name,
                info: cosmos.Properties.databaseAccountOfferType,
                url: 'images/Databases/cosmosdb.svg'
              }          
        }
    ))

    const eventHubClusters: NodeData[] = azureData.eventHubClusters.map((ehCluster) => (
        {
            id: shortId(ehCluster.Id),
            // parent: 'paas',
            height: 200,
            width: 300,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'analytics',
                tier: LayoutZone.PAAS,
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
            id: shortId(ehNamespace.Id),
            parent: shortId(ehNamespace.Properties.clusterArmId),
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                tier: LayoutZone.PAAS,
                region: getRegionIdFromFriendlyName(ehNamespace.Location),
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
            id: shortId(ehNamespace.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'analytics',
                tier: LayoutZone.PAAS,
                region: getRegionIdFromFriendlyName(ehNamespace.Location),
                servicename: 'eventhub',
                label: ehNamespace.Name,
                info: ehNamespace.Sku?.Name,
                url: 'images/Analytics/eventhub.svg'
              }          
        }
        ))
    
    const serviceBusNamespaces: NodeData[] = azureData.serviceBusNamespaces.map((sbNamespace) => (
        {
            id: shortId(sbNamespace.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'integration',
                tier: LayoutZone.PAAS,
                region: getRegionIdFromFriendlyName(sbNamespace.Location),
                servicename: 'servicebus',
                label: sbNamespace.Name,
                info: sbNamespace.Sku?.Name,
                url: 'images/Integration/servicebus.svg'
              }          
        }
        ))
    
    
    const appServicePlans: NodeData[] = azureData.appServicePlans.map((servicePlan) => (
            {
                id: shortId(servicePlan.Id),
                height: 200,
                width: 300,
                layoutOptions: containerlayoutOptions,
                data: {
                    type: 'container',
                    category: 'compute',
                    tier: LayoutZone.PAAS,
                    region: getRegionIdFromFriendlyName(servicePlan.Location),
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
                id: shortId(funcApp.Id),
                parent: shortId(funcApp.Properties.serverFarmId),
                height: 150,
                width: 250,
                data: {
                    type: 'service',
                    category: 'compute',
                    tier: LayoutZone.PAAS,
                    region: getRegionIdFromFriendlyName(funcApp.Location),
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
    
    const privateEndpoints: NodeData[] = azureData.privateEndpoints.map((pe) => (
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
                tier: LayoutZone.INGRESS,
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
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'networking',
                tier: LayoutZone.INGRESS,
                region: 'global',
                servicename: 'location',
                label: er.Properties.serviceProviderProperties.peeringLocation,
                info: er.Properties.serviceProviderProperties.serviceProviderName,
                url: 'images/location.svg'
            }
        }
    )).filter((v: { id: any; }, i: any, a: any[]) => a.findIndex((t: { id: any; }) => (t.id === v.id)) === i)

    const bastionHosts: NodeData[] = azureData.bastions.map((bastion) => (
        {
            id: shortId(bastion.Id),
            parent: shortId(bastion.Properties.ipConfigurations[0].properties.subnet.id),
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
            id: shortId(registry.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'compute',
                tier: LayoutZone.PAAS,
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
            id: shortId(keyVault.Id),
            // parent: 'paas',
            height: 150,
            width: 250,
            data: {
                type: 'service',
                category: 'security',
                tier: LayoutZone.PAAS,
                region: keyVault.Location,
                servicename: 'keyvault',
                label: keyVault.Name,
                info: keyVault.Properties.sku?.name,
                url: 'images/Security/keyvault.svg'
            }
        }
    ))

    const privateDnsZones: NodeData[] = azureData.privateDnsZones.map((dnsZone) => (
        {
            id: shortId(dnsZone.Id),
            height: 150,
            width: 400,
            data: {
                type: 'service',
                category: 'networking',
                tier: LayoutZone.HYBRID_CONNECTION,
                region: dnsZone.Location,
                servicename: 'privatednszone',
                label: dnsZone.Name,
                info: dnsZone.Properties.numberOfRecordSets + " record sets",
                url: 'images/Networking/dns.svg'
            }
        }
    ))

    const dnsForwardingRulesets: NodeData[] = azureData.dnsForwardingRulesets.map((ruleset) => (
        {
            id: shortId(ruleset.Id),
            height: 150,
            width: 250,
            layoutOptions: containerlayoutOptions,
            data: {
                type: 'container',
                category: 'networking',
                tier: LayoutZone.REGION,
                region: ruleset.Location,
                servicename: 'dnsforwardingruleset',
                label: ruleset.Name,
                url: 'images/Networking/dnsforwardingruleset.svg'
            }
        }
    ))

    const dnsForwardingRulesetRules: NodeData[] = azureData.dnsForwardingRulesetRules.map((rule) => (
        {
            id: shortId(rule.Id),
            parent: shortId(rule.Id.split("/forwardingRules/")[0]),
            height: 75,
            width: 300,
            data: {
                type: 'service',
                category: 'networking',
                tier: '',
                region: '',
                servicename: 'dnsforwardingrulesetrule',
                label: rule.DomainName,
                info: `${rule.TargetDnsServer[0].IPAddress}:${rule.TargetDnsServer[0].Port}`,
                url: 'images/Networking/dnsforwardingrulesetrule.svg'
            }
        }
    ))



    const nodeData = [
        ...vnets, ...subnets, ...nsgs, ...routeTables, ...vmsDns, ...virtualMachines, ...vmScaleSets,
        ...dataBricksPublic, ...dataBricksPrivate, ...loadBalancersPrivate, ...loadBalancersPublic, ...firewalls, ...gateways,
        ...storageAccounts, ...cosmosAccounts, ...eventHubClusters, ...eventHuNamespacesDedicated, ...eventHuNamespaces, ...serviceBusNamespaces, ...redisCache,
        ...apiManagementInternal, ...appServicePlans, ...functionApps, ...appServiceVnetIntegration, ...privateEndpoints, ...expressRoutes, ...peeringLocations,
        ...bastionHosts, ...containerRegistries, ...keyVaults,
        ...privateDnsZones, ...dnsForwardingRulesets, ...dnsForwardingRulesetRules
    ]

    return nodeData
}

export const getEdgeData = (azureData: AzureData, config: DiagramConfiguration) => {

    const vnetPeerings: EdgeData[] = azureData.virtualNetworks.filter((vnet) => 
        vnet.SubscriptionId.includes(config.subscriptionId) &&
        vnet.Properties.virtualNetworkPeerings !== undefined &&
        vnet.Properties.virtualNetworkPeerings !== null)
        .map((vnet) => vnet.Properties.virtualNetworkPeerings?.map((peering) => (
            {
                id: peering.id,
                from: shortId(peering.properties.remoteVirtualNetwork.id),
                to: shortId(vnet.Id),
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
            
            const distinctIds = getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + shortId(id),
                    parent: shortId(lb.Properties.frontendIPConfigurations[0].properties.subnet?.id),
                    from: shortId(lb.Id),
                    to: shortId(id),
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
            
            const distinctIds = getDistinctResourceIds(ipconfigIds)
            
            return distinctIds.map(id => (
                {
                    id: lb.Name + shortId(id) + '-to-' + shortId(lb.Id),
                    from: shortId(id),
                    to: shortId(lb.Id),
                    text: "load balancing",
                    data: {
                        type: 'loadbalancing'
                    }
                }
            ));
        }).flat()
    
    
    const storageVnetRules: EdgeData[] = azureData.storageAccounts
        .map((storage) => storage.Properties.networkAcls.virtualNetworkRules.filter((rule) => getSubscriptionGuidFromId(rule.id) === getSubscriptionGuidFromId(storage.Id))
            .map((vnetRule: { id: string | undefined; }) => (
                {
                    id: shortId(vnetRule.id + "-to-" + shortId(storage.Id)),
                    from: shortId(vnetRule.id),
                    to: shortId(storage.Id),
                    text: '',
                    data: {
                        type: 'serviceendpointrule'
                    }
                }
            ))).flat()
    
    
    // TODO: Need to fix the data model for cosmos accounts. Azure API version differences impact virtualNetworkRules and probably other settings
    /*
    const cosmosVnetRules: EdgeData[] = azureData.cosmosAccounts.map((cosmos) => cosmos.Properties.virtualNetworkRules
            .filter((rule: { id: string; }) => getSubscriptionGuidFromId(rule.id) === getSubscriptionGuidFromId(cosmos.Id))
            .map((vnetRule: { id: string | undefined; }) => (
                {
                    id: shortId(vnetRule.id) + "-to-" + shortId(cosmos.Id),
                    from: shortId(vnetRule.id),
                    to: shortId(cosmos.Id),
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
            id: shortId(pe.id),
            from: shortId(pe.properties.privateEndpoint.id),
            to: shortId(cosmos.Id),
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    
    const eventHubPrivateEndpointConnections: EdgeData[] = azureData.eventHubNamespaces.filter((eh) => eh.Properties.privateEndpointConnections !== undefined)
        .map((eh) => eh.Properties.privateEndpointConnections?.map((pe) => (
        {
            id: shortId(pe.id),
            from: shortId(pe.properties.privateEndpoint.id),
            to: shortId(eh.Id),
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    
    const serviceBusPrivateEndpointConnections: EdgeData[] = azureData.serviceBusNamespaces.filter((sb) => sb.Properties.privateEndpointConnections !== undefined)
        .map((sb) => sb.Properties.privateEndpointConnections?.map((pe) => (
        {
            id: shortId(pe.id),
            from: shortId(pe.properties.privateEndpoint.id),
            to: shortId(sb.Id),
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    
    const keyVaultPrivateEndpointConnections = azureData.keyVaults.filter((kv) => kv.Properties.privateEndpointConnections !== undefined)
        .map((kv) => kv.Properties.privateEndpointConnections?.map((pe) => (
        {
            id: shortId(pe.id),
            from: shortId(pe.properties.privateEndpoint.id),
            to: shortId(kv.Id),
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    
    const containerRegistryPrivateEndpointConnections = azureData.containerRegistries.filter((cr) => cr.Properties.privateEndpointConnections !== undefined)
        .map((cr) => cr.Properties.privateEndpointConnections?.map((pe) => (
        {
            id: shortId(pe.id),
            from: shortId(pe.properties.privateEndpoint.id),
            to: shortId(cr.Id),
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];
    
    
    const appServicePrivateEndpointConnections = azureData.appServices.filter((app) => app.Properties.privateEndpointConnections !== undefined)
        .map((app) => app.Properties.privateEndpointConnections?.map((pe) => (
        {
            id: shortId(pe.id),
            from: shortId(pe.properties.privateEndpoint.id),
            to: shortId(app.Id),
            text: '',
            data: {
                type: 'privateendpoint-connection'
                }
        }
        ))).flat().filter((data) => data !== undefined) as EdgeData[];    
    
    
        
    const eventHubNetworkRules: EdgeData[] = azureData.eventHubNetworkRuleSets.map((ehruleset) => ehruleset.VirtualNetworkRule
        .map((rule) => (
            {
                id: shortId(rule.SubnetId) + '-to-' + shortId(getParentIdForRulesetId(ehruleset.Id)),
                from: shortId(rule.SubnetId),
                to: shortId(getParentIdForRulesetId(ehruleset.Id)),
                text: '',
                data: {
                    type: 'serviceendpointrule'
                }
            }
        ))
    ).flat()
    
    const serviceBusNetworkRules: EdgeData[] = azureData.serviceBusNetworkRuleSets.map((sbruleset) => sbruleset.VirtualNetworkRule
        .map((rule) => (
            {
                id: shortId(rule.SubnetId) + '-to-' + shortId(getParentIdForRulesetId(sbruleset.Id)),
                from: shortId(rule.SubnetId),
                to: shortId(getParentIdForRulesetId(sbruleset.Id)),
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
                id: shortId(appService.Id) + '-to-' + shortId(appService.Properties.virtualNetworkSubnetId),
                from: shortId(appService.Properties.virtualNetworkSubnetId) + "-appServiceDelegation",
                to: shortId(appService.Id), 
                data: {
                    type: 'vnetintegration'
                }
            }
        ))
    
    const expressRouteConnections: EdgeData[] = azureData.gatewayConnections.filter(c => c.Properties.connectionType === "ExpressRoute").map((conn) => (
        {
            id: shortId(conn.Id),
            from: shortId(conn.Properties.peer?.id),
            to: shortId(conn.Properties.virtualNetworkGateway1.id),
            text: "Routing Weight: " + conn.Properties.routingWeight,
            data: {
                    type: 'expressroute'
            }
        }
    ))

    const expressRoutePeerings: EdgeData[] = azureData.gatewayConnections
        // TODO: Cannot assume tags are present. Need to move this to config or find another way to remove unwanted connections
        // .filter((c) => !hasTagFilterMatch(c.Tags.EnvType))
        .filter((v, i: any, a: any[]) => a.findIndex((t) => (t.Properties.peer?.id === v.Properties.peer?.id)) === i)
        .map((conn) => (
        {
                id: shortId(conn.Properties.peer?.id) + "-to-peering-location",
                from: getIdFromText(azureData.expressRouteCircuits.find((er: { Id: any; }) => er.Id === conn.Properties.peer?.id)?.Properties.serviceProviderProperties.peeringLocation),
                to: shortId(conn.Properties.peer?.id),
                text: '',
                data: {
                    type: 'expressroute'
                }
            }))
    
    const dnsConnections: EdgeData[] = getVmsWithPrivateIp(azureData)
        .map((vm) => azureData.virtualNetworks.filter((vnet) => vnet.Properties.dhcpOptions?.dnsServers?.includes(vm.PrivateIpAddress || ''))
            .map((vnet) => (
        {
            id: shortId(vm.Id) + "-to-" + shortId(vnet.Id),
            from: shortId(vm.Id),
            to: shortId(vnet.Id),
            text: 'dns',
            className: 'edge-dns',
            data: {
                type: 'dns'
            }
                }))).flat()
    
    
    const privateDnsZoneLinks: EdgeData[] = azureData.privateDnsZoneLinks.map((link) => (
        {
            id: shortId(link.Id),
            from: shortId(link.Id.split("/virtualNetworkLinks/")[0]),
            to: shortId(link.Properties.virtualNetwork.id),
            className: 'edge-dns',
            data: {
                type: 'privatednszonelink'
            }
        }
    ))

    const dnsForwardingRulesetLinks: EdgeData[] = azureData.dnsForwardingRulesetLinks.map((link) => (
        {
            id: shortId(link.Id),
            from: shortId(link.Id.split("/virtualNetworkLinks/")[0]),
            to: shortId(link.VirtualNetworkId),
            className: 'edge-dns',
            data: {
                type: 'dnsforwardingrulesetlink'
            }
        }
    ))


    const edgeData = [
        ...vnetPeerings, ...loadBalancingPrivateVmss, ...loadBalancingPublicVmss,
        ...cosmosPrivateEndpointConnections, ...eventHubPrivateEndpointConnections, ...serviceBusPrivateEndpointConnections,
        ...keyVaultPrivateEndpointConnections, ...containerRegistryPrivateEndpointConnections, ...appServicePrivateEndpointConnections,
        ...storageVnetRules, ...eventHubNetworkRules, ...serviceBusNetworkRules,
        ...appServiceVnetIntegration, ...expressRouteConnections, ...expressRoutePeerings,
        ...dnsConnections, ...privateDnsZoneLinks, ...dnsForwardingRulesetLinks
    ]
    
    return edgeData
}
