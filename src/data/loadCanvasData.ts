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
      hasChildNodes = nodeData.findIndex(n => n.parent === node.id ) >= 0
      
      if (hasChildNodes && node.data.servicename === "subnet") {
        const childNodes = nodeData.filter(n => n.parent === node.id && !filteredServices.includes(n.data.servicename))
        if (childNodes.length === 0) hasChildNodes = false
      }
    }
    return hasChildNodes
  }

  const regionContainerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=100,left=50,bottom=50,right=50]',
    'elk.direction': 'RIGHT'
  }

  const layoutContainerlayoutOptions: ElkNodeLayoutOptions = {
    'portConstraints': 'FREE',
    'elk.padding': '[top=0,left=0,bottom=0,right=0]',
    'elk.direction': 'RIGHT'
  }

  // get distinct list of regions from nodeData
  const regions = [...new Set(nodeData.map(n => n.data.region))]

  /*
  nodeData.push({
    id: 'topContainer',
    layoutOptions: layoutContainerlayoutOptions,
    className: 'layout-container',
    width: 750,
    data: {
      type: "container",
      category: "layout",
    }
  })
  */
  
  // add nodes for regions
  regions.forEach(region => {
    const regionNameLowerCase = region.toLowerCase()
    const existingNode = nodeData.find(n => n.data.category === "region" && n.data.region === regionNameLowerCase)
    if (!existingNode && region !== "global" && region !== '') {
      const newNode = {
        id: regionNameLowerCase,
        layoutOptions: regionContainerlayoutOptions,
        className: 'region-container',
        data: {
          type: "container",
          category: "region",
          region: regionNameLowerCase,
          label: region,
        }
      }
      nodeData.push(newNode)
    }
  })
  
  regions.forEach(region => {
    nodeData.push( {
      id: `container-network-workload-${region}`,
      layoutOptions: layoutContainerlayoutOptions,
      parent: region,
      className: 'layout-container',
      data: {
        type: 'container',
        category: 'layout',
      }
    })
    nodeData.push( {
      id: `container-paas-${region}`,
      layoutOptions: layoutContainerlayoutOptions,
      parent: region,
      className: 'layout-container',
      data: {
        type: 'container',
        category: 'layout',
        url: ""
      }
    })
  })

  // add layout containers

  // separate vnets into core (hub) and workload (spoke) vnets. Add spoke vnets as child nodes to 'container-network-workload' for layout purposes
  const vnetNodes = nodeData.filter(n => n.data.servicename === "vnet")
  vnetNodes.forEach(n => {

    const childNodes = nodeData.filter(nf => nf.parent === n.id)
    const hasGatewaySubnet = childNodes.findIndex(nf => nf.data.label === "GatewaySubnet") > 0

    if (hasGatewaySubnet) {
      n.data.tier = LayoutZone.NETWORKCORE
      n.parent = n.data.region
    } else {
      n.data.tier = LayoutZone.NETWORKWORKLOAD
      n.parent = `container-network-workload-${n.data.region}`
    }
  })

  const paasNodes = nodeData.filter(n => n.data.tier === LayoutZone.PAAS)
  paasNodes.forEach(n => {
      if (!n.parent)  // set top nodes only
        n.parent = `container-paas-${n.data.region}`
  })



  // remove unconnected items unless they are containers or have a parent node
  const edgeIdsFrom = edgeData.map(e => e.from)
  const edgeIdsTo = edgeData.map(e => e.to)
  const edgeIds = [...new Set([...edgeIdsFrom, ...edgeIdsTo])]
  var canvasNodesVisible = nodeData.filter(n => edgeIds.includes(n.id) || n.data.type === "container" || n.parent != null)

  // remove empty containers
  canvasNodesVisible = canvasNodesVisible.filter(n => n.data.type === "service" || (n.data.type === "container" && nodeIsNonEmptyContainer(n)))
  
  // remove paasNodes that do not have connections
  const paasNodesDisconnected = paasNodes.filter(n => !edgeIds.includes(n.id) && n.data.type != 'container').map(n => n.id)

  // remove items in paasNodesDisconnected from canvasNodesVisible
  canvasNodesVisible = canvasNodesVisible.filter(n => !paasNodesDisconnected.includes(n.id))

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

  // if there are > 3 items of the same type within a 'compute' or 'analytics' container, replace them with a substitute node
  const containerIds = canvasNodesVisible.filter(n => n.data.type === "container" && (n.data.category === 'compute' || n.data.category == 'analytics') )
    .map(n => n.id)
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
            type: "container",
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

  // Set parent nodes to edges to address layout issues with deep nesting. See: https://github.com/reaviz/reaflow/issues/87
  const combinedNodes = [...canvasNodesVisible, ...canvasNodesHidden]
  const combinedEdges = [...canvasEdgesVisible, ...canvasEdgesHidden]

  combinedEdges.forEach(e => {
    // TODO: Consider re-factoring this logic to include both hidden and visible nodes in the same loop
    const fromNode = combinedNodes.find(n => n.id === e.from)
    const toNode = combinedNodes.find(n => n.id === e.to)
    if (fromNode) {
      if (fromNode.parent) {
        const parentNodeFrom = combinedNodes.find(n => n.id === fromNode?.parent)
        const parentnodeTo = combinedNodes.find(n => n.id === toNode?.parent)
        if (parentNodeFrom?.id === parentnodeTo?.id) {
          e.parent = parentNodeFrom?.id
        }
        if (fromNode.data.region !== toNode?.data.region) {
          // e.parent = parentNodeFrom?.id
          e.parent = parentNodeFrom?.parent
          // e.parent = fromNode.data.region
        }
        else {
          e.parent = fromNode.data.region
        }
      }
    }
  })

  // get nodes that are the from or two of an edge that has data.type === 'vnet-peering'
  const vnetPeeringEdges = canvasEdgesVisible.filter(e => e.data.type === 'vnetpeering')
  const vnetPeeringNodes = [...new Set([...vnetPeeringEdges.map(e => e.from), ...vnetPeeringEdges.map(e => e.to)])]
  const vnetPeeringNodesData = canvasNodesVisible.filter(n => vnetPeeringNodes.includes(n.id))
  vnetPeeringNodesData.forEach(n => {
    n.className = n.className + ' node-vnet-peered'
  })
  
  return [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden]
}