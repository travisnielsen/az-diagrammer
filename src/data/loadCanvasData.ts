import { NodeData, EdgeData, ElkNodeLayoutOptions } from 'reaflow';
import { getNodeData } from './nodeData'
import { getEdgeData } from './edgeData'
import { LoadAzureData } from './loadAzureData'
import { collapseContainer, createSummaryNodes } from '../utility/diagramUtils';
import { LayoutZone } from '../types/LayoutZone';
import { DiagramConfiguration } from "../types/DiagramConfiguration";
import { DemoData } from './demo/DemoData';

export const loadCanvasData = async (config: DiagramConfiguration, accessToken?: string): Promise<[NodeData[], NodeData[], EdgeData[], EdgeData[]]> => {

  if (config.connectionString.toLowerCase() === 'demo') {
    console.info("Loading demo data")
    const demoData = new DemoData()
    const canvasNodesVisible: NodeData[] = demoData.NodesVislbe
    const canvasNodesHidden: NodeData[] = demoData.NodesHidden
    const canvasEdgesVisible: EdgeData[] = demoData.EdgesVisible
    const canvasEdgesHidden: EdgeData[] = demoData.EdgesHidden
    return [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden]
  }

  console.info("Loading data from configuration: " + config.name);
  const azureData = await LoadAzureData(config.connectionString, config.containerName, config.folderName, accessToken);

  if (!azureData) {
    console.log("no azure data found");
    const nodeDataVisible: NodeData[] = []
    const nodeDataHidden: NodeData[] = []
    const edgeDataVisible: EdgeData[] = []
    const edgeDataHidden: EdgeData[] = []
    return [nodeDataVisible, nodeDataHidden, edgeDataVisible, edgeDataHidden]
  }

  const nodeData = getNodeData(azureData);
  const edgeData = getEdgeData(azureData, config).filter(e => e !== undefined);

  // const testEdge = edgeData.filter(e => e.id === "eventhub-serviceendpointrule-rpuprodinthsdeastus2vnet02rg-rpuprodinthsdeastus2vnet02-rpuprodinthsdeastus2vnet02akssn01-to-idiprodcusrg-default")
  // console.log(testEdge);

  /*
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
  */

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

  const regions = [...new Set(nodeData.map(n => n.data.region))]
  const index = regions.indexOf('');
  if (index > -1) {
    regions.splice(index, 1);
  }

  // overall parent container for all diagram elements
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

  // layout container to host global network resources (ExpressRoute)
  nodeData.push({
    id: 'global',
    parent: 'topContainer',
    layoutOptions: layoutContainerlayoutOptions,
    className: 'layout-container',
    data: {
      type: "container",
      category: "layout",
    }
  })
  
  // region containers
  regions.forEach(region => {
    const regionNameLowerCase = region.toLowerCase()
    const existingNode = nodeData.find(n => n.data.category === "region" && n.data.region === regionNameLowerCase)
    if (!existingNode && region !== "global" && region) {
      const newNode = {
        id: regionNameLowerCase,
        parent: 'topContainer',
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
  
  // layout containers for network and paas resources
  regions.forEach(region => {
    nodeData.push({
      id: `container-network-workload-${region}`,
      layoutOptions: layoutContainerlayoutOptions,
      parent: region,
      className: 'layout-container',
      data: {
        type: 'container',
        category: 'layout',
      }
    })
    nodeData.push({
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

  const hubNetIDs: string[] = []

  // regional services parent assignment
  const regionalServices = nodeData.filter(n => n.data.layoutZone === LayoutZone.REGION || n.data.layoutZone === LayoutZone.NETWORKCORE)
  regionalServices.forEach(n => {
    const region = n.data.region
    const regionContainer = nodeData.find(nf => nf.data.category === "region" && nf.data.region === region)
    if (regionContainer) {
      if (!n.parent)
        n.parent = regionContainer.id
    }
  })

  // service layout container assignments
  // separate vnets into core (hub) and workload (spoke) vnets. Add spoke vnets as child nodes to 'container-network-workload' for layout purposes
  const vnetNodes = nodeData.filter(n => n.data.servicename === "vnet")
  vnetNodes.forEach(n => {

    const childNodes = nodeData.filter(nf => nf.parent === n.id)
    const hasGatewaySubnet = childNodes.findIndex(nf => nf.data.label === "GatewaySubnet") > 0

    if (hasGatewaySubnet) {
      n.data.layoutZone = LayoutZone.NETWORKCORE
      n.parent = n.data.region
      n.data.role = "hub"
      hubNetIDs.push(n.id)
    } else {
      n.data.layoutZone = LayoutZone.NETWORKWORKLOAD
      n.parent = `container-network-workload-${n.data.region}`
    }
  })

  // PaaS nodes
  const paasNodes = nodeData.filter(n => n.data.layoutZone === LayoutZone.PAAS)
  paasNodes.forEach(n => {
    if (!n.parent)  // set top nodes only
      n.parent = `container-paas-${n.data.region}`
  })

  // place expressroute circuits into the global container and set tier to 'hybrid connection'
  const globalServicesNodes = nodeData.filter(n => n.data.layoutZone === LayoutZone.GLOBAL)
  globalServicesNodes.forEach(n => {
    if (!n.parent) { // set top nodes only
      n.parent = 'global';
      n.data.layoutZone = LayoutZone.GLOBAL;
    }

  })

  // remove any nodes from nodedata that are in the parent 'global' container that do not have edges
  const globalNodes = nodeData.filter(n => n.parent === 'global' && n.data.type !== 'container')
  globalNodes.forEach(n => {
    const edges = edgeData.filter(e => e.from === n.id || e.to === n.id)
    if (edges.length === 0) {
      const index = nodeData.findIndex(nf => nf.id === n.id)
      nodeData.splice(index, 1)
    }
  })

  // some VNETS may not have a gateway subnet but still should be placed in the NETWORKCORE layout zone. These are typically 'bridge' VNETs
  // I identify them as VNETS Nodes that have multiple egdes (peering), which is due to the circular / redundant bi-directional VNET peering objects in the source data
  const nodeIdsTo = edgeData.filter(e => e.data?.type === "vnetpeering").map(e => e.to)
  const nodesWithMultipleEdges = nodeIdsTo.filter(n => nodeIdsTo.filter(e => e === n).length > 1)

  nodesWithMultipleEdges.forEach(n => {
    const node = nodeData.find(nf => nf.id === n)
    if (node && node.data?.servicename === 'vnet' && node.data.layoutZone !== LayoutZone.NETWORKCORE) {
      node.data.layoutZone = LayoutZone.NETWORKCORE
      node.parent = node.data.region
    }
  })

  // Remove duplicate / bi-directional VNET peering edges and adjust for peering relationships between vnets in the same layout zone
  const networkCoreNodes = nodeData.filter(n => n.data.layoutZone === LayoutZone.NETWORKCORE)
  const networkCoreNodeIds = networkCoreNodes.map(n => n.id)
  const vnetPeeringEdges = edgeData.filter(e => e.data.type === 'vnetpeering')

  vnetPeeringEdges.forEach(e => {
    if (networkCoreNodeIds.includes((e.to || '') && (e.from || ''))) {
      if (hubNetIDs.includes(e.to || '')) {
        const index = edgeData.findIndex(ef => ef.id === e.id)
        edgeData.splice(index, 1)
      }
    }
    else if (networkCoreNodeIds.includes(e.to || '')) {
      const index = edgeData.findIndex(ef => ef.id === e.id)
      edgeData.splice(index, 1)
    }
  })

  // adjustment for DNS connections where the source and target are in the same layout region (self reference)
  // example: dns server in a VNET that has the DNS server IP address. ELK will not allow edges that point to a granparent node in this way
  const dnsEdges = edgeData.filter(e => e.data.type === "dns")
  dnsEdges.forEach(e => {
    const fromNode = nodeData.find(n => n.id === e.from)
    const fromNodeParent = nodeData.find(n => n.id === fromNode?.parent)
    const fromNodeGrandParent = nodeData.find(n => n.id === fromNodeParent?.parent)
    const toNode = nodeData.find(n => n.id === e.to)
    if (fromNodeGrandParent?.data.layoutZone === toNode?.data.layoutZone) {
      const index = edgeData.findIndex(ef => ef.id === e.id)
      edgeData.splice(index, 1)
    }
  })

  // REMOVE unconnected items unless they are containers or have a parent node
  const edgeIdsFrom = edgeData.map(e => e.from)
  const edgeIdsTo = edgeData.map(e => e.to)
  const edgeIds = [...new Set([...edgeIdsFrom, ...edgeIdsTo])]
  let canvasNodesVisible = nodeData.filter(n => edgeIds.includes(n.id) || n.data.type === "container" || n.parent != null)

  // remove empty containers
  // canvasNodesVisible = canvasNodesVisible.filter(n => n.data.type === "service" || (n.data.type === "container" && nodeIsNonEmptyContainer(n)))
  
  // remove paasNodes that do not have connections
  const paasNodesDisconnectedIds = paasNodes.filter(n => !edgeIds.includes(n.id) && n.data.type != 'container').map(n => n.id)
  canvasNodesVisible = canvasNodesVisible.filter(n => !paasNodesDisconnectedIds.includes(n.id))

  let canvasEdgesVisible = edgeData.filter(e => edgeIds.includes(e.from || '') && edgeIds.includes(e.to || ''))
  let canvasEdgesHidden = edgeData.filter(e => !canvasEdgesVisible.includes(e))
  let canvasNodesHidden: NodeData[] = []

  // if there are > 3 items of the same type within a container, replace them with a substitute node
  const nodesToReplaceWithSummaryNode: NodeData[] = [];
  const containerIds = canvasNodesVisible.filter(n => n.data.type === "container" && n.data.category !== 'layout').map(n => n.id)

  containerIds.forEach(id => {
    const childNodes = canvasNodesVisible.filter(n => n.parent === id)
    const childNodeServiceNames = [...new Set(childNodes.map(n => n.data.servicename))]
    
    childNodeServiceNames.forEach(servicename => {
      const nodesOfType = childNodes.filter(n => n.data.servicename === servicename && n.data.type !== "container")
      if (nodesOfType.length > 3) {
        nodesToReplaceWithSummaryNode.push(...nodesOfType)
      }
    })
    
  })

  const [summaryNodes, summaryEdges, hiddenNodes, hiddenEdges] = createSummaryNodes(nodesToReplaceWithSummaryNode, canvasEdgesVisible)
  canvasNodesVisible = canvasNodesVisible.concat(summaryNodes)
  canvasEdgesVisible = canvasEdgesVisible.concat(summaryEdges)
  canvasNodesVisible = canvasNodesVisible.filter(n => !hiddenNodes.includes(n))
  canvasEdgesVisible = canvasEdgesVisible.filter(e => !hiddenEdges.includes(e))

  canvasNodesHidden = canvasNodesHidden.concat(hiddenNodes)
  canvasEdgesHidden = canvasEdgesHidden.concat(hiddenEdges)

  // Set parent nodes to edges to address layout issues with deep nesting. See: https://github.com/reaviz/reaflow/issues/87
  const combinedNodes = canvasNodesVisible.concat(canvasNodesHidden);
  const combinedEdges = canvasEdgesVisible.concat(canvasEdgesHidden);

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
        // cross-region connections - need to set parent to 'topContainer'
        else if (fromNode.data.region !== toNode?.data.region && toNode?.data.region !== 'global') {
          e.parent = 'topContainer'
        }
        else {
          e.parent = fromNode.data.region
        }
      }
    }
  })

  // get nodes that are the from or two of an edge that has data.type === 'vnet-peering'
  const vnetPeeringNodes = [...new Set([...vnetPeeringEdges.map(e => e.from), ...vnetPeeringEdges.map(e => e.to)])]
  const vnetPeeringNodesData = canvasNodesVisible.filter(n => vnetPeeringNodes.includes(n.id))
  vnetPeeringNodesData.forEach(n => {
    n.className = n.className + ' node-vnet-peered'
  })

  // iterate through all subnets and set data.status to 'closed'.
  
  const subnetNodes = canvasNodesVisible.filter(n => n.data.servicename === "subnet")
  subnetNodes.forEach(n => {
    // collapse subnets except for hub vnets
    if (n.data.label !== "GatewaySubnet") {
      [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden] = collapseContainer(n, canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden)
      n.data.status = "closed"
    }
  })
  
  /*
  subnetNodes.forEach(n => {
    // collapse subnets except for hub vnets
    const parent = canvasNodesVisible.find(nf => nf.id === n.parent)
    if (parent && parent.data.layoutZone !== LayoutZone.NETWORKCORE) {
      [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden] = collapseContainer(n, canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden)
      n.data.status = "closed"
    }
  })
  */
  
  return [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden]
}