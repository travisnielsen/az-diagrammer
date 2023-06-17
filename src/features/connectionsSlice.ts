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
            state.value = state.value.filter((connection: StorageAccountConnection) => connection.id !== action.payload.id)
        },
        updateConnection: (state, action: PayloadAction<StorageAccountConnection>) => {
            state.value = state.value.map((connection: StorageAccountConnection) => {
                if (connection.id === action.payload.id) {
                    return action.payload
                }
                return connection
            })
        },
        setSelectedConnection: (state, action: PayloadAction<string>) => {
            state.value = state.value.map((connection: StorageAccountConnection) => {
                if (connection.id === action.payload) {
                    connection.selected = true
                } else {
                    connection.selected = false
                }
                return connection
            })
        }
    }
})

export const { addConnection, removeConnection, updateConnection, setSelectedConnection } = connectionsSlice.actions
export default connectionsSlice.reducer