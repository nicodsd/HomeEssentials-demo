import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../../../api";

const usersAdmin = createAsyncThunk('usersAdmin', async () => {
    try {
        
        let response = await fetch(apiUrl+'users')
        let res = await response.json()
        return {users:res.users}
        
    } catch (error) {
        return {
            users:[]
            }}})

const actions={usersAdmin}
export default  actions