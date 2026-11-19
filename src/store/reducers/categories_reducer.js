import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions/categories";
const {categories_read}=actions 
let inicialState={
    categories:[],
    loading:false
}

const reducer =createReducer(
    inicialState,
    (builder)=>builder
    .addCase(
        categories_read.pending,
        (state)=>({
            ...state,
            loading:true
        })
    )
    .addCase(
       categories_read.fulfilled,
       (state,action)=>{
        let newState={
               ...state,
               categories:action.payload.categories,
               loading:false
            }
         
        return newState
       }
    )
    .addCase(
        categories_read.rejected,
        (state)=>({
            ...state,
            loading:false
        })
    )
    )
    export default reducer
