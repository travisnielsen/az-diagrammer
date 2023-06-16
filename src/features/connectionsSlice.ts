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
        },
        updateConnection: (state, action: PayloadAction<StorageAccountConnection>) => {
            state.value = state.value.map((connection: StorageAccountConnection) => {
                if (connection.name === action.payload.name) {
                    return action.payload
                }
                return connection
            })
        }
    }
})

export const { addConnection, removeConnection, updateConnection } = connectionsSlice.actions
export default connectionsSlice.reducer