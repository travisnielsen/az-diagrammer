import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { NodeData } from 'reaflow';
import { SelectSearchOption } from 'react-select-search';

interface SearchData {
    value: SelectSearchOption[]
}

const initialState: SearchData = {
    value: []
}

export const searchDataSlice = createSlice({
    name: 'searchdata',
    initialState,
    reducers: {
        setSearchData: (state, action: PayloadAction<NodeData[]>) => {
            const searchItems = []
            action.payload.forEach((node: NodeData) => {
                if (node.data.type === "service") {
                    searchItems.push({ name: node.data.label, value: node.id, icon: node.data.url })
                }
            })

            state.value = searchItems
        }
    }
})

export const { setSearchData } = searchDataSlice.actions
export default searchDataSlice.reducer