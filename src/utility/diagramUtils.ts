import { NodeData, EdgeData } from 'reaflow';
import { LayoutZone } from '../types/LayoutZone'

/**
 * 
 * @param node 
 * @param nodeDataVisible 
 * @param nodeDataHidden 
 * @param edgeDataVisible 
 * @param edgeDataHidden 
 * @returns 
 */
export const collapseContainer = (node: NodeData, nodeDataVisible: NodeData[], nodeDataHidden: NodeData[], edgeDataVisible: EdgeData[], edgeDataHidden: EdgeData[]) => {

    const nodesToHide = getChildrenNodes(node, nodeDataVisible);
    const edgesToHide = getEdgesForNodes(nodesToHide, edgeDataVisible);

    // remove peer nodes from display. We only want to see them when the container is expanded
    
    const edgesForContainer = getEdgesForNodes([...new Set([node])], edgeDataVisible, true);
    edgesForContainer.forEach(edge => {
        edgesToHide.push(edge);
    })

    const externalNodesToHide = getExternalNodesToHide(nodeDataVisible, edgeDataVisible, edgesToHide);
    nodesToHide.push(...externalNodesToHide);

    const emptyPaasContainers = getEmptyParentPaasContainer(nodesToHide, nodeDataVisible);
    nodesToHide.push(...emptyPaasContainers);

    // TODO: Logic in the above methods is resulting in duplicate nodes. Look into this. Fixed for now by using Set
    const hiddenNodes = [...new Set([...nodeDataHidden, ...nodesToHide])];
    const displayNodes = nodeDataVisible.filter(node => !nodesToHide.some((n: { id: string; }) => n.id === node.id));
    const hiddenEdges = [...edgeDataHidden, ...edgesToHide];
    const displayEdges = edgeDataVisible.filter(edge => !edgesToHide.some((e: { id: string; }) => e.id === edge.id));

    // cleanup for edges that are connected to nodes that are no longer visible
    // Example: external load balancer node as source connection for a public IP address node

    const edgesWithoutVisibleNodesFrom = displayEdges.filter(edge => !displayNodes.some((node: { id: string; }) => node.id === edge.from));
    edgesWithoutVisibleNodesFrom.forEach(edge => {
        const connectedNodes = getNodesForEdges([edge], displayNodes);

        connectedNodes.forEach(node => {
            hiddenNodes.push(node);
            hiddenEdges.push(edge);

            // remove node from displayNodes
            displayNodes.forEach((displayNode, index) => {
                if (displayNode.id === node.id) {
                    displayNodes.splice(index, 1);
                }
            });

            // remove edge from displayEdges
            displayEdges.forEach((displayEdge, index) => {
                if (displayEdge.id === edge.id) {
                    displayEdges.splice(index, 1);
                }
            });
        });
    })

    return [displayNodes, hiddenNodes, displayEdges, hiddenEdges];
}

/**
 * 
 * @param node 
 * @param nodeDataVisible 
 * @param nodeDataHidden 
 * @param edgeDataVisible 
 * @param edgeDataHidden 
 * @returns 
 */
