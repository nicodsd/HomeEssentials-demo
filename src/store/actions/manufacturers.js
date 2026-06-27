import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../../../api";

const  manufacturers_read  = createAsyncThunk(' manufacturers_read ', async () => {
    try {
        let response = await fetch(apiUrl+'manufacturers')
        let res = await response.json()
        return {manufacturers:res.manufacturers}
     
        
    } catch (error) {
        return {
            manufacturers:[]
        }}})

const actions= { manufacturers_read}
export default  actions