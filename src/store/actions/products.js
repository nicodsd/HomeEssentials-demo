import { createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";

const products_read = createAsyncThunk(
    "products_read",
    async (filters, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const query = new URLSearchParams({
                category_id: filters.categoriesCheked.join(","),
                manufacturer_id: filters.manufacturerCheked.join(","),
                order: filters.filterPrice,
            }).toString();

            const res = await fetch(`${apiUrl}products?${query}`, { headers });
            const data = await res.json();

            return { products: data.products || [] };
        } catch (error) {
            console.error(error);
            return rejectWithValue({ products: [] });
        }
    }
);

const actions = { products_read };
export default actions;
