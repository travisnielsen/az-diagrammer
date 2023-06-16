import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import diagramReducer from './features/diagramSlice'
import canvasReducer from './features/canvasSlice'
import connectionsReducer from './features/connectionsSlice'
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage
}

const persistedConnectionsReducer = persistReducer(persistConfig, connectionsReducer)

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
    canvas: canvasReducer,
    connections: persistedConnectionsReducer
  },
  middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)