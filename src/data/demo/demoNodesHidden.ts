import { NodeData } from 'reaflow';

export const demoNodesHidden: NodeData[] = [
    {
        "id": "contosocorenetwork-contosocorencusbridgeudr",
        "parent": "contosocorenetwork-contosocorencusbridge-azurefirewallsubnet",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "routetable",
            "label": "contoso-core-ncus-bridge-udr",
            "url": "images/Networking/routetable.svg",
            "info": "2 routes"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusbridgeazfw",
        "parent": "contosocorenetwork-contosocorencusbridge-azurefirewallsubnet",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "firewall",
            "label": "contoso-core-ncus-bridge-azfw",
            "info": "10.10.16.4",
            "url": "images/Networking/firewall.svg"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusbridgebastion-contosocorenetwork-contosocorencusbridge-azurebastionsubnet",
        "parent": "contosocorenetwork-contosocorencusbridge-azurebastionsubnet",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-bridge-bastion",
            "url": "images/Networking/nsg.svg",
            "info": "8 rules"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusbastion",
        "parent": "contosocorenetwork-contosocorencusbridge-azurebastionsubnet",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "bastion",
            "label": "contoso-core-ncus-bastion",
            "info": "Basic",
            "url": "images/Networking/bastion.svg"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusbridgeprivatelinks-contosocorenetwork-contosocorencusbridge-privatelinks",
        "parent": "contosocorenetwork-contosocorencusbridge-privatelinks",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-bridge-privatelinks",
            "url": "images/Networking/nsg.svg",
            "info": "2 rules"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusbridgeappgw-contosocorenetwork-contosocorencusbridge-appgateways",
        "parent": "contosocorenetwork-contosocorencusbridge-appgateways",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-bridge-appgw",
            "url": "images/Networking/nsg.svg",
            "info": "1 rules"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencushubazfw",
        "parent": "contosocorenetwork-contosocorencushub-azurefirewallsubnet",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "firewall",
            "label": "contoso-core-ncus-hub-azfw",
            "info": "10.10.0.4",
            "url": "images/Networking/firewall.svg"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencushubdns-contosocorenetwork-contosocorencushub-dns",
        "parent": "contosocorenetwork-contosocorencushub-dns",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-hub-dns",
            "url": "images/Networking/nsg.svg",
            "info": "2 rules"
        }
    },
    {
        "id": "contosocoreutil-contosocorencusdns01",
        "parent": "contosocorenetwork-contosocorencushub-dns",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "region": "northcentralus",
            "servicename": "virtualmachine",
            "label": "contoso-core-ncus-dns01",
            "info": "Standard_B2ms",
            "url": "images/Compute/virtualmachine.svg",
            "ipAddressPrivate": "10.10.0.132"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencushubdns-contosocorenetwork-contosocorencushub-dnsresolveroutbound",
        "parent": "contosocorenetwork-contosocorencushub-dnsresolveroutbound",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-hub-dns",
            "url": "images/Networking/nsg.svg",
            "info": "2 rules"
        }
    },
    {
        "id": "contosocoredns-dnsresolverhuboutbound",
        "parent": "contosocorenetwork-contosocorencushub-dnsresolveroutbound",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "dnsresolveroutboundendpoint",
            "label": "dns-resolver-hub-outbound",
            "info": "Outbound traffic for DNS queries",
            "url": "images/Networking/dnsprivateresolver.svg"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencushubservices-contosocorenetwork-contosocorencushub-services",
        "parent": "contosocorenetwork-contosocorencushub-services",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-hub-services",
            "url": "images/Networking/nsg.svg",
            "info": "0 rules"
        }
    },
    {
        "id": "contosocorenetwork-contosoislandncuspeehproducer",
        "parent": "contosocorenetwork-contosocorencushub-services",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-ehProducer",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusspokeiaas-contosocorenetwork-contosocorencusspoke-iaas",
        "parent": "contosocorenetwork-contosocorencusspoke-iaas",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-spoke-iaas",
            "url": "images/Networking/nsg.svg",
            "info": "2 rules"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusegressudr",
        "parent": "contosocorenetwork-contosocorencusspoke-iaas",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "routetable",
            "label": "contoso-core-ncus-egress-udr",
            "url": "images/Networking/routetable.svg",
            "info": "1 routes"
        }
    },
    {
        "id": "contosocoreutil-contosocorencusweb01",
        "parent": "contosocorenetwork-contosocorencusspoke-iaas",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "region": "northcentralus",
            "servicename": "virtualmachine",
            "label": "contoso-core-ncus-web01",
            "info": "Standard_B2ms",
            "url": "images/Compute/virtualmachine.svg",
            "ipAddressPrivate": "10.10.32.4"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusspokeprivatelinks-contosocorenetwork-contosocorencusspoke-privatelink",
        "parent": "contosocorenetwork-contosocorencusspoke-privatelink",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-spoke-privatelinks",
            "url": "images/Networking/nsg.svg",
            "info": "2 rules"
        }
    },
    {
        "id": "contosocorenetwork-contosocorencusspokefunctions-contosocorenetwork-contosocorencusspoke-funcintegration",
        "parent": "contosocorenetwork-contosocorencusspoke-funcintegration",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-core-ncus-spoke-functions",
            "url": "images/Networking/nsg.svg",
            "info": "1 rules"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusnsgaks-contosoislandnetwork-contosoislandncusworkload-aks",
        "parent": "contosoislandnetwork-contosoislandncusworkload-aks",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-island-ncus-nsg-aks",
            "url": "images/Networking/nsg.svg",
            "info": "1 rules"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusudr",
        "parent": "contosoislandnetwork-contosoislandncusworkload-aks",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "routetable",
            "label": "contoso-island-ncus-udr",
            "url": "images/Networking/routetable.svg",
            "info": "3 routes"
        }
    },
    {
        "id": "contosoislandncusaksnode-aksagentpool21326252vmss",
        "parent": "contosoislandnetwork-contosoislandncusworkload-aks",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "region": "northcentralus",
            "servicename": "virtualmachinescaleset",
            "label": "aks-agentpool-21326252-vmss",
            "info": "undefined undefined",
            "url": "images/Compute/virtualmachinescaleset.svg"
        }
    },
    {
        "id": "contosoislandncusaksnode-kubernetes",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "loadbalancer",
            "label": "kubernetes",
            "info": "Public",
            "url": "images/Networking/loadbalancer.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandnetwork-contosoislandncusnsgutil-contosoislandnetwork-contosoislandncusworkload-util",
        "parent": "contosoislandnetwork-contosoislandncusworkload-util",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-island-ncus-nsg-util",
            "url": "images/Networking/nsg.svg",
            "info": "2 rules"
        }
    },
    {
        "id": "contosoislandutil-contosoislandncusutil01",
        "parent": "contosoislandnetwork-contosoislandncusworkload-util",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "region": "northcentralus",
            "servicename": "virtualmachine",
            "label": "contoso-island-ncus-util01",
            "info": "Standard_B2ms",
            "url": "images/Compute/virtualmachine.svg",
            "ipAddressPrivate": "192.168.4.4"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusnsgpe-contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-island-ncus-nsg-pe",
            "url": "images/Networking/nsg.svg",
            "info": "1 rules"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspeacr",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-acr",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspecosmos",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-cosmos",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspeehconsumer",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-ehConsumer",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspeehns",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-ehns",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspeehproducer",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-ehProducer",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspekv",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-kv",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspesbconsumer",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-sbConsumer",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncuspesbns",
        "parent": "contosoislandnetwork-contosoislandncusworkload-privateendpoints",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "privatelink",
            "label": "contoso-island-ncus-pe-sbns",
            "info": "abc",
            "url": "images/Networking/privatelink.svg"
        }
    },
    {
        "id": "contosoislandworkload-contosoislandncusacr",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "containerregistry",
            "label": "contosoislandncusacr",
            "info": "Premium",
            "url": "images/Containers/containerregistry.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncusacdb",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "databases",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "cosmosdb",
            "label": "contoso-island-ncus-acdb",
            "info": "Standard",
            "url": "images/Databases/cosmosdb.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncusehns",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "analytics",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "eventhub",
            "label": "contoso-island-ncus-ehns",
            "info": "Premium",
            "url": "images/Analytics/eventhub.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuskv",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "security",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "keyvault",
            "label": "contoso-island-ncus-kv",
            "info": "standard",
            "url": "images/Security/keyvault.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncussbns",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "integration",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "servicebus",
            "label": "contoso-island-ncus-sbns",
            "info": "Premium",
            "url": "images/Integration/servicebus.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandnetwork-contosoislandncusnsgfunctions-contosoislandnetwork-contosoislandncusworkload-ehproducer",
        "parent": "contosoislandnetwork-contosoislandncusworkload-ehproducer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-island-ncus-nsg-functions",
            "url": "images/Networking/nsg.svg",
            "info": "0 rules"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusworkload-ehproducer-appServiceDelegation",
        "parent": "contosoislandnetwork-contosoislandncusworkload-ehproducer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "networkinterface",
            "label": "App Service Integration",
            "info": "Outbound traffic from App Service to VNet",
            "url": "images/Networking/networkinterface.svg"
        }
    },
    {
        "id": "contosoislandworkload-contosoislandncusfaehproducer",
        "parent": "contosoislandworkload-contosoislandncusaspehproducer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "function",
            "label": "contoso-island-ncus-fa-ehProducer",
            "info": "ElasticPremium",
            "url": "images/Compute/function.svg"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusnsgfunctions-contosoislandnetwork-contosoislandncusworkload-ehconsumer",
        "parent": "contosoislandnetwork-contosoislandncusworkload-ehconsumer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-island-ncus-nsg-functions",
            "url": "images/Networking/nsg.svg",
            "info": "0 rules"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusworkload-ehconsumer-appServiceDelegation",
        "parent": "contosoislandnetwork-contosoislandncusworkload-ehconsumer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "networkinterface",
            "label": "App Service Integration",
            "info": "Outbound traffic from App Service to VNet",
            "url": "images/Networking/networkinterface.svg"
        }
    },
    {
        "id": "contosoislandworkload-contosoislandncusfaehconsumer",
        "parent": "contosoislandworkload-contosoislandncusaspehconsumer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "function",
            "label": "contoso-island-ncus-fa-ehConsumer",
            "info": "ElasticPremium",
            "url": "images/Compute/function.svg"
        }
    },
    {
        "id": "contosoislandworkload-contosoislandncusaspehproducer",
        "height": 200,
        "width": 300,
        "layoutOptions": {
            "portConstraints": "FREE",
            "elk.padding": "[top=150,left=25,bottom=25,right=25]",
            "elk.direction": "RIGHT"
        },
        "data": {
            "type": "container",
            "category": "compute",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "appserviceplan",
            "label": "contoso-island-ncus-asp-ehProducer",
            "info": "D1",
            "url": "images/Compute/appserviceplan.svg"
        },
        "parent": "container-paas-northcentralus"
    },
    {
        "id": "contosoislandnetwork-contosoislandncusnsgfunctions-contosoislandnetwork-contosoislandncusworkload-sbconsumer",
        "parent": "contosoislandnetwork-contosoislandncusworkload-sbconsumer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "nsg",
            "label": "contoso-island-ncus-nsg-functions",
            "url": "images/Networking/nsg.svg",
            "info": "0 rules"
        }
    },
    {
        "id": "contosoislandnetwork-contosoislandncusworkload-sbconsumer-appServiceDelegation",
        "parent": "contosoislandnetwork-contosoislandncusworkload-sbconsumer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "networking",
            "region": "northcentralus",
            "servicename": "networkinterface",
            "label": "App Service Integration",
            "info": "Outbound traffic from App Service to VNet",
            "url": "images/Networking/networkinterface.svg"
        }
    },
    {
        "id": "contosoislandworkload-contosoislandncusfasbconsumer",
        "parent": "contosoislandworkload-contosoislandncusaspsbconsumer",
        "height": 150,
        "width": 250,
        "data": {
            "type": "service",
            "category": "compute",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "function",
            "label": "contoso-island-ncus-fa-sbConsumer",
            "info": "ElasticPremium",
            "url": "images/Compute/function.svg"
        }
    },
    {
        "id": "contosoislandworkload-contosoislandncusaspehconsumer",
        "height": 200,
        "width": 300,
        "layoutOptions": {
            "portConstraints": "FREE",
            "elk.padding": "[top=150,left=25,bottom=25,right=25]",
            "elk.direction": "RIGHT"
        },
        "data": {
            "type": "container",
            "category": "compute",
            "layoutZone": "3",
            "region": "northcentralus",
            "servicename": "appserviceplan",
            "label": "contoso-island-ncus-asp-ehConsumer",
            "info": "D1",
            "url": "images/Compute/appserviceplan.svg"
        },
        "parent": "container-paas-northcentralus"
    }
]