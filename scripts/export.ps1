param (
    [Parameter(Mandatory=$true, HelpMessage="Enter the name of the configuration file")]
    [string]$configFile
)

# install DNS Resolver module
Install-Module -Name Az.DnsResolver -Force

# get connection context
$contextInfo = Get-Content $configFile | ConvertFrom-Json
Connect-AzAccount -Tenant $contextInfo.tenantId
$azContext = Get-AzContext
$outFolder = "..//data/" + $contextInfo.subscriptionName
$listSubscriptions = New-Object -TypeName 'System.Collections.ArrayList'

if ($null -eq $azContext) {
    Connect-AzAccount -Subscription $contextInfo.subscriptionName -Tenant $contextInfo.tenantId
    $listSubscriptions.Add($contextInfo.subscriptionName)
} else {
    Set-AzContext -Subscription $contextInfo.subscriptionName
    $listSubscriptions.Add($contextInfo.subscriptionName)
}

# get subscription vnet info and save
$listVnets = New-Object -TypeName 'System.Collections.ArrayList'
$vnets = Get-AzResource -ResourceType "Microsoft.Network/virtualNetworks" -ExpandProperties
$vnets | ForEach-Object { $listVnets.Add($_) }

# add peered vnets from other subscriptions

$listRemoteVnetIds = New-Object -TypeName 'System.Collections.ArrayList'

foreach ($vnet in $vnets) {
    $peerings = $vnet.Properties.virtualNetworkPeerings
    if ($peerings.length -gt 0 ) {
        foreach ($peering in $peerings) {
            $remoteNetworkId = $peering.Properties.remoteVirtualNetwork.id

            if ($listRemoteVnetIds -notcontains $remoteNetworkId) {
                $listRemoteVnetIds.Add($remoteNetworkId)
            }
        }
    }
}

foreach ($vnetId in $listRemoteVnetIds) {
    $remoteNetworksubscriptionName = $vnetId.split("/")[2]
    $currentContext = Get-AzContext

    if ($remoteNetworksubscriptionName -ne $currentContext.Subscription.Id ) {
        Set-AzContext -Subscription $remoteNetworksubscriptionName
        $listSubscriptions.Add($remoteNetworksubscriptionName)
    }

    $remoteVnet = Get-AzResource -ResourceId $vnetId -ExpandProperties
    $listVnets.Add($remoteVnet)
}

$listDnsServerIps = New-Object -TypeName 'System.Collections.ArrayList'

# get DNS server IPs for each vnet
foreach ($vnet in $listVnets) {
    $dnsServers = $vnet.Properties.dhcpOptions.dnsServers
    foreach ($serverIp in $dnsServers) {
        if ($listDnsServerIps -notcontains $serverIp) {
            $listDnsServerIps.Add($serverIp)
        }
    }
}

# identify other subscriptions based on VNET Gateway Connection objects
# ExpressRoute circuits are often placed in separate / isolated subscriptions

$listGatewayConnections = New-Object -TypeName 'System.Collections.ArrayList'

foreach ($subscription in $listSubscriptions | Select-Object -Unique) {
    Set-AzContext -Subscription $subscription
    Get-AzResource -ResourceType "Microsoft.Network/connections" -ExpandProperties | ForEach-Object { $listGatewayConnections.Add($_) }

    foreach ($connection in $listGatewayConnections) {
        $connectionPeerId = $connection.properties.peer.id

        # Only concerned about ER circuits in isolated subscriptions

        if ($connectionPeerId) {
            $connectionPeerSubscriptionId = $connectionPeerId.Split("/")[2]
            if ($subscriptions -notcontains $connectionPeerSubscriptionId) {
                $listSubscriptions.Add($connectionPeerSubscriptionId)
            }
        }
    }
}

$subscriptions = $listSubscriptions | Select-Object -Unique
$listSubscriptionInfo = New-Object -TypeName 'System.Collections.ArrayList'
$listRouteTables = New-Object -TypeName 'System.Collections.ArrayList'
$listFirewalls = New-Object -TypeName 'System.Collections.ArrayList'
$listNatGateways = New-Object -TypeName 'System.Collections.ArrayList'
$listVnetGateways = New-Object -TypeName 'System.Collections.ArrayList'
$listExpressRouteCircuits = New-Object -TypeName 'System.Collections.ArrayList'
$listDnsVmNics = New-Object -TypeName 'System.Collections.ArrayList'
$listDnsServers = New-Object -TypeName 'System.Collections.ArrayList'

