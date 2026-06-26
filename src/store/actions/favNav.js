import { createAction } from "@reduxjs/toolkit";

const favNav = createAction(
    'favNav', 
    (fav) => {    
      return {
        payload: {
          fav: fav
        }
      }
    } 
  )
  
  const actions = {favNav}
  export default actions
