import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions/manufacturers";
const {manufacturers_read}=actions 
let inicialState={
    manufacturers:[],
    loading:false
}
const reducer =createReducer(
    inicialState,
    (builder)=>builder
    .addCase(
        manufacturers_read.pending,
        (state)=>({
            ...state,
            loading:true
        })
    )
    .addCase(
        manufacturers_read.fulfilled,
       (state,action)=>{
        let newState={
               ...state,
               manufacturers:action.payload.manufacturers,
               loading:false
            }
         
        return newState
       }
    )
    .addCase(
        manufacturers_read.rejected,
        (state)=>({
            ...state,
            loading:false
        })
    )
    )
    export default reducer
