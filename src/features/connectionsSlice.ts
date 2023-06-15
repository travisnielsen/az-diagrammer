import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { StorageAccountConnection } from '../types/StorageAccountConnection'

interface Connections {
    value: StorageAccountConnection[]
}

const initialState: Connections = {
    value: []
}

export const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        addConnection: (state, action: PayloadAction<StorageAccountConnection>) => {
            state.value.push(action.payload)
        },
        removeConnection: (state, action: PayloadAction<StorageAccountConnection>) => {
            state.value = state.value.filter((connection: StorageAccountConnection) => connection.name !== action.payload.name)
        }
    }
})

export const { addConnection, removeConnection } = connectionsSlice.actions
export default connectionsSlice.reducer