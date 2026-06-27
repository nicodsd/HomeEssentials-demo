import { createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";

const categories_read = createAsyncThunk('categories_read', async () => {
    try {
        
        let response = await fetch(apiUrl+'categories')
        let res = await response.json()
        return {categories:res.categories}
        
    } catch (error) {
        return {
            categories:[]
            }}})

const actions={categories_read}
export default  actions