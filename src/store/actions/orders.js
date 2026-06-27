import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../../../api";

const  orders_read  = createAsyncThunk(' orders_read ', async () => {
    try {
        let response = await fetch(apiUrl+'order')
        let res = await response.json()
        return {orders:res.orders}
     
        
    } catch (error) {
        return {
            orders:[]
        }}})

const actions= { orders_read }
export default  actions