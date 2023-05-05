import { NodeData, EdgeData } from 'reaflow';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DiagramDataset } from '../types/DiagramDataset';
import type { RootState } from '../store'

interface DiagramNodes {
    value: DiagramDataset
}

const initialState: DiagramNodes = {
    value: { nodes: [], hiddenNodes: [], edges: [], hiddenEdges: [] }
}

export const diagramSlice = createSlice({
    name: 'diagram',
    initialState,
    reducers: {
        setVisibleNodes: (state, action: PayloadAction<NodeData[]>) => {
            state.value.nodes = action.payload
        },
        setHiddenNodes: (state, action: PayloadAction<NodeData[]>) => {
            state.value.hiddenNodes = action.payload
        },
        setVisibleEdges: (state, action: PayloadAction<EdgeData[]>) => {
            state.value.edges = action.payload
        },
        setHiddenEdges: (state, action: PayloadAction<EdgeData[]>) => {
            state.value.hiddenEdges = action.payload
        }
    }
})

export const { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges } = diagramSlice.actions

export const selectDiagram = (state: RootState) => state.diagram.value

export default diagramSlice.reducer