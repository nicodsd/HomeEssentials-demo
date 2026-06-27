import { createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";
const read_cart = createAsyncThunk('read_cart', async()=>{
  try {
      
      let userId = "6480bafa03131bde973ed4d7"
      let response = await fetch(apiUrl +`cart/${userId}`)
        let res = await response.json()
      return {
        cartItem:res
      }
    } catch (error) {
        return{
            cartItem:[]
        }
    }

})


const actions = { read_cart };

export default actions;