import { createAsyncThunk } from "@reduxjs/toolkit";
import apiUrl from "../../../api";

const  curriculums_read  = createAsyncThunk(' curriculums_read ', async () => {
    try {
        let response = await fetch(apiUrl+'admin/curriculums')
        let res = await response.json()
        return {curriculums:res.curriculums}
     
        
    } catch (error) {
        return {
            curriculums:[]
        }}})

const actions= { curriculums_read }
export default  actions