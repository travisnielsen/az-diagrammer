import { EdgeData } from 'reaflow';

export const demoEdgesVisible: EdgeData[] = [
    {
        "id": "/subscriptions/293bbd05-3a7f-4d5c-9bef-9f7919b36306/resourceGroups/contoso-core-network/providers/Microsoft.Network/virtualNetworks/contoso-core-ncus-bridge/virtualNetworkPeerings/to-hub",
        "from": "contosocorenetwork-contosocorencushub",
        "to": "contosocorenetwork-contosocorencusbridge",
        "className": "edge-vnet-peering",
        "text": "peering",
        "data": {
            "type": "vnetpeering"
        },
        "parent": "northcentralus"
    },
    {
        "id": "/subscriptions/293bbd05-3a7f-4d5c-9bef-9f7919b36306/resourceGroups/contoso-core-network/providers/Microsoft.Network/virtualNetworks/contoso-core-ncus-spoke/virtualNetworkPeerings/to-hub",
        "from": "contosocorenetwork-contosocorencushub",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-vnet-peering",
        "text": "peering",
        "data": {
            "type": "vnetpeering"
        },
        "parent": "northcentralus"
    },
    {
        "id": "/subscriptions/293bbd05-3a7f-4d5c-9bef-9f7919b36306/resourceGroups/contoso-island-network/providers/Microsoft.Network/virtualNetworks/contoso-island-ncus-workload/virtualNetworkPeerings/to-contoso-core-ncus-bridge",
        "from": "contosocorenetwork-contosocorencusbridge",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-vnet-peering",
        "text": "peering",
        "data": {
            "type": "vnetpeering"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandnetwork-contosoislandncusworkload-ehconsumertocontosoislandworkloadcontosoislandncussaehcon",
        "from": "contosoislandnetwork-contosoislandncusworkload-ehconsumer",
        "to": "contosoislandworkload-contosoislandncussaehcon",
        "text": "",
        "data": {
            "type": "serviceendpointrule"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandnetwork-contosoislandncusworkload-ehproducertocontosoislandworkloadcontosoislandncussaehpro",
        "from": "contosoislandnetwork-contosoislandncusworkload-ehproducer",
        "to": "contosoislandworkload-contosoislandncussaehpro",
        "text": "",
        "data": {
            "type": "serviceendpointrule"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandnetwork-contosoislandncusworkload-sbconsumertocontosoislandworkloadcontosoislandncussasbcon",
        "from": "contosoislandnetwork-contosoislandncusworkload-sbconsumer",
        "to": "contosoislandworkload-contosoislandncussasbcon",
        "text": "",
        "data": {
            "type": "serviceendpointrule"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosocorenetwork-connection1",
        "from": "contosocorenetwork-contosoncuser1",
        "to": "contosocorenetwork-contosocorencusvnetgateway",
        "text": "Routing Weight: 160",
        "data": {
            "type": "expressroute"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocorenetwork-contosoncuser1-to-peering-location",
        "from": "chicago",
        "to": "contosocorenetwork-contosoncuser1",
        "text": "",
        "data": {
            "type": "expressroute"
        }
    },
    {
        "id": "contosocoredns-contosocorencushublink-privatelink.azure.com-contosocorencushublink",
        "from": "contosocoredns-privatelink.azure.com",
        "to": "contosocorenetwork-contosocorencushub",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencusspokelink-privatelink.azure.com-contosocorencusspokelink",
        "from": "contosocoredns-privatelink.azure.com",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencushublink-privatelink.azurewebsites.net-contosocorencushublink",
        "from": "contosocoredns-privatelink.azurewebsites.net",
        "to": "contosocorenetwork-contosocorencushub",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencusspokelink-privatelink.azurewebsites.net-contosocorencusspokelink",
        "from": "contosocoredns-privatelink.azurewebsites.net",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencushublink-privatelink.blob.core.windows.net-contosocorencushublink",
        "from": "contosocoredns-privatelink.blob.core.windows.net",
        "to": "contosocorenetwork-contosocorencushub",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencusspokelink-privatelink.blob.core.windows.net-contosocorencusspokelink",
        "from": "contosocoredns-privatelink.blob.core.windows.net",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencushublink-privatelink.database.windows.net-contosocorencushublink",
        "from": "contosocoredns-privatelink.database.windows.net",
        "to": "contosocorenetwork-contosocorencushub",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencusspokelink-privatelink.database.windows.net-contosocorencusspokelink",
        "from": "contosocoredns-privatelink.database.windows.net",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencushublink-privatelink.datafactory.azure.net-contosocorencushublink",
        "from": "contosocoredns-privatelink.datafactory.azure.net",
        "to": "contosocorenetwork-contosocorencushub",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencusspokelink-privatelink.datafactory.azure.net-contosocorencusspokelink",
        "from": "contosocoredns-privatelink.datafactory.azure.net",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosoislanddns-contosoislandncusworkloadlink-privatelink.azurecr.io-contosoislandncusworkloadlink",
        "from": "contosoislanddns-privatelink.azurecr.io",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosoislanddns-contosoislandncusworkloadlink-privatelink.azurewebsites.net-contosoislandncusworkloadlink",
        "from": "contosoislanddns-privatelink.azurewebsites.net",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosoislanddns-contosoislandncusworkloadlink-privatelink.documents.azure.com-contosoislandncusworkloadlink",
        "from": "contosoislanddns-privatelink.documents.azure.com",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosoislanddns-contosoislandncusworkloadlink-privatelink.servicebus.windows.net-contosoislandncusworkloadlink",
        "from": "contosoislanddns-privatelink.servicebus.windows.net",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosoislanddns-contosoislandncusworkloadlink-privatelink.vaultcore.azure.net-contosoislandncusworkloadlink",
        "from": "contosoislanddns-privatelink.vaultcore.azure.net",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-dns",
        "data": {
            "type": "privatednszonelink"
        },
        "parent": "topContainer"
    },
    {
        "id": "contosocoredns-contosocorencushublink-dns-forward-ruleset-contoso-contosocorencushublink",
        "from": "contosocoredns-dnsforwardrulesetcontoso",
        "to": "contosocorenetwork-contosocorencushub",
        "className": "edge-dns",
        "data": {
            "type": "dnsforwardingrulesetlink"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosocoredns-contosocorencusspokelink-dns-forward-ruleset-contoso-contosocorencusspokelink",
        "from": "contosocoredns-dnsforwardrulesetcontoso",
        "to": "contosocorenetwork-contosocorencusspoke",
        "className": "edge-dns",
        "data": {
            "type": "dnsforwardingrulesetlink"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosocoredns-contosoislandncusworkloadlink-dns-forward-ruleset-contoso-contosoislandncusworkloadlink",
        "from": "contosocoredns-dnsforwardrulesetcontoso",
        "to": "contosoislandnetwork-contosoislandncusworkload",
        "className": "edge-dns",
        "data": {
            "type": "dnsforwardingrulesetlink"
        },
        "parent": "northcentralus"
    }
]