export const expandContainer = (node: NodeData, nodeDataVisible: NodeData[], nodeDataHidden: NodeData[], edgeDataVisible: EdgeData[], edgeDataHidden: EdgeData[]) => {

    let nodesToDisplay = getChildrenNodes(node, nodeDataHidden, true);

    // if a summary node exists, filter out the the actual nodes
    const summaryNodes = nodesToDisplay.filter(node => node.data.category === 'summary');
    if (summaryNodes.length > 0) {
        const summaryNodeType = summaryNodes[0].data.servicename;
        nodesToDisplay = nodesToDisplay.filter(node => node.data.servicename !== summaryNodeType || node.data.category === 'summary');
    }

    const edgesToDisplay = getEdgesForNodes(nodesToDisplay, edgeDataHidden);

    // add peer nodes of the contianer to display
    const edgesForContainer = getEdgesForNodes([...new Set([node])], edgeDataHidden, true);

    edgesForContainer.forEach(edge => {
        if (!edgesToDisplay.some((e: { id: string; }) => e.id === edge.id)) {
            edgesToDisplay.push(edge);
        }
    })

    const externalNodesToDisplay = getNodesForEdges(edgesToDisplay, nodeDataHidden).map((node) => {
        if (!nodesToDisplay.some((n: { id: string; }) => n.id === node.id)) {
            return node;
        }
    }).filter((node) => node !== undefined);

    nodesToDisplay.push(...externalNodesToDisplay);

    externalNodesToDisplay.forEach((node) => {
        const parentNode = getParentPaasContainer(node, nodeDataHidden);
        if (parentNode !== undefined) {
            nodesToDisplay.push(parentNode);
        }
    });

    const hiddenNodes = nodeDataHidden.filter(node => !nodesToDisplay.some((n: { id: string; }) => n.id === node.id));
    const displayNodes = [...nodeDataVisible, ...nodesToDisplay];
    const hiddenEdges = edgeDataHidden.filter(edge => !edgesToDisplay.some((e: { id: string; }) => e.id === edge.id));
    const displayEdges = [...edgeDataVisible, ...edgesToDisplay];

    // Add any nodes that are connected to the nodes that are being displayed
    // Example: external load balancer node as source connection for a public IP address node
    const edgesToDisplayFromHidden = hiddenEdges
        .filter(edge => nodesToDisplay.some((node: { id: string; }) => node.id === edge.from))
        // exclude edges that are associated with a summary edge
        // expand / collape container will only show summary nodes
        .filter(edge => edge.data.hasSummary !== true); 

    edgesToDisplayFromHidden.forEach(edge => {
        const connectedNodes = getNodesForEdges([edge], hiddenNodes);

        connectedNodes.forEach(node => {
            displayNodes.push(node);
            displayEdges.push(edge);

            // remove node from hiddenNodes
            hiddenNodes.forEach((hiddenNode, index) => {
                if (hiddenNode.id === node.id) {
                    hiddenNodes.splice(index, 1);
                }
            });

            // remove edge from hiddenEdges
            hiddenEdges.forEach((hiddenEdge, index) => {
                if (hiddenEdge.id === edge.id) {
                    hiddenEdges.splice(index, 1);
                }
            });

        });
    })

    const displayNodesDeDuped = [...new Set(displayNodes)];
    const displayEdgesDeDuped = [...new Set(displayEdges)];
    const hiddenNodesDeDuped = [...new Set(hiddenNodes)];
    const hiddenEdgesDeDuped = [...new Set(hiddenEdges)];

    // TODO: this method is resulting in duplicate nodes and edges. Look into this. Fixed for now by using Set
    return [displayNodesDeDuped, hiddenNodesDeDuped, displayEdgesDeDuped, hiddenEdgesDeDuped];

}

/**
 * Returns the connection graph for a selected PaaS service
 * @param selectedNode 
 * @param visibleNodes 
 * @param visibleEdges
 * @param hiddenNodes
 * @param hiddenEdges 
 * @returns A tuple containing the filtered nodes and edges
 */
export const getConnectionGraphPaaS = (selectedNode: NodeData, visibleNodes: NodeData[], visibleEdges: EdgeData[], hiddenNodes: NodeData[], hiddenEdges: EdgeData[]): [NodeData[], EdgeData[]] => {

    const allNodes = [...visibleNodes, ...hiddenNodes];
    const allEdges = [...visibleEdges, ...hiddenEdges];

    let connectedEdges: NodeData[] = getEdgesForNodes([selectedNode], allEdges);
    let connectedNodes: NodeData[] = getNodesForEdges(connectedEdges, allNodes);

    // remove 'summary' items
    connectedNodes = connectedNodes.filter(node => node.data.category !== 'summary');
    connectedEdges = connectedEdges.filter(edge => edge.data.category !== 'summary');

    const connectedNodesParents = [...new Set(connectedNodes.map((node: NodeData) => getParentNodes(node, allNodes)).flat())];
    const connectedNodesChildren = connectedNodes.map((node: NodeData) => getChildrenNodes(node, allNodes)).flat();

    const vnetNodes = connectedNodesParents.filter(node => node.data.servicename === 'vnet');
    const [hybridNetworkingNodes, hybridNetworkingEdges] = getHybridNetworkingObjects(vnetNodes, visibleNodes, hiddenNodes, visibleEdges, hiddenEdges);

    const filteredEdges = [...new Set([...connectedEdges, ...hybridNetworkingEdges])];
    const filteredNodes = [...new Set([...connectedNodes, ...connectedNodesParents, ...connectedNodesChildren, ...hybridNetworkingNodes])];

    // get nodes with servicename === subnet that have children nodes
    const subnetNodes = filteredNodes.filter(node => node.data.servicename === 'subnet');
    const subnetNodesWithChildren = subnetNodes.filter(node => getChildrenNodes(node, filteredNodes).length > 0);

    subnetNodesWithChildren.forEach(node => {
        node.data.status = 'open';
    })

    return [filteredNodes, filteredEdges];
}

