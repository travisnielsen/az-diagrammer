import { NodeData, EdgeData } from 'reaflow';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DiagramDataset } from '../types/DiagramDataset';
import { getConnectionGraphPaaS, getConnectionGraphVnetInjected, collapseContainer, expandContainer } from '../utility/diagramUtils';

interface DiagramNodes {
    value: DiagramDataset
}

const initialState: DiagramNodes = {
    value: { visibleNodes: [], hiddenNodes: [], visibleEdges: [], hiddenEdges: [] }
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

            if (selectedNode.data.status === 'open') {
                const [displayNodes, hiddenNodes, displayEdges, hiddenEdges] = collapseContainer(
                    selectedNode, 
                    state.value.visibleNodes, 
                    state.value.hiddenNodes, 
                    state.value.visibleEdges, 
                    state.value.hiddenEdges
                    );

                state.value.hiddenNodes = hiddenNodes;
                state.value.visibleNodes = displayNodes;
                state.value.hiddenEdges = hiddenEdges;
                state.value.visibleEdges = displayEdges;
                selectedNode.data.status = 'closed';
                return;
            }

            if (selectedNode.data.status === 'closed') {
                const [displayNodes, hiddenNodes, displayEdges, hiddenEdges] = expandContainer(
                    selectedNode, 
                    state.value.visibleNodes,
                    state.value.hiddenNodes, 
                    state.value.visibleEdges,
                    state.value.hiddenEdges
                    );
    
                state.value.hiddenNodes = hiddenNodes;
                state.value.visibleNodes = displayNodes;
                state.value.hiddenEdges = hiddenEdges;
                state.value.visibleEdges = displayEdges;
                selectedNode.data.status = 'open';
                return;
            }

        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges, filterOnSelectedNode, expandCollapseContainer } = diagramSlice.actions
export default diagramSlice.reducer
