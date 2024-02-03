import { createSlice } from "@reduxjs/toolkit"
import initialState from "./initialState"

const globalModalSlice = createSlice({
    name: "globalModal",
    initialState,
    reducers: {
        setState: (state, action) => {
            const { payload } = action
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key]
            })
        },
    },
})

export default globalModalSlice
