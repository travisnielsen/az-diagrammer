import { EdgeData } from 'reaflow';

export const demoEdgesVisible: EdgeData[] = [
    {
      id: "/subscriptions/293bbd05-3a7f-4d5c-9bef-9f7919b36306/resourceGroups/contoso-core-network/providers/Microsoft.Network/virtualNetworks/contoso-core-ncus-bridge/virtualNetworkPeerings/to-hub",
      from: "contosocorenetwork-contosocorencushub",
      to: "contosocorenetwork-contosocorencusbridge",
      className: "edge-vnet-peering",
      text: "peering",
      data: {
        type: "vnetpeering",
      },
      parent: "northcentralus",
    },
    {
      id: "/subscriptions/293bbd05-3a7f-4d5c-9bef-9f7919b36306/resourceGroups/contoso-core-network/providers/Microsoft.Network/virtualNetworks/contoso-core-ncus-spoke/virtualNetworkPeerings/to-hub",
      from: "contosocorenetwork-contosocorencushub",
      to: "contosocorenetwork-contosocorencusspoke",
      className: "edge-vnet-peering",
      text: "peering",
      data: {
        type: "vnetpeering",
      },
      parent: "northcentralus",
    },
    {
      id: "/subscriptions/293bbd05-3a7f-4d5c-9bef-9f7919b36306/resourceGroups/contoso-island-network/providers/Microsoft.Network/virtualNetworks/contoso-island-ncus-workload/virtualNetworkPeerings/to-contoso-core-ncus-bridge",
      from: "contosocorenetwork-contosocorencusbridge",
      to: "contosoislandnetwork-contosoislandncusworkload",
      className: "edge-vnet-peering",
      text: "peering",
      data: {
        type: "vnetpeering",
      },
      parent: "northcentralus",
    },
    {
      id: "expressrouteconnection-contosocorenetwork-connection1",
      from: "contosocorenetwork-contosoncuser1",
      to: "contosocorenetwork-contosocorencusvnetgateway",
      text: "Routing Weight: 160",
      className: "edge-expressroute",
      data: {
        type: "expressroute",
      },
      parent: "topContainer",
    },
    {
      id: "contosocorenetwork-contosoncuser1-to-peering-location",
      from: "chicago",
      to: "contosocorenetwork-contosoncuser1",
      text: "",
      className: "edge-expressroute",
      data: {
        type: "expressroute",
      },
    },
    {
      id: "contosocoredns-contosocorencushublink-dns-forward-ruleset-contoso-contosocorencushublink",
      from: "contosocoredns-dnsforwardrulesetcontoso",
      to: "contosocorenetwork-contosocorencushub",
      className: "edge-dns",
      data: {
        type: "dnsforwardingrulesetlink",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocoredns-contosocorencusspokelink-dns-forward-ruleset-contoso-contosocorencusspokelink",
      from: "contosocoredns-dnsforwardrulesetcontoso",
      to: "contosocorenetwork-contosocorencusspoke",
      className: "edge-dns",
      data: {
        type: "dnsforwardingrulesetlink",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocoredns-contosoislandncusworkloadlink-dns-forward-ruleset-contoso-contosoislandncusworkloadlink",
      from: "contosocoredns-dnsforwardrulesetcontoso",
      to: "contosoislandnetwork-contosoislandncusworkload",
      className: "edge-dns",
      data: {
        type: "dnsforwardingrulesetlink",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocorenetwork-contosocorencusvnetgatewaypip",
      from: "contosocorenetwork-contosocorencusvnetgateway",
      to: "contosocorenetwork-contosocorencusvnetgatewaypip",
      className: "edge-publicipaddress",
      data: {
        type: "publicipaddress",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocoredns-contosocorencushublink-privatelink.azure.com-contosocorencushublink-summary",
      from: "privatednszone-container-privatednszone-summary",
      to: "contosocorenetwork-contosocorencushub",
      className: "edge-dns",
      data: {
        type: "privatednszonelink",
        category: "summary",
      },
      parent: "topContainer",
    },
    {
      id: "contosocoredns-contosocorencusspokelink-privatelink.azure.com-contosocorencusspokelink-summary",
      from: "privatednszone-container-privatednszone-summary",
      to: "contosocorenetwork-contosocorencusspoke",
      className: "edge-dns",
      data: {
        type: "privatednszonelink",
        category: "summary",
      },
      parent: "topContainer",
    },
    {
      id: "contosoislanddns-contosoislandncusworkloadlink-privatelink.azurecr.io-contosoislandncusworkloadlink-summary",
      from: "privatednszone-container-privatednszone-summary",
      to: "contosoislandnetwork-contosoislandncusworkload",
      className: "edge-dns",
      data: {
        type: "privatednszonelink",
        category: "summary",
      },
      parent: "topContainer",
    },
  ]