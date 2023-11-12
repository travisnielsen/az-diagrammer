import { NodeData, EdgeData } from 'reaflow';
import { PayloadAction, combineReducers, createSlice, current } from '@reduxjs/toolkit'
import { DiagramDataset } from '../types/DiagramDataset';
import { getConnectionGraphPaaS, getConnectionGraphVnetInjected, collapseContainer, expandContainer } from '../utility/diagramUtils';
import { LayoutZone } from '../types/LayoutZone';

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
            let displayNodes: NodeData[] = [];
            let displayEdges: EdgeData[] = [];

            if (selectedNode.data.tier === LayoutZone.PAAS) {
                [displayNodes, displayEdges] = getConnectionGraphPaaS(current(selectedNode), current(state.value.visibleNodes), current(state.value.visibleEdges));
            } else {
                [displayNodes, displayEdges] = getConnectionGraphVnetInjected(current(selectedNode), current(state.value.visibleNodes), current(state.value.visibleEdges));
            }
            
            const hiddenNodesFromFilter = state.value.visibleNodes.filter(node => !displayNodes.some((n: { id: string; }) => n.id === node.id));
            const hiddenEdgesFromFilter = state.value.visibleEdges.filter(edge => !displayEdges.some((e: { id: string; }) => e.id === edge.id));
            state.value.hiddenNodes.concat(hiddenNodesFromFilter);
            state.value.hiddenEdges.concat(hiddenEdgesFromFilter);
            state.value.visibleNodes = displayNodes;
            state.value.visibleEdges = displayEdges;
            return;
        },
        expandCollapseContainer: (state, action: PayloadAction<string>) => {
            const selectedNodeId = action.payload;
            const selectedNode = state.value.visibleNodes.find(node => node.id === selectedNodeId) || { id: '' };
            const index = state.value.visibleNodes.findIndex(node => node.id === selectedNodeId);

            if (selectedNode.data.status === 'open') {
                const [displayNodes, hiddenNodes, displayEdges, hiddenEdges] = collapseContainer(
                    selectedNode, 
                    current(state.value.visibleNodes), 
                    current(state.value.hiddenNodes), 
                    current(state.value.visibleEdges), 
                    current(state.value.hiddenEdges)
                    );

                state.value.hiddenNodes = hiddenNodes;
                state.value.visibleNodes = displayNodes;
                state.value.hiddenEdges = hiddenEdges;
                state.value.visibleEdges = displayEdges;
                selectedNode.data.status = 'closed';
                state.value.visibleNodes[index] = selectedNode;
                return;
            }

            if (selectedNode.data.status === 'closed') {
                const [displayNodes, hiddenNodes, displayEdges, hiddenEdges] = expandContainer(
                    selectedNode, 
                    current(state.value.visibleNodes),
                    current(state.value.hiddenNodes), 
                    current(state.value.visibleEdges),
                    current(state.value.hiddenEdges)
                    );
                    
                state.value.hiddenNodes = hiddenNodes;
                state.value.visibleNodes = displayNodes;
                state.value.hiddenEdges = hiddenEdges;
                state.value.visibleEdges = displayEdges;
                selectedNode.data.status = 'open';
                state.value.visibleNodes[index] = selectedNode;
                return;
            }
        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges, filterOnSelectedNode, expandCollapseContainer } = diagramSlice.actions
export default diagramSlice.reducer