/**
 * Returns the connection graph for a selected VNet injected service
 * @param selectedNode 
 * @param visibleNodes
 * @param visibleEdges
 * @param hiddenNodes
 * @param hiddenEdges
 * @returns A tuple containing the filtered nodes and edges
 */
export const getConnectionGraphVnetInjected = (selectedNode: NodeData, visibleNodes: NodeData[], visibleEdges: EdgeData[], hiddenNodes: NodeData[], hiddenEdges: NodeData[]) => {

    const allNodes = [...visibleNodes, ...hiddenNodes];
    const allEdges = [...visibleEdges, ...hiddenEdges];

    const connectedSelectedNodeEdges: EdgeData[] = getEdgesForNodes([selectedNode], allEdges, true);
    const connectedSelectedNodeNodes: NodeData[] = getNodesForEdges(connectedSelectedNodeEdges, allNodes);

    const downstreamEdges: EdgeData[] = getEdgesForNodes(connectedSelectedNodeNodes, allEdges, true).filter(edge => !connectedSelectedNodeEdges.some((e: { id: string; }) => e.id === edge.id));
    const downstreamNodes: NodeData[] = getNodesForEdges(downstreamEdges, allNodes);

    connectedSelectedNodeEdges.push(...downstreamEdges);
    connectedSelectedNodeNodes.push(...downstreamNodes);

    const parentNodes: NodeData[] = getParentNodes(selectedNode, allNodes);

    // get parent container for nodes in the PAAS layout zone
    const paasNodes: NodeData[] = connectedSelectedNodeNodes.filter(node => node.data.layoutZone === LayoutZone.PAAS);
    const paasParentNodes: NodeData[] = paasNodes.map(node => getParentNodes(node, allNodes)).flat();

    // get peer nodes in subnet
    const parentSubnet: NodeData = parentNodes.find(node => node.data.servicename === 'subnet');
    const peerNodes: NodeData[] = getChildrenNodes(parentSubnet, allNodes).filter((peerNode: { id: string; }) => peerNode.id != selectedNode.id);

    // get nodes connected to parent nodes and their parent containers
    const connectedParentNodeEdges: EdgeData[] = getEdgesForNodes(parentNodes, allEdges, true);
    const connectedParentNodeNodes: NodeData[] = getNodesForEdges(connectedParentNodeEdges, allNodes);
    const connectedNodesParentNodes: NodeData[] = connectedParentNodeNodes.map(node => getParentNodes(node, allNodes)).flat();
    const connectedNodesChildren: NodeData[] = connectedParentNodeNodes.filter(n => n.data.servicename !== 'vnet').map(node => getChildrenNodes(node, allNodes)).flat();
    
    // get hybrid networking objects
    const connectedVnetNodes = connectedParentNodeNodes.filter(node => node.data.servicename === 'vnet').filter((node: { id: string; }) => !parentNodes.some((parentNode: { id: string; }) => parentNode.id === node.id));
    let hybridNetworkingNodes: NodeData[] = [];
    let hybridNetworkingEdges: EdgeData[] = [];
    if (connectedVnetNodes.length > 0) {
        [hybridNetworkingNodes, hybridNetworkingEdges] = getHybridNetworkingObjects(connectedVnetNodes, visibleNodes, hiddenNodes, visibleEdges, hiddenEdges);
    }
    
    const filteredNodes = [selectedNode, ...parentNodes, ...paasParentNodes, ...peerNodes, ...connectedParentNodeNodes, ...hybridNetworkingNodes, ...connectedSelectedNodeNodes, ...connectedNodesParentNodes, ...connectedNodesChildren].flat();
    const filteredNodesUnique = [...new Set(filteredNodes)];
    const filteredEdges = [connectedParentNodeEdges, ...hybridNetworkingEdges, ...connectedSelectedNodeEdges].flat();
    const filteredEdgesUnique = [...new Set(filteredEdges)];

    return [filteredNodesUnique, filteredEdgesUnique];
}

/**
 * Takes a list of nodes and returns a new summary node. Edges are also updated to point to the new summary node
 * @param nodes
 * @param edges
 * @returns An array containing the new nodes, new edges, hidden nodes, and hidden edges
 */
