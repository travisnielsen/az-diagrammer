import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { CanvasDataset } from '../types/CanvasDataset';

interface CanvasPane {
    value: CanvasDataset
}

const initialState: CanvasPane = {
    value: { paneHeight: 1000, paneWidth: 3000 }
}

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setPaneHeight: (state, action: PayloadAction<number>) => {
            state.value.paneHeight = action.payload
        },
        setPaneWidth: (state, action: PayloadAction<number>) => {
            state.value.paneWidth = action.payload
        }
    }
})

export const { setPaneHeight, setPaneWidth } = canvasSlice.actions

export default canvasSlice.reducer