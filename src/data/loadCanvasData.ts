import { NodeData, EdgeData, ElkNodeLayoutOptions } from 'reaflow';
import { getNodeData, getEdgeData } from './canvasData'
import { LoadAzureData } from './loadAzureData'
import { collapseContainer } from '../utility/diagramUtils';
import { LayoutZone } from '../types/LayoutZone';

export const loadCanvasData = async (connectionString: string, containerName: string): Promise<[NodeData<any>[], NodeData<any>[], EdgeData<any>[], EdgeData<any>[]]> => {

  const azureData = await LoadAzureData(connectionString, containerName);

  if (!azureData) {
    console.log("no azure data found");
    const nodeDataVisible: NodeData[] = []
    const nodeDataHidden: NodeData[] = []
    const edgeDataVisible: EdgeData[] = []
    const edgeDataHidden: EdgeData[] = []
    return [nodeDataVisible, nodeDataHidden, edgeDataVisible, edgeDataHidden]
  }

  const nodeData = getNodeData(azureData);
  const edgeData = getEdgeData(azureData); 
  
  const nodeIsNonEmptyContainer = (node: NodeData) => {
    const filteredServices = ["routetable", "nsg"]
    let hasChildNodes = false
    if (node.data.type === "container") {
      hasChildNodes = nodeData.findIndex(n => n.parent === node.id ) > 0
      
      if (hasChildNodes && node.data.servicename === "subnet") {
        const childNodes = nodeData.filter(n => n.parent === node.id && !filteredServices.includes(n.data.servicename))
        if (childNodes.length === 0) hasChildNodes = false
      }
    }

    return hasChildNodes
  }

  const containerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=150,left=25,bottom=25,right=25]',
    'elk.direction': 'RIGHT'
}

  // add layout containers
 nodeData.push( {
    id: 'container-network-workload',
    layoutOptions: containerlayoutOptions,
    data: {
      type: 'layout',
      url: ""
    }
  })
  nodeData.push( {
    id: 'container-paas',
    layoutOptions: containerlayoutOptions,
    data: {
      type: 'layout',
      url: ""
    }
  })

  // separate vnets into core (hub) and workload (spoke) vnets. Add spoke vnets as child nodes to 'container-network-workload' for layout purposes
  const vnetNodes = nodeData.filter(n => n.data.servicename === "vnet")
  vnetNodes.forEach(n => {

    const childNodes = nodeData.filter(nf => nf.parent === n.id)
    const hasGatewaySubnet = childNodes.findIndex(nf => nf.data.label === "GatewaySubnet") > 0

    if (hasGatewaySubnet) {
      n.data.tier = LayoutZone.NETWORKCORE
    } else {
      n.data.tier = LayoutZone.NETWORKWORKLOAD
      n.parent = 'container-network-workload'
    }

  })

  const paasNodes = nodeData.filter(n => n.data.tier === LayoutZone.PAAS)
  paasNodes.forEach(n => {
      if (!n.parent)  // set top nodes only
        n.parent = 'container-paas'
    })

  // remove unconnected items
  const edgeIdsFrom = edgeData.map(e => e.from)
  const edgeIdsTo = edgeData.map(e => e.to)
  const edgeIds = [...new Set([...edgeIdsFrom, ...edgeIdsTo])]
  var canvasNodesVisible = nodeData
    .filter(n => edgeIds.includes(n.id) || n.data.type === "container" || n.data.type === "layout" || n.data.type === "region" || n.parent != null)
    .filter(n => n.data.type === "service" || n.data.type === "region" || n.data.type === "layout" ||  (n.data.type === "container" && nodeIsNonEmptyContainer(n)))
  
  // add nodes with type 'layout' to canvasNodesVisible
  /*
  const layoutNodes = nodeData.filter(n => n.data.type === "layout")
  layoutNodes.forEach(n => {
    const existingNode = canvasNodesVisible.find(nf => nf.id === n.id)
    if (!existingNode)
      canvasNodesVisible.push(n)
  })
  */

  // remove edges that don't have valid targets
  var canvasEdgesVisible = edgeData
    .filter(e => canvasNodesVisible.findIndex(n => n.id === e.to) > 0)
    .filter(e => canvasNodesVisible.findIndex(n => n.id === e.from) > 0)

  var canvasNodesHidden: NodeData[] = []
  var canvasEdgesHidden: EdgeData[] = []

  // iterate through all subnets and set data.status to 'closed'.
  const subnetNodes = canvasNodesVisible.filter(n => n.data.servicename === "subnet")
  subnetNodes.forEach(n => {
    
    // collapse subnets except for hub vnets
    const parent = canvasNodesVisible.find(nf => nf.id === n.parent)
    if (parent && parent.data.tier !== LayoutZone.NETWORKCORE) {
      [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden] = collapseContainer(n, canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden)
      n.data.status = "closed"
    }
  })

  // if there are > 3 items of the same type within a container, replace them with a substitute node
  
  const containerIds = canvasNodesVisible.filter(n => n.data.type === "container" && n.data.servicename !== "vnet").map(n => n.id)
  containerIds.forEach(id => {
    const childNodes = canvasNodesVisible.filter(n => n.parent === id)
    const childNodeServiceNames = [...new Set(childNodes.map(n => n.data.servicename))]
    childNodeServiceNames.forEach(servicename => {
      const nodesOfType = childNodes.filter(n => n.data.servicename === servicename)
      if (nodesOfType.length > 3) {
        const node = nodesOfType[0]
        const newNode = {
          id: `${node.id}-${node.data.servicename}`,
          parent: node.parent,
          height: 110,
          width: 250,
          data: {
            type: "summary",
            category: "summary",
            tier: 'paas',
            serviceName: node.data.servicename,
            label: `${nodesOfType.length} ${node.data.servicename}s`,
            url: node.data.url,
            isSubstitute: true
          }
        }
        canvasNodesVisible.push(newNode)
     
        // create edges from nodesOfType to newNode
        // exampple: collapsed PaaS intem with vnet service endpoint from subnets
        nodesOfType.forEach(n => {
          const edgesToCreate = canvasEdgesVisible.filter(e => e.to === n.id)
          edgesToCreate.forEach(e => {
              const newEdge = {
                id: `${e.id}-summary`,
                from: e.from,
                to: newNode.id,
                data: {
                  type: "summary"
                }
            }
            const existingEdge = canvasEdgesVisible.find(ef => ef.from === newEdge.from && ef.to === newEdge.to)
            if (!existingEdge)            
              canvasEdgesVisible.push(newEdge)
          })
        })
  
        nodesOfType.forEach(n => {
          const edgesToCreate = canvasEdgesVisible.filter(e => e.from === n.id)
          edgesToCreate.forEach(e => {
            const newEdge = {
              id: `${e.id}-summary`,
              from: newNode.id,
              to: e.to,
              data: {
                type: "summary"
              }
            }
            // only push new edge if canvasEdgesVisible does not contain an edge with the same values for from and to
            const existingEdge = canvasEdgesVisible.find(ef => ef.from === newEdge.from && ef.to === newEdge.to)
            if (!existingEdge)
              canvasEdgesVisible.push(newEdge)
          })
        })

        // remove edges from nodesOfType
        nodesOfType.forEach(n => {
          const edgesToRemove = canvasEdgesVisible.filter(e => e.from === n.id || e.to === n.id)
          edgesToRemove.forEach(e => {
            const index = canvasEdgesVisible.findIndex(ef => ef.id === e.id)
            canvasEdgesVisible.splice(index, 1)
          })
        })
        
        // remove nodesOfType from canvasNodesVisible
        nodesOfType.forEach(n => {
          const index = canvasNodesVisible.findIndex(nf => nf.id === n.id)
          canvasNodesVisible.splice(index, 1)
        })
  
      }
    })
  })
  
  return [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden]
}