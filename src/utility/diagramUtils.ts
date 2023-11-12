import { NodeData, EdgeData } from 'reaflow';
import { store } from '../store';



/**
 * 
 * @param node 
 * @param nodeDataVisible 
 * @param nodeDataHidden 
 * @param edgeDataVisible 
 * @param edgeDataHidden 
 * @returns 
 */
export const collapseContainer: any = (node: NodeData, nodeDataVisible: NodeData[], nodeDataHidden: NodeData[], edgeDataVisible: EdgeData[], edgeDataHidden: EdgeData[]) => {

    const nodesToHide = getChildrenNodes(node, nodeDataVisible);
    const edgesToHide = getEdgesFromNodes(nodesToHide, edgeDataVisible);    
    const externalNodesToHide = getExternalNodesToHide(nodeDataVisible, edgeDataVisible, edgesToHide);
    nodesToHide.push(...externalNodesToHide);
    // TODO: Logic in the above methods is resulting in duplicate nodes. Look into this. Fixed for now by using Set
    const hiddenNodes = [...new Set([...nodeDataHidden, ...nodesToHide])];
    const displayNodes = nodeDataVisible.filter(node => !nodesToHide.some((n: { id: string; }) => n.id === node.id));
    const hiddenEdges = [...edgeDataHidden, ...edgesToHide];
    const displayEdges = edgeDataVisible.filter(edge => !edgesToHide.some((e: { id: string; }) => e.id === edge.id));
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
export const expandContainer: any = (node: NodeData, nodeDataVisible: NodeData[], nodeDataHidden: NodeData[], edgeDataVisible: EdgeData[], edgeDataHidden: EdgeData[]) => {

    const nodesToDisplay = getChildrenNodes(node, nodeDataHidden);
    const edgesToDisplay = getEdgesFromNodes(nodesToDisplay, edgeDataHidden);

    const externalNodesToDisplay = getNodesFromEdges(edgesToDisplay, nodeDataHidden).map((node: any) => {
        if (!nodesToDisplay.some((n: { id: string; }) => n.id === node.id)) {
            return node;
        }
    }).filter((node: any) => node !== undefined);

    nodesToDisplay.push(...externalNodesToDisplay);

    const hiddenNodes = nodeDataHidden.filter(node => !nodesToDisplay.some((n: { id: string; }) => n.id === node.id));
    const displayNodes = [...nodeDataVisible, ...nodesToDisplay];

    const hiddenEdges = edgeDataHidden.filter(edge => !edgesToDisplay.some((e: { id: string; }) => e.id === edge.id));
    const displayEdges = [...edgeDataVisible, ...edgesToDisplay];

    return [displayNodes, hiddenNodes, displayEdges, hiddenEdges];
}

/**
 * Returns the connection graph for a selected PaaS service
 * @param selectedNode 
 * @param nodes 
 * @param edges 
 * @returns A tuple containing the filtered nodes and edges
 */
export const getConnectionGraphPaaS = (selectedNode: NodeData, nodes: NodeData[], edges: EdgeData[]): [NodeData[], EdgeData[]] => {

    const connectedEdges: NodeData[] = getEdgesFromNodes([selectedNode], edges);
    const connectedNodes: NodeData[] = getNodesFromEdges(connectedEdges, nodes);
    const connectedNodesParents = [...new Set(connectedNodes.map((node: NodeData) => getParentNodes(node, nodes)).flat())];
    const connectedNodesChildren = connectedNodes.map((node: NodeData) => getChildrenNodes(node, nodes)).flat();
    // const vnetNodes = connectedNodesParents.filter(node => node.data.servicename === 'vnet');
    // const [hybridNetworkingNodes, hybridNetworkingEdges] = getHybridNetworkingObjects(vnetNodes, nodes, edges);
    const filteredEdges = [connectedEdges].flat();
    const filteredNodes = [connectedNodes, ...connectedNodesParents, ...connectedNodesChildren].flat();
    return [filteredNodes, filteredEdges];
}

/**
 * Returns the connection graph for a selected VNet injected service
 * @param selectedNode 
 * @param nodes 
 * @param edges 
 * @returns A tuple containing the filtered nodes and edges
 */
export const getConnectionGraphVnetInjected = (selectedNode: NodeData, nodes: NodeData[], edges: EdgeData[]) => {
    const connectedSelectedNodeEdges: EdgeData[] = getEdgesFromNodes([selectedNode], edges);
    const connectedSelectedNodeNodes: NodeData[] = getNodesFromEdges(connectedSelectedNodeEdges, nodes);

    const parentNodes: NodeData[] = getParentNodes(selectedNode, nodes);

    // get peer nodes in subnet
    const parentSubnet: NodeData | any = parentNodes.find(node => node.data.servicename === 'subnet');
    const peerNodes: NodeData[] = getChildrenNodes(parentSubnet, nodes).filter((peerNode: { id: string; }) => peerNode.id != selectedNode.id);

    // get nodes connected to parent nodes
    const connectedParentNodeEdges: EdgeData[] = getEdgesFromNodes(parentNodes, edges);
    const connectedNodes: NodeData[] = getNodesFromEdges(connectedParentNodeEdges, nodes);

    const connectedNodesParentNodes: NodeData[] =  connectedNodes.map(node => getParentNodes(node, nodes)).flat();

    const connectedVnetNodes = connectedNodes.filter(node => node.data.servicename === 'vnet').filter((node: { id: string; }) => !parentNodes.some((parentNode: { id: string; }) => parentNode.id === node.id));
    const [hybridNetworkingNodes, hybridNetworkingEdges] = getHybridNetworkingObjects(connectedVnetNodes, nodes, edges);
    const filteredNodes = [selectedNode, ...parentNodes, ...peerNodes, ...connectedNodes, ...hybridNetworkingNodes, ...connectedSelectedNodeNodes, ...connectedNodesParentNodes].flat();
    const filteredNodesUnique = [...new Set(filteredNodes)];
    const filteredEdges = [connectedParentNodeEdges, ...hybridNetworkingEdges, ...connectedSelectedNodeEdges].flat();

    return [filteredNodesUnique, filteredEdges];
}

const getParentNodes: any = (node: NodeData, nodeData: NodeData[]) => {
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
 * This is a recursive function that returns all descendant nodes of a given node
 * @param node 
 * @param nodeData 
 * @returns A list of all child nodes, including all descendants
 */
const getChildrenNodes: any = (node: NodeData, nodeData: NodeData[]) => {
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
const getNodesFromEdges: any = (edges: EdgeData[], nodeData: NodeData[]) => {
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

const getEdgesFromNodes: any = (nodes: NodeData[], edgeData: EdgeData[]) => {
    const connectedEdges = nodes.map(node => {
        const connectedEdge = edgeData.filter(edge => {
            if (edge.from === node.id || edge.to === node.id) {
                return true;
            }
            return false;
        });
        return connectedEdge;
    }).flat();

    return [...new Set(connectedEdges)];
}

const getHybridNetworkingObjects = (vnetNodes: NodeData[], nodes: NodeData[], edges: EdgeData[]) => {

    let hubVnetNodes: NodeData[] = [];
    let hubVnetEdges: EdgeData[] = [];
    let hybridNetworkConnectionNodes: NodeData[] = [];
    let hybridNetworkConnectionEdges: EdgeData[] = [];
    let peeringLocationNodes: NodeData[] = [];
    let peeringLocationEdges: EdgeData[] = [];

    vnetNodes.map(node => { hubVnetNodes.push(node); });
    const hubVnetChildren: NodeData[] = hubVnetNodes.map((node: NodeData) => getChildrenNodes(node, nodes)).flat();

    // get objects that connect to vnet gateways
    const vnetGatewayNodes = hubVnetChildren.filter(node => node.data.servicename === 'vpngateway');

    vnetGatewayNodes.map(node => {
        const connectedEdges: EdgeData[] = edges.filter(edge => edge.to === node.id);
        const connectedNodes: NodeData[] = getNodesFromEdges(connectedEdges, nodes)
            .filter((node: { id: string; }) => !hubVnetChildren.some((vnetChildNode: { id: string; }) => vnetChildNode.id === node.id)).flat();
        hybridNetworkConnectionEdges.push(...connectedEdges);

        connectedNodes.map(node => {
            if (!hybridNetworkConnectionNodes.some((connectionObject: { id: string; }) => connectionObject.id === node.id)) { hybridNetworkConnectionNodes.push(node); }
        });
    });

    // get objects that connect to hybrid network connections
    hybridNetworkConnectionNodes.map(node => {
        const connectedEdges: EdgeData[] = edges.filter(edge => edge.to === node.id);
        const connectedNodes: NodeData[] = getNodesFromEdges(connectedEdges, nodes)
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
 * 
 * @param visibleNodes All visibile nodes
 * @param edges Edges that are to be hidden
 * @returns 
 */
const getExternalNodesToHide = (visibleNodes: NodeData[], visibleEdges: EdgeData[], edgesToHide: EdgeData[]): NodeData[] => {

    // TODO: re-factor into a separate function and account for external nodes that still have valid connections
    const externalNodesToHide = getNodesFromEdges(edgesToHide, visibleNodes).map((node: any) => {
        if (visibleNodes.some((n: { id: string; }) => n.id === node.id)) {
            // node is visible and might need to be hidden
            // get list of edges connected to node that are not in edgesToHide
            const connectedEdges = visibleEdges.filter(edge => edge.from === node.id || edge.to === node.id).filter((edge: { id: string; }) => !edgesToHide.some((e: { id: string; }) => e.id === edge.id));
            if (connectedEdges.length === 0) {
                return node;
            }
        }
    }).filter((node: any) => node !== undefined);

    return externalNodesToHide;

}