export const createSummaryNodes = (nodes: NodeData[], edges: EdgeData[]) => {

    const summaryNodes: NodeData[] = [];
    const summaryEdges: EdgeData[] = [];
    const hiddenNodes: NodeData[] = [];
    const hiddenEdges: EdgeData[] = [];
    const serviceNames = [...new Set(nodes.map(n => n.data.servicename))]

    serviceNames.forEach(servicename => {
        const nodesOfType = nodes.filter(n => n.data.servicename === servicename)
        const node = nodesOfType[0]

        const newNode = {
        id: `${node.parent}-${node.data.servicename}-summary`,
        parent: node.parent,
        height: node.height,
        width: node.width,
        data: {
            type: node.data.type,
            category: "summary",
            region: node.data.region,
            layoutZone: node.data.layoutZone,
            servicename: node.data.servicename,
            label: `${nodesOfType.length} ${node.data.servicename}s`,
            url: node.data.url,
            isSubstitute: true
            }
        }
        
        summaryNodes.push(newNode)
        
        nodesOfType.forEach(n => {
            const edgesToCreateTo = edges.filter(e => e.to === n.id)
            edgesToCreateTo.forEach(e => {
                const newEdge = {
                    id: `${e.id}-summary`,
                    from: e.from,
                    to: newNode.id,
                    className: e.className,
                    data: {
                        type: e.data.type,
                        category: "summary"
                    }
                }
                const existingEdge = summaryEdges.find(ef => ef.from === newEdge.from && ef.to === newEdge.to)
                if (!existingEdge)            
                    summaryEdges.push(newEdge)
                })

            const edgesToCreateFrom = edges.filter(e => e.from === n.id)
            edgesToCreateFrom.forEach(e => {
                const newEdge = {
                    id: `${e.id}-summary`,
                    from: newNode.id,
                    to: e.to,
                    className: e.className,
                    data: {
                        type: e.data.type,
                        category: "summary"
                    }
                }
                const existingEdge = summaryEdges.find(ef => ef.from === newEdge.from && ef.to === newEdge.to)
                if (!existingEdge)
                    summaryEdges.push(newEdge)
                })

            const edgesToRemove = edges.filter(e => e.from === n.id || e.to === n.id)
            edgesToRemove.forEach(e => {
                e.data.hasSummary = true
                hiddenEdges.push(e)
            })
            nodesOfType.forEach(n => {
                n.data.hasSummary = true
                hiddenNodes.push(n)
            })
        })
        
    })

    return [summaryNodes, summaryEdges, hiddenNodes, hiddenEdges];
}

/**
 * This is a recursive function that returns all parent nodes of a given node
 * @param node 
 * @param nodeData 
 * @returns A list of all parent nodes, including all ancestors
 */
const getParentNodes = (node: NodeData, nodeData: NodeData[]) => {
    const parentNodes = nodeData.filter(parentNode => {
        if (parentNode.id === node.parent) {
            return true;
        }
        return false;
    });

    if (parentNodes.length === 0) {
        return [];
    }

    return [...parentNodes, ...getParentNodes(parentNodes[0], nodeData)];
}

/**
 * This is a function that returns the parent node of a given node
 * @param node 
 * @param nodeData 
 * @returns The parent node
 */
/*
const getParentNode = (node: NodeData, nodeData: NodeData[]) => {
    const parentNode = nodeData.filter(parentNode => {
        if (parentNode.id === node.parent) {
            return true;
        }
        return false;
    });
}
*/

/**
 * This is a recursive function that returns all descendant nodes of a given node
 * @param node 
 * @param nodeData
 * @param singleLevel If true, only return the immediate children of the node
 * @returns A list of all child nodes
 */
const getChildrenNodes = (node: NodeData, nodeData: NodeData[], singleLevel: boolean = false) => {

    if (!node) return;

    if (singleLevel) {
        const childrenNodes = nodeData.filter(n => {
            if (n.parent === node.id) {
                return true;
            }
            return false;
        });
        return childrenNodes;
    }

    const childrenNodes = nodeData.filter(n => {
        if (n.parent === node.id) {
            return true;
        }
        return false;
    });

    if (childrenNodes.length === 0) {
        return [];
    }

    for (let i = 0; i < childrenNodes.length; i++) {
        const childNode = childrenNodes[i];
        const childNodeChildren = getChildrenNodes(childNode, nodeData);
        childrenNodes.push(...childNodeChildren);
    }

    return childrenNodes
}

