import { configureStore } from '@reduxjs/toolkit'
import diagramReducer from './features/diagramSlice'
import canvasReducer from './features/canvasSlice'

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
    canvas: canvasReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch