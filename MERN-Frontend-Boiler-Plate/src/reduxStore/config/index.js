import { createSlice } from "@reduxjs/toolkit"
import initialState from "./initialState"

const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setState: (state, action) => {
            const { payload } = action
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key]
            })
        },
        getConfigData: () => {},
    },
})

export default configSlice
