import { createSlice } from "@reduxjs/toolkit"
import initialState from "./initialState"

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setState: (state, action) => {
            const { payload } = action
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key]
            })
        },
        toggleViewMode: () => {},
        updateUserData: (state, action) => {
            const { payload } = action
            state.userData = { ...state.userData, ...payload }
        },
        getUserData: () => {},
        loginUser: () => {},
        signupUser: () => {},
        logoutUser: () => {},
    },
})

export default userSlice
