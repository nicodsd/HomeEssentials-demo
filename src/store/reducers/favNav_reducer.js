import { createReducer } from "@reduxjs/toolkit";
import favNav_action from '../actions/favNav.js'

const {favNav} = favNav_action

let initial_state = {
  fav: 0
}

const reducer = createReducer (
  initial_state,
  (builder) => builder
  .addCase(
    favNav,
    (state, action) => {
      const new_state = {
        ...state, 
         fav:action.payload.fav
      }
      return new_state
    }
  )
)

export default reducer
