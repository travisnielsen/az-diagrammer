import { NodeData } from 'reaflow';

export const demoNodesVisible: NodeData[] = [
    {
      id: "contosocoredns-contosocom",
      parent: "contosocoredns-dnsforwardrulesetcontoso",
      height: 75,
      width: 300,
      data: {
        type: "service",
        category: "networking",
        layoutZone: "3",
        region: "",
        servicename: "dnsforwardingrulesetrule",
        label: "contoso.com.",
        info: "10.10.0.132:53",
        url: "images/Networking/dnsforwardingrulesetrule.svg",
      },
    },
    {
      id: "contosocoredns-dnsforwardrulesetcontoso",
      height: 150,
      width: 250,
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        layoutZone: "3",
        region: "northcentralus",
        servicename: "dnsforwardingruleset",
        label: "dns-forward-ruleset-contoso",
        url: "images/Networking/dnsforwardingruleset.svg",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocorenetwork-contosoncuser1",
      height: 150,
      width: 250,
      data: {
        type: "service",
        category: "networking",
        layoutZone: "1",
        region: "global",
        servicename: "expressroutecircuit",
        label: "contoso-ncus-er1",
        info: "Premium (5000 Mbps)",
        url: "images/Networking/expressroutecircuit.svg",
      },
      parent: "global",
    },
    {
      id: "contosocorenetwork-contosocorencusvnetgateway",
      parent: "contosocorenetwork-contosocorencushub-gatewaysubnet",
      height: 150,
      width: 250,
      data: {
        type: "service",
        category: "networking",
        region: "northcentralus",
        servicename: "vpngateway",
        label: "contoso-core-ncus-vnet-gateway",
        info: undefined,
        url: "images/Networking/vpngateway.svg",
      },
    },
    {
      id: "chicago",
      height: 150,
      width: 250,
      data: {
        type: "service",
        category: "networking",
        layoutZone: "0",
        region: "global",
        servicename: "location",
        label: "Chicago",
        info: "Equinix",
        url: "images/location.svg",
      },
    },
    {
      id: "privatednszone-container",
      height: 150,
      width: 250,
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        layoutZone: "1",
        region: "global",
        servicename: "privatednszone-container",
        label: "Private DNS Zones",
        url: "images/Networking/dns.svg",
        status: "open",
      },
      parent: "global",
    },
    {
      id: "contosocorenetwork-contosocorencusvnetgatewaypip",
      height: 150,
      width: 250,
      data: {
        type: "service",
        category: "networking",
        layoutZone: "5",
        region: "northcentralus",
        servicename: "publicipaddress",
        label: "contoso-core-ncus-vnet-gateway-pip",
        info: "IPv4",
        url: "images/Networking/publicipaddress.svg",
      },
      parent: "container-paas-northcentralus",
    },
    {
      id: "contosocorenetwork-contosocorencusbridge-azurefirewallsubnet",
      parent: "contosocorenetwork-contosocorencusbridge",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "AzureFirewallSubnet",
        url: "images/Networking/subnet.svg",
        info: "10.10.16.0/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusbridge-azurebastionsubnet",
      parent: "contosocorenetwork-contosocorencusbridge",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "AzureBastionSubnet",
        url: "images/Networking/subnet.svg",
        info: "10.10.16.128/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusbridge-privatelinks",
      parent: "contosocorenetwork-contosocorencusbridge",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "privatelinks",
        url: "images/Networking/subnet.svg",
        info: "10.10.17.0/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusbridge-appgateways",
      parent: "contosocorenetwork-contosocorencusbridge",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "appgateways",
        url: "images/Networking/subnet.svg",
        info: "10.10.17.128/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencushub-azurefirewallsubnet",
      parent: "contosocorenetwork-contosocorencushub",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "AzureFirewallSubnet",
        url: "images/Networking/subnet.svg",
        info: "10.10.0.0/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencushub-dns",
      parent: "contosocorenetwork-contosocorencushub",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "dns",
        url: "images/Networking/subnet.svg",
        info: "10.10.0.128/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencushub-dnsresolveroutbound",
      parent: "contosocorenetwork-contosocorencushub",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "dns-resolver-outbound",
        url: "images/Networking/subnet.svg",
        info: "10.10.1.0/26",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencushub-services",
      parent: "contosocorenetwork-contosocorencushub",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "services",
        url: "images/Networking/subnet.svg",
        info: "10.10.1.64/26",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencushub-gatewaysubnet",
      parent: "contosocorenetwork-contosocorencushub",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "GatewaySubnet",
        url: "images/Networking/subnet.svg",
        info: "10.10.1.128/26",
        status: "open",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusspoke-iaas",
      parent: "contosocorenetwork-contosocorencusspoke",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "iaas",
        url: "images/Networking/subnet.svg",
        info: "10.10.32.0/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusspoke-privatelink",
      parent: "contosocorenetwork-contosocorencusspoke",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "privatelink",
        url: "images/Networking/subnet.svg",
        info: "10.10.32.128/25",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusspoke-funcintegration",
      parent: "contosocorenetwork-contosocorencusspoke",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "funcintegration",
        url: "images/Networking/subnet.svg",
        info: "10.10.33.0/25",
        status: "closed",
      },
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload-aks",
      parent: "contosoislandnetwork-contosoislandncusworkload",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "aks",
        url: "images/Networking/subnet.svg",
        info: "192.168.0.0/22",
        status: "closed",
      },
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload-util",
      parent: "contosoislandnetwork-contosoislandncusworkload",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "util",
        url: "images/Networking/subnet.svg",
        info: "192.168.4.0/22",
        status: "closed",
      },
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
      parent: "contosoislandnetwork-contosoislandncusworkload",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "privateEndpoints",
        url: "images/Networking/subnet.svg",
        info: "192.168.8.0/24",
        status: "closed",
      },
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload-ehproducer",
      parent: "contosoislandnetwork-contosoislandncusworkload",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "ehProducer",
        url: "images/Networking/subnet.svg",
        info: "192.168.9.0/26",
        status: "closed",
      },
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload-ehconsumer",
      parent: "contosoislandnetwork-contosoislandncusworkload",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "ehConsumer",
        url: "images/Networking/subnet.svg",
        info: "192.168.9.64/26",
        status: "closed",
      },
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload-sbconsumer",
      parent: "contosoislandnetwork-contosoislandncusworkload",
      height: 120,
      width: 700,
      className: "node-container",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        region: "northcentralus",
        servicename: "subnet",
        label: "sbConsumer",
        url: "images/Networking/subnet.svg",
        info: "192.168.9.128/26",
        status: "closed",
      },
    },
    {
      id: "contosocorenetwork-contosocorencusbridge",
      height: 200,
      width: 750,
      className: "node-container node-vnet-peered",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        layoutZone: "3",
        region: "northcentralus",
        servicename: "vnet",
        label: "contoso-core-ncus-bridge",
        url: "images/Networking/virtualnetwork.svg",
        info: "10.10.16.0/20",
        status: "open",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocorenetwork-contosocorencushub",
      height: 200,
      width: 750,
      className: "node-container node-vnet-peered",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        layoutZone: "3",
        region: "northcentralus",
        servicename: "vnet",
        label: "contoso-core-ncus-hub",
        url: "images/Networking/virtualnetwork.svg",
        info: "10.10.0.0/20",
        status: "open",
        role: "hub",
      },
      parent: "northcentralus",
    },
    {
      id: "contosocorenetwork-contosocorencusspoke",
      height: 200,
      width: 750,
      className: "node-container node-vnet-peered",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        layoutZone: "4",
        region: "northcentralus",
        servicename: "vnet",
        label: "contoso-core-ncus-spoke",
        url: "images/Networking/virtualnetwork.svg",
        info: "10.10.32.0/20",
        status: "open",
      },
      parent: "container-network-workload-northcentralus",
    },
    {
      id: "contosoislandnetwork-contosoislandncusworkload",
      height: 200,
      width: 750,
      className: "node-container node-vnet-peered",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=150,left=25,bottom=25,right=25]",
        "elk.direction": "RIGHT",
      },
      data: {
        type: "container",
        category: "networking",
        layoutZone: "4",
        region: "northcentralus",
        servicename: "vnet",
        label: "contoso-island-ncus-workload",
        url: "images/Networking/virtualnetwork.svg",
        info: "192.168.0.0/16",
        status: "open",
      },
      parent: "container-network-workload-northcentralus",
    },
    {
      id: "topContainer",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
        "elk.direction": "RIGHT",
      },
      className: "layout-container",
      width: 750,
      data: {
        type: "container",
        category: "layout",
      },
    },
    {
      id: "global",
      parent: "topContainer",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
        "elk.direction": "RIGHT",
      },
      className: "layout-container",
      data: {
        type: "container",
        category: "layout",
      },
    },
    {
      id: "northcentralus",
      parent: "topContainer",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=100,left=50,bottom=50,right=50]",
        "elk.direction": "RIGHT",
      },
      className: "region-container",
      data: {
        type: "container",
        category: "region",
        region: "northcentralus",
        label: "northcentralus",
      },
    },
    {
      id: "container-network-workload-northcentralus",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
        "elk.direction": "RIGHT",
      },
      parent: "northcentralus",
      className: "layout-container",
      data: {
        type: "container",
        category: "layout",
      },
    },
    {
      id: "container-paas-northcentralus",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
        "elk.direction": "RIGHT",
      },
      parent: "northcentralus",
      className: "layout-container",
      data: {
        type: "container",
        category: "layout",
        url: "",
      },
    },
    {
      id: "container-network-workload-global",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
        "elk.direction": "RIGHT",
      },
      parent: "global",
      className: "layout-container",
      data: {
        type: "container",
        category: "layout",
      },
    },
    {
      id: "container-paas-global",
      layoutOptions: {
        portConstraints: "FREE",
        "elk.padding": "[top=0,left=0,bottom=0,right=0]",
        "elk.direction": "RIGHT",
      },
      parent: "global",
      className: "layout-container",
      data: {
        type: "container",
        category: "layout",
        url: "",
      },
    },
    {
      id: "privatednszone-container-privatednszone-summary",
      parent: "privatednszone-container",
      height: 75,
      width: 350,
      data: {
        type: "listitem",
        category: "summary",
        region: "global",
        layoutZone: "1",
        servicename: "privatednszone",
        label: "10 privatednszones",
        url: undefined,
        isSubstitute: true,
      },
    },
  ]