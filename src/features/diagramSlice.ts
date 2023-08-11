import { NodeData, EdgeData } from 'reaflow';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DiagramDataset } from '../types/DiagramDataset';

interface DiagramNodes {
    value: DiagramDataset
}

const initialState: DiagramNodes = {
    value: { visibleNodes: [], hiddenNodes: [], visibleEdges: [], hiddenEdges: [] }
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

const getChildrenNodes: any = (node: NodeData, nodeData: NodeData[]) => {
    const childrenNodes = nodeData.filter(childNode => {
        if (childNode.parent === node.id) {
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

    // return [...childrenNodes, ...getChildrenNodes(childrenNodes[0], nodeData)];
}

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

const getConnectionGraphPaaS = (selectedNode: NodeData, nodes: NodeData[], edges: EdgeData[]) => {
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

const getConnectionGraphVnetInjected = (selectedNode: NodeData, nodes: NodeData[], edges: EdgeData[]) => {

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


export const diagramSlice = createSlice({
    name: 'diagram',
    initialState,
    reducers: {
        setVisibleNodes: (state, action: PayloadAction<NodeData[]>) => {
            state.value.visibleNodes = action.payload
        },
        setHiddenNodes: (state, action: PayloadAction<NodeData[]>) => {
            state.value.hiddenNodes = action.payload
        },
        setVisibleEdges: (state, action: PayloadAction<EdgeData[]>) => {
            state.value.visibleEdges = action.payload
        },
        setHiddenEdges: (state, action: PayloadAction<EdgeData[]>) => {
            state.value.hiddenEdges = action.payload
        },
        filterOnSelectedNode: (state, action: PayloadAction<string>) => {
            const selectedNodeId = action.payload;
            const selectedNode: NodeData = state.value.visibleNodes.find(node => node.id === selectedNodeId) || { id: '' };

            if (selectedNode.parent === undefined) {
                const [displayNodes, displayEdges] = getConnectionGraphPaaS(selectedNode, state.value.visibleNodes, state.value.visibleEdges);
                const hiddenNodes = state.value.visibleNodes.filter(node => !displayNodes.some((n: { id: string; }) => n.id === node.id));
                const hiddenEdges = state.value.visibleEdges.filter(edge => !displayEdges.some((e: { id: string; }) => e.id === edge.id));
                state.value.hiddenNodes = hiddenNodes;
                state.value.hiddenEdges = hiddenEdges;
                state.value.visibleNodes = displayNodes;
                state.value.visibleEdges = displayEdges;
                return;
            }
            
            if (selectedNode.parent) {
                const [displayNodes, displayEdges] = getConnectionGraphVnetInjected(selectedNode, state.value.visibleNodes, state.value.visibleEdges);
                const hiddenNodes = state.value.visibleNodes.filter(node => !displayNodes.some((n: { id: string; }) => n.id === node.id));
                const hiddenEdges = state.value.visibleEdges.filter(edge => !displayEdges.some((e: { id: string; }) => e.id === edge.id));
                state.value.hiddenNodes = hiddenNodes;
                state.value.hiddenEdges = hiddenEdges;
                state.value.visibleNodes = displayNodes;
                state.value.visibleEdges = displayEdges;
                return;
            }
        },
        expandCollapseContainer: (state, action: PayloadAction<string>) => {
            const selectedNodeId = action.payload;
            const selectedNode: NodeData = state.value.visibleNodes.find(node => node.id === selectedNodeId) || { id: '' };

            const nodesToHide = getChildrenNodes(selectedNode, state.value.visibleNodes);
            const hiddenNodes = [...state.value.hiddenNodes, ...nodesToHide];
            const displayNodes = state.value.visibleNodes.filter(node => !nodesToHide.some((n: { id: string; }) => n.id === node.id));

            const edgesToHide = getEdgesFromNodes(nodesToHide, state.value.visibleEdges);
            const hiddenEdges = [...state.value.hiddenEdges, ...edgesToHide];
            const displayEdges = state.value.visibleEdges.filter(edge => !edgesToHide.some((e: { id: string; }) => e.id === edge.id));

            state.value.hiddenNodes = hiddenNodes;
            state.value.visibleNodes = displayNodes;
            state.value.hiddenEdges = hiddenEdges;
            state.value.visibleEdges = displayEdges;



        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges, filterOnSelectedNode, expandCollapseContainer } = diagramSlice.actions
export default diagramSlice.reducer
