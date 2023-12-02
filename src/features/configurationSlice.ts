import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DiagramConfiguration } from '../types/DiagramConfiguration'

interface Connections {
    value: DiagramConfiguration[]
}

const demoConnection: DiagramConfiguration = {
    id: 'demo-contoso',
    name: 'Contoso (demo)',
    subscriptionId: '293bbd05-3a7f-4d5c-9bef-9f7919b36306',
    excludeTags: '',
    connectionString: 'demo',
    containerName: 'demo',
    folderName: 'demo',
    selected: true
}

const initialState: Connections = {
    value: [demoConnection]
}

export const configurationSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        addConfiguration: (state, action: PayloadAction<DiagramConfiguration>) => {
            state.value.push(action.payload)
        },
        removeConfiguration: (state, action: PayloadAction<DiagramConfiguration>) => {
            state.value = state.value.filter((configuration: DiagramConfiguration) => configuration.id !== action.payload.id)
        },
        updateConfiguration: (state, action: PayloadAction<DiagramConfiguration>) => {
            state.value = state.value.map((configuration: DiagramConfiguration) => {
                if (configuration.id === action.payload.id) {
                    return action.payload
                }
                return configuration
            })
        },
        setSelectedConfiguration: (state, action: PayloadAction<string>) => {
            state.value = state.value.map((configuration: DiagramConfiguration) => {
                if (configuration.id === action.payload) {
                    configuration.selected = true
                } else {
                    configuration.selected = false
                }
                return configuration
            })
        }
    }
})

export const { addConfiguration, removeConfiguration, updateConfiguration, setSelectedConfiguration } = configurationSlice.actions
export default configurationSlice.reducer