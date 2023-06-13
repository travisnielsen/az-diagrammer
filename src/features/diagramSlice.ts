import { NodeData, EdgeData } from 'reaflow';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DiagramDataset } from '../types/DiagramDataset';
import { loadCanvasData } from '../data/loadCanvasData';

interface DiagramNodes {
    value: DiagramDataset
}

// const [initialNodeData, initialEdgeData] = await loadCanvasData();

const initialState: DiagramNodes = {
    value: { visibleNodes: [], hiddenNodes: [], visibleEdges: [], hiddenEdges: [] }
    // value: { visibleNodes: initialNodeData, hiddenNodes: [], visibleEdges: initialEdgeData, hiddenEdges: [] }
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
        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges } = diagramSlice.actions
export default diagramSlice.reducer


