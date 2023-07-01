import { NodeData, NodeProps, EdgeData } from 'reaflow';
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

    return connectedNodes;
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
            const connectedEdges = state.value.visibleEdges.filter(edge => edge.to === selectedNodeId || edge.from === selectedNodeId);

            // return all nodes that are part of the connected edges
            const connectedNodes = state.value.visibleNodes.filter(node => {
                if (node.id === selectedNodeId) {
                    return true;
                }
                if (connectedEdges.some(edge => edge.from === node.id || edge.to === node.id)) {
                    return true;
                }
                return false;
            });

            const parentNodes = getParentNodes(selectedNode, state.value.visibleNodes);

            let parentEdges: EdgeData<any>[] = []
        
            if (parentNodes) {
              parentEdges = state.value.visibleEdges.filter(edge => {
                if (parentNodes.some((parentNode: { id: string | undefined; }) => parentNode.id === edge.from || parentNode.id === edge.to)) {
                  return true;
                }
                return false;
              });
            }
        
            const nodesFromParentEdges = getNodesFromEdges(parentEdges, state.value.visibleNodes);
            const displayNodes = [...parentNodes, ...connectedNodes, ...nodesFromParentEdges].filter((node, index, self) => self.findIndex(n => n.id === node.id) === index)
            const displayEdges = [...connectedEdges, ...parentEdges]
            // get nodes that are not in the displayNodes array
            const hiddenNodes = state.value.visibleNodes.filter(node => !displayNodes.some(n => n.id === node.id));
            const hiddenEdges = state.value.visibleEdges.filter(edge => !displayEdges.some(e => e.id === edge.id));

            state.value.visibleNodes = displayNodes;
            state.value.visibleEdges = displayEdges;
            state.value.hiddenNodes = hiddenNodes;
            state.value.hiddenEdges = hiddenEdges;
        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges, filterOnSelectedNode } = diagramSlice.actions
export default diagramSlice.reducer



