import { NodeData, EdgeData } from 'reaflow';
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
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

            if (selectedNode.data.layoutZone === LayoutZone.PAAS) {
                [displayNodes, displayEdges] = getConnectionGraphPaaS(selectedNode, state.value.visibleNodes, state.value.visibleEdges, state.value.hiddenNodes, state.value.hiddenEdges);
            } else {
                [displayNodes, displayEdges] = getConnectionGraphVnetInjected(selectedNode, state.value.visibleNodes, state.value.visibleEdges, state.value.hiddenNodes, state.value.hiddenEdges);
            }
            
            const hiddenNodesFromFilter = state.value.visibleNodes.filter(node => !displayNodes.some((n: { id: string; }) => n.id === node.id));
            const hiddenEdgesFromFilter = state.value.visibleEdges.filter(edge => !displayEdges.some((e: { id: string; }) => e.id === edge.id));

            // get nodes in displayNodes that are in state.value.hiddenNodes
            const dupeNodes = displayNodes.filter(node => state.value.hiddenNodes.some((n: { id: string; }) => n.id === node.id));
            const dupeEdges = displayEdges.filter(edge => state.value.hiddenEdges.some((e: { id: string; }) => e.id === edge.id));

            // remove dupeNodes from state.value.hiddenNodes
            const nodesToRemoveFromHiddenNodes = state.value.hiddenNodes.filter(node => dupeNodes.some((n: { id: string; }) => n.id === node.id));
            state.value.hiddenNodes = state.value.hiddenNodes.filter(node => !nodesToRemoveFromHiddenNodes.some((n: { id: string; }) => n.id === node.id));

            // remove dupeEdges from state.value.hiddenEdges
            const edgesToRemoveFromHiddenEdges = state.value.hiddenEdges.filter(edge => dupeEdges.some((e: { id: string; }) => e.id === edge.id));
            state.value.hiddenEdges = state.value.hiddenEdges.filter(edge => !edgesToRemoveFromHiddenEdges.some((e: { id: string; }) => e.id === edge.id));

            state.value.hiddenNodes.concat(hiddenNodesFromFilter);
            state.value.hiddenEdges.concat(hiddenEdgesFromFilter);
            state.value.visibleNodes = displayNodes;
            state.value.visibleEdges = displayEdges;
            return;
        },
        expandCollapseContainer: (state, action: PayloadAction<string>) => {
            const selectedNodeId = action.payload;
            const selectedNode = state.value.visibleNodes.find(node => node.id === selectedNodeId) || { id: '' };

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
                const index = state.value.visibleNodes.findIndex(node => node.id === selectedNodeId);
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
                const index = state.value.visibleNodes.findIndex(node => node.id === selectedNodeId);
                state.value.visibleNodes[index] = selectedNode;
                return;
            }
        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges, filterOnSelectedNode, expandCollapseContainer } = diagramSlice.actions
export default diagramSlice.reducer
