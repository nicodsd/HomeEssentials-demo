import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../../../api";

const products_read = createAsyncThunk('products_read', async () => {
    try {
        
        let response = await fetch(apiUrl+'products')
        let res = await response.json()
        return {products:res.products}
        
    } catch (error) {
        return {
            products:[]
            }}})

const actions={products_read}
export default  actions