/**
 * 
 * @param edges
 * @param nodeData
 * @returns A list of nodes connected to the edges
 */
const getNodesForEdges = (edges: EdgeData[], nodeData: NodeData[]) => {

    const connectedNodes = edges.map(edge => {
        const connectedNode = nodeData.filter(node => {
            if (node.id === edge.from || node.id === edge.to) {
                return true;
            }
            return false;
        });
        return connectedNode;
    }).flat();

    return [...new Set(connectedNodes)];
}

const getEdgesForNodes = (nodes: NodeData[], edgeData: EdgeData[], excludeSummaryEdges: boolean = false) => {
    const connectedEdges = nodes.map(node => {
        const connectedEdge = edgeData.filter(edge => {
            if (edge.from === node.id || edge.to === node.id) {
                if (excludeSummaryEdges && edge.data.category === 'summary') {
                    return false;
                }
                return true;
            }
            return false;
        });
        return connectedEdge;
    }).flat();

    let filteredEdges = connectedEdges;

    // if we summary edges are included, filter out non-summary edges
    if (!excludeSummaryEdges) {
        filteredEdges = connectedEdges.filter(edge => edge.data.hasSummary !== true);
    }
    return [...new Set(filteredEdges)];
}

const getHybridNetworkingObjects = (vnetNodes: NodeData[], visibleNoddes: NodeData[], hiddenNodes: NodeData[], visibleEdges: EdgeData[], hiddenEdges: EdgeData[]) => {
// const getHybridNetworkingObjects = (vnetNodes: NodeData[], nodes: NodeData[], edges: EdgeData[]) => {

    const nodes = [...visibleNoddes, ...hiddenNodes];
    const edges = [...visibleEdges, ...hiddenEdges];
    const hubVnetNodes: NodeData[] = [];
    const hubVnetEdges: EdgeData[] = [];
    const hybridNetworkConnectionNodes: NodeData[] = [];
    const hybridNetworkConnectionEdges: EdgeData[] = [];
    const peeringLocationNodes: NodeData[] = [];
    const peeringLocationEdges: EdgeData[] = [];

    // get any VNET with a peering connection with a 'to' referencing an item in vnetNodes
    const vnetIds = vnetNodes.map(node => node.id);
    const peeringEdges = edges.filter(edge => edge.data.type === 'vnetpeering' && vnetIds.includes(edge.to));
    const peeringNodes = getNodesForEdges(peeringEdges, nodes).filter((node: { id: string; }) => !vnetNodes.some((vnetNode: { id: string; }) => vnetNode.id === node.id)).flat();
    const peeringEdgesToPeeringNodes = edges.filter(edge => edge.data.type === 'vnetpeering' && peeringNodes.some((peeringNode: { id: string; }) => peeringNode.id === edge.to));

    hubVnetNodes.push(...vnetNodes);
    hubVnetEdges.push(...peeringEdges);
    hubVnetNodes.push(...peeringNodes);
    hubVnetEdges.push(...peeringEdgesToPeeringNodes);

    const hubVnetChildren: NodeData[] = hubVnetNodes.filter(n => n.data.layoutZone === LayoutZone.NETWORKCORE).map((node: NodeData) => getChildrenNodes(node, nodes, true)).flat();

    // get objects that connect to vnet gateways
    const gatewaySubnet: NodeData = hubVnetChildren.filter(n => n.data.label === "GatewaySubnet")[0];
    const gatewaySubnetNodes: NodeData[] = getChildrenNodes(gatewaySubnet, nodes, true);
    const vnetGatewayNodes = gatewaySubnetNodes.filter(node => node.data.servicename === 'vpngateway');

    vnetGatewayNodes.map(node => {
        const connectedEdges: EdgeData[] = edges.filter(edge => edge.to === node.id);
        const connectedNodes: NodeData[] = getNodesForEdges(connectedEdges, nodes)
            .filter((node: { id: string; }) => !hubVnetChildren.some((vnetChildNode: { id: string; }) => vnetChildNode.id === node.id)).flat();
        
        hybridNetworkConnectionEdges.push(...connectedEdges);

        connectedNodes.map(node => {
            if (!hybridNetworkConnectionNodes.some((connectionObject: { id: string; }) => connectionObject.id === node.id)) {
                hybridNetworkConnectionNodes.push(node);
                // get parent nodes or node
                const parentNodes: NodeData[] = getParentNodes(node, nodes);

                parentNodes.map(n => {
                    if (!hybridNetworkConnectionNodes.some((connectionObject: { id: string; }) => connectionObject.id === n.id)) {
                        hybridNetworkConnectionNodes.push(n);
                    }
                });
            }
        });
    });
    

    // get objects that connect to vpn / expressroute
    
    hybridNetworkConnectionNodes.filter(n => n.data?.servicename === 'expressroutecircuit').map(node => {
        const connectedEdges: EdgeData[] = edges.filter(edge => edge.to === node.id);
        const connectedNodes: NodeData[] = getNodesForEdges(connectedEdges, nodes)
            .filter((node: { id: string; }) => !hybridNetworkConnectionNodes.some((connectionObject: { id: string; }) => connectionObject.id === node.id)).flat();
        peeringLocationEdges.push(...connectedEdges);

        connectedNodes.map(node => {
            if (!peeringLocationNodes.some((peeringLocation: { id: string; }) => peeringLocation.id === node.id)) { peeringLocationNodes.push(node); }
        });
    });
    

    const hybridNetworkingNodes: NodeData[] = [...hubVnetNodes, ...hubVnetChildren, ...hybridNetworkConnectionNodes, ...peeringLocationNodes].flat();
    const hybridNetworkingEdges: EdgeData[] = [...hubVnetEdges, ...hybridNetworkConnectionEdges, ...peeringLocationEdges].flat();
    return [hybridNetworkingNodes, hybridNetworkingEdges]
}

