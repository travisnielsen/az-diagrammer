import { EdgeData } from 'reaflow';

export const demoEdgesHidden: EdgeData[] = [
    {
        "id": "contosocoredns-dnsforwardrulesetcontoso-to-contosocoredns-dnsresolverhuboutbound",
        "from": "contosocoredns-dnsforwardrulesetcontoso",
        "to": "contosocoredns-dnsresolverhuboutbound",
        "className": "edge-dns",
        "data": {
            "type": "dnsresolveroutboundendpoint"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuspeehproducerb6e81b12b6154269a817ea4a401ebebc",
        "from": "contosocorenetwork-contosoislandncuspeehproducer",
        "to": "contosoislandworkload-contosoislandncusfaehproducer",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "kubernetescontosoislandncusaksnode-aksagentpool21326252vmss-to-contosoislandncusaksnode-kubernetes",
        "from": "contosoislandncusaksnode-aksagentpool21326252vmss",
        "to": "contosoislandncusaksnode-kubernetes",
        "text": "load balancing",
        "data": {
            "type": "loadbalancing"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncusacr.b8132657aac543d0b295f80e13a1382e",
        "from": "contosoislandnetwork-contosoislandncuspeacr",
        "to": "contosoislandworkload-contosoislandncusacr",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuspecosmos",
        "from": "contosoislandnetwork-contosoislandncuspecosmos",
        "to": "contosoislandworkload-contosoislandncusacdb",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuspeehconsumerea1d3693d79b4ad7b4542ee41d2b9353",
        "from": "contosoislandnetwork-contosoislandncuspeehconsumer",
        "to": "contosoislandworkload-contosoislandncusfaehconsumer",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-b25cd6b5b0c34f3e95f518ab4738f8f5",
        "from": "contosoislandnetwork-contosoislandncuspeehns",
        "to": "contosoislandworkload-contosoislandncusehns",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuspeehproducer46bd341730c243a9ae51069889af1b28",
        "from": "contosoislandnetwork-contosoislandncuspeehproducer",
        "to": "contosoislandworkload-contosoislandncusfaehproducer",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuspekv",
        "from": "contosoislandnetwork-contosoislandncuspekv",
        "to": "contosoislandworkload-contosoislandncuskv",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncuspesbconsumer5a3341e5a27f4c849c90cb83a3a25089",
        "from": "contosoislandnetwork-contosoislandncuspesbconsumer",
        "to": "contosoislandworkload-contosoislandncusfasbconsumer",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-afd56fe2ea6443c9881daa89eeae01e6",
        "from": "contosoislandnetwork-contosoislandncuspesbns",
        "to": "contosoislandworkload-contosoislandncussbns",
        "text": "",
        "data": {
            "type": "privateendpoint-connection"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncusfaehproducer-to-contosoislandnetwork-contosoislandncusworkload-ehproducer",
        "from": "contosoislandnetwork-contosoislandncusworkload-ehproducer-appServiceDelegation",
        "to": "contosoislandworkload-contosoislandncusfaehproducer",
        "data": {
            "type": "vnetintegration"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncusfaehconsumer-to-contosoislandnetwork-contosoislandncusworkload-ehconsumer",
        "from": "contosoislandnetwork-contosoislandncusworkload-ehconsumer-appServiceDelegation",
        "to": "contosoislandworkload-contosoislandncusfaehconsumer",
        "data": {
            "type": "vnetintegration"
        },
        "parent": "northcentralus"
    },
    {
        "id": "contosoislandworkload-contosoislandncusfasbconsumer-to-contosoislandnetwork-contosoislandncusworkload-sbconsumer",
        "from": "contosoislandnetwork-contosoislandncusworkload-sbconsumer-appServiceDelegation",
        "to": "contosoislandworkload-contosoislandncusfasbconsumer",
        "data": {
            "type": "vnetintegration"
        },
        "parent": "northcentralus"
    }
]