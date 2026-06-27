import { createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";

const cards_home_read = createAsyncThunk(' cards_home_read ', async () => {
    try {
        let response = await fetch(apiUrl + 'products/sixcards')
        let res = await response.json()
        return { productsHome: res.products }

    } catch (error) {
        return {
            productsHome: []
        }
    }
})

const actions = { cards_home_read }
export default actions