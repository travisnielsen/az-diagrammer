import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import diagramReducer from './diagramSlice'
import canvasReducer from './canvasSlice'
import connectionsReducer from './configurationSlice'
import searchReducer from './searchDataSlice'
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage
}

const persistedConfigurationsReducer = persistReducer(persistConfig, connectionsReducer)

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
    canvas: canvasReducer,
    configurations: persistedConfigurationsReducer,
    searchdata: searchReducer
  },
  middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)