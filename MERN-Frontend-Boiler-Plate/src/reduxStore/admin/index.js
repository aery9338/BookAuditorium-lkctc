import { createSlice } from "@reduxjs/toolkit"
import initialState from "./initialState"

const userSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setState: (state, action) => {
            const { payload } = action
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key]
            })
        },
        getAdminData: () => {},
    },
})

export default userSlice
