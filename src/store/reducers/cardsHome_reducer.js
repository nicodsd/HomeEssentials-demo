import { createReducer } from "@reduxjs/toolkit";
import actions from "../actions/cardsHome";
const { cards_home_read } = actions
let inicialState = {
    productsHome: [],
    loading: false
}
const reducer = createReducer(
    inicialState,
    (builder) => builder
        .addCase(
            cards_home_read.pending,
            (state) => ({
                ...state,
                loading: true
            })
        )
        .addCase(
            cards_home_read.fulfilled,
            (state, action) => {
                let newState = {
                    ...state,
                    productsHome: action.payload.productsHome,
                    loading: false
                }

                return newState
            }
        )
        .addCase(
            cards_home_read.rejected,
            (state) => ({
                ...state,
                loading: false
            })
        )
)
export default reducer
