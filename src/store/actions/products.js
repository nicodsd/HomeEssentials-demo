import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../../../api";

const products_read = createAsyncThunk('products_read',
    async (response) => {
        try {
            let token = localStorage.getItem('token')
            let headers = { headers: { 'Authorization': `Bearer ${token}` } }
            let response = await fetch(apiUrl + `products?category_id=${response.categoriesCheked.join(',')}&manufacturer_id=${response.manufacturerCheked.join(',')}&order=${response.filterPrice}`, headers)
            let res = await response.json()
            return { products: res.products }
        } catch (error) {
            return {
                products: []
            }
        }
    })

const actions = { products_read }
export default actions


//let response = await fetch(apiUrl+`products?category_id=${categoriesCheked.join(',')}`, headers) 
//let res = await response.json()