/**
 * Returns a list of nodes that are connected to the edges input that are to be hidden
 * @param visibleNodes All visibile nodes
 * @param edges Edges that are to be hidden
 * @returns 
 */
const getExternalNodesToHide = (visibleNodes: NodeData[], visibleEdges: EdgeData[], edgesToHide: EdgeData[]): NodeData[] => {

    // TODO: re-factor into a separate function and account for external nodes that still have valid connections
    const externalNodesToHide: NodeData[] = getNodesForEdges(edgesToHide, visibleNodes).map((node) => {
        if (visibleNodes.some((n: { id: string; }) => n.id === node.id)) {
            // node is visible and might need to be hidden
            // get list of edges connected to node that are not in edgesToHide

            const connectedEdges = visibleEdges.filter(edge => edge.from === node.id || edge.to === node.id)
                .filter((edge: { id: string; }) => !edgesToHide.some((e: { id: string; }) => e.id === edge.id));
            
            if (connectedEdges.length === 0) {
                if (node.data.type !== 'container')
                    return node;
            }

            // nodes might be connected to downstream nodes that are not in the list of nodes to hide.
            // Example: external load balancer connected to a public IP address
            if (connectedEdges.length === 1) {

                if (edgesToHide.some((edge: EdgeData<unknown>) => edge.to === node.id)) {

                    const connectedEdgesFromNode = visibleEdges.filter(edge => edge.from === node.id);

                    if (connectedEdgesFromNode.length > 0) {
                        return node;
                    }
                }
            }

        }
    }).filter((node) => node !== undefined);

    // get parent node for each item in externalNodesToHide
    externalNodesToHide.forEach((node) => {
        const parentNode = getParentPaasContainer(node, visibleNodes);
        if (parentNode !== undefined) {
            externalNodesToHide.push(parentNode);
        }
    });

    return externalNodesToHide;
}

/**
 * Returns the parent PaaS container for a given node
 * @param nodes 
 * @returns 
 */
const getParentPaasContainer = (node: NodeData, nodes: NodeData[]) => {

    const parentNode = nodes.filter(n => { 
        if (n.id === node.parent && n.data.layoutZone === LayoutZone.PAAS && n.data.type === 'container') {
            return true;
        }
        return false;
    }).flat();

    return parentNode[0];
}

/**
 * Returns the nodes that are empty parent 
 * @param nodesBeingHidden
 * @param visibleNodes 
 * @returns 
 */
const getEmptyParentPaasContainer = (nodesBeingHidden: NodeData[], visibleNodes: NodeData[]) => {
    
        const emptyPaasContainers = visibleNodes.filter(node => {
            if (node.data.type === 'container' && node.data.layoutZone === LayoutZone.PAAS ) {
                // return true if container has no children
                const children = getChildrenNodes(node, visibleNodes).filter((node: { id: string; }) => !nodesBeingHidden.some((n: { id: string; }) => n.id === node.id))
                if (children.length === 0) {
                    return true;
                }
            }
            return false;
        });
    
        return emptyPaasContainers;
}