foreach ($subscription in $subscriptions) {
    Set-AzContext -Subscription $subscription
    $context = Get-AzContext
    $listSubscriptionInfo.Add($context.Subscription)

    foreach ($serverIp in $listDnsServerIps) {
        $nic = Get-AzNetworkInterface | Where-Object { $_.ipConfigurations.PrivateIpAddress -eq $serverIp }
        if ($nic) {
            $vmId = $nic.virtualMachine.id
            $vm = Get-AzResource -ResourceId $vmId -ExpandProperties
            $nicStandardExport = Get-AzResource -ResourceId $nic.id -ExpandProperties
            $listDnsServers.Add($vm)
            $listDnsVmNics.Add($nicStandardExport)
        }
        
    }

    Get-AzResource -ResourceType "Microsoft.Network/routeTables" -ExpandProperties | ForEach-Object { $listRouteTables.Add($_) }
    Get-AzResource -ResourceType "Microsoft.Network/azureFirewalls" -ExpandProperties | ForEach-Object { $listFirewalls.Add($_) }
    Get-AzResource -ResourceType "Microsoft.Network/natGateways" -ExpandProperties | ForEach-Object { $listNatGateways.Add($_) }
    Get-AzResource -ResourceType "Microsoft.Network/virtualNetworkGateways" -ExpandProperties | ForEach-Object { $listVnetGateways.Add($_) }
    Get-AzResource -ResourceType "Microsoft.Network/expressRouteCircuits" -ExpandProperties | ForEach-Object { $listExpressRouteCircuits.Add($_) }
}

#
# Azure services (Compute, Data, Storage, etc...)
#

Set-AzContext -Subscription $contextInfo.subscriptionName
$services = $contextInfo.services
$dictServices = @{}

foreach ($service in $services) {
    $items = Get-AzResource -ResourceType "${service}" -ExpandProperties
    # $dictServices.add( $service, $items)

    # get vnet links for DNS forwarding rulesets
    if ($service -eq "Microsoft.Network/dnsForwardingRulesets") {

        $dnsForwardingRuleSetRules = New-Object -TypeName 'System.Collections.ArrayList'
        $dnsForwardingRulesetLinks = New-Object -TypeName 'System.Collections.ArrayList'

        foreach ($dnsForwardingRuleset in $items) {
            $dnsForwardingRules = Get-AzDnsForwardingRulesetForwardingRule -DnsForwardingRulesetName $dnsForwardingRuleset.Name -ResourceGroupName $dnsForwardingRuleset.ResourceGroupName
            $dnsForwardingRuleSetRules.Add($dnsForwardingRules)

            Get-AzDnsForwardingRulesetVirtualNetworkLink -DnsForwardingRulesetName $dnsForwardingRuleset.Name -ResourceGroupName $dnsForwardingRuleset.ResourceGroupName | ForEach-Object { $dnsForwardingRulesetLinks.Add($_) }
        }

        $dictServices.add("Microsoft.Network/dnsForwardingRulesets", $items)
        $dictServices.add("Microsoft.Network/dnsForwardingRulesets//forwardingRule", $dnsForwardingRuleSetRules)
        $dictServices.add("Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks", $dnsForwardingRulesetLinks)

    }

    # get network rules for Event Hub and Service Bus
    elseif ($service -eq "Microsoft.EventHub/namespaces" -or $service -eq "Microsoft.ServiceBus/namespaces") {

        $networkRuleSets = New-Object -TypeName 'System.Collections.ArrayList'
        $namespace = ""

        foreach ($item in $items) {
            if ($service -eq "Microsoft.EventHub/namespaces") {
                $networkRuleSet = Get-AzEventHubNetworkRuleSet -ResourceGroupName $item.ResourceGroupName -Namespace $item.Name
                $networkRuleSets.Add($networkRuleSet)
                $namespace = "Microsoft.EventHub/Namespaces/NetworkRuleSets"
            }
            if ($service -eq "Microsoft.ServiceBus/namespaces") {
                $networkRuleSet = Get-AzServiceBusNetworkRuleSet -ResourceGroupName $item.ResourceGroupName -Namespace $item.Name
                $networkRuleSets.Add($networkRuleSet)
                $namespace = "Microsoft.ServiceBus/Namespaces/NetworkRuleSets"
            }
        }

        $dictServices.add($namespace, $networkRuleSets)
    }
    else {
        $dictServices.add($service, $items)
    }
}

#
# Write out data
#

# append items in $listDnsServers to $dictServices["Microsoft.Compute/virtualMachines"]
$dictServices["Microsoft.Compute/virtualMachines"] += $listDnsServers

# append items in $listDnsVmNics to $dictServices["Microsoft.Network/networkInterfaces"]
$dictServices["Microsoft.Network/networkInterfaces"] += $listDnsVmNics

New-Item -Path "..//data/${outFolder}" -ItemType Directory -ErrorAction Ignore

ConvertTo-Json -InputObject $listSubscriptionInfo -Depth 20 | Out-File "..//data/${outFolder}/subscriptions.json"
ConvertTo-Json -InputObject $listVnets -Depth 20 | Out-File "..//data/${outFolder}/vnets.json"
ConvertTo-Json -InputObject $listRouteTables -Depth 20 | Out-File "..//data/${outFolder}/routeTables.json"
ConvertTo-Json -InputObject $listFirewalls -Depth 20 | Out-File "..//data/${outFolder}/firewalls.json"
ConvertTo-Json -InputObject $listNatGateways -Depth 20 | Out-File "..//data/${outFolder}/natGateways.json"
ConvertTo-Json -InputObject $listVnetGateways -Depth 20 | Out-File "..//data/${outFolder}/vnetGateways.json"
ConvertTo-Json -InputObject $listGatewayConnections -Depth 20 | Out-File "..//data/${outFolder}/gatewayConnections.json"
ConvertTo-Json -InputObject $listExpressRouteCircuits -Depth 20 | Out-File "..//data/${outFolder}/expressRouteCircuits.json"

# TODO: remove this export once you confirm DNS VM data is merged into the regular VM export (see lines 188 - 192)
ConvertTo-Json -InputObject $listDnsServers -Depth 20 | Out-File "..//data/${outFolder}/virtualMachines-dns.json"
ConvertTo-Json -InputObject $listDnsVmNics -Depth 20 | Out-File "..//data/${outFolder}/networkInterfaces-dns.json"

$dictServices.GetEnumerator() | ForEach-Object {
    $filename = $_.key.Split("/")[1]

    switch ($_.Key)
    {
        "Microsoft.Network/dnsResolvers/outboundEndpoints" { $filename = "dnsResolverOutboundEndpoints"; Break }
        "Microsoft.Network/dnsForwardingRulesets//forwardingRule" { $filename = "dnsForwardingRulesetRules"; Break }
        "Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks" { $filename = "dnsForwardingRulesetLinks"; Break }
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks" { $filename = "privateDnsZoneLinks"; Break }
        "microsoft.insights/components" { $filename = "appInsights"; Break }
        "Microsoft.ContainerRegistry/registries" { $filename = "containerRegistries"; Break }
        "Microsoft.OperationalInsights/workspaces" { $filename = "logAnalyticsWorkspaces"; Break }
        "Microsoft.KeyVault/vaults" { $filename = "keyVaults"; Break }
        "Microsoft.ServiceBus/namespaces" { $filename = "serviceBusNamespaces"; Break }
        "Microsoft.ServiceBus/namespaces/NetworkRuleSets" { $filename = "serviceBusNetworkRuleSets"; Break }
        "Microsoft.EventHub/clusters" { $filename = "eventHubClusters"; Break }
        "Microsoft.EventHub/namespaces" { $filename = "eventHubNamespaces"; Break }
        "Microsoft.EventHub/namespaces/NetworkRuleSets" { $filename = "eventHubNetworkRuleSets"; Break }
        "Microsoft.ApiManagement/service" { $filename = "apiManagement"; Break }
        "Microsoft.ContainerService/managedClusters" { $filename = "aks"; Break }
        "Microsoft.DocumentDB/databaseAccounts" { $filename = "cosmosDbAccounts"; Break }
        "Microsoft.ContainerService/managedClusters" { $filename = "azureKubernetesService"; Break }
        "Microsoft.Sql/servers" { $filename = "sqlServers"; Break }
        "Microsoft.Sql/servers/databases" { $filename = "sqlDatabases"; Break }
        "Microsoft.DataFactory/factories" { $filename = "dataFactories"; Break }
        "Microsoft.Logic/workflows" { $filename = "logicApps"; Break }
        "Microsoft.Web/hostingEnvironments" { $filename = "appServiceEnvironments"; Break }
    }

    ConvertTo-Json -InputObject $_.value -Depth 20 | Out-File "..//data/${outFolder}/${filename}.json"
}
