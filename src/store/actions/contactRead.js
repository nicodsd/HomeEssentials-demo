import { createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";

const  contact_read  = createAsyncThunk(' contact_read ', async () => {
    try {
        let response = await fetch(apiUrl+'contact/get')
        let res = await response.json()
        return {contact:res.contact}
     
        
    } catch (error) {
        return {
            contact:[]
        }}})

const actions= { contact_read }
export default  actions