import {STORE_ROOT} from "consts"
import {createSelector} from "reselect"
import {createReducer} from "helpers/redux-helpers"

const init = {
  message: ""
}

// ---- Reducer ----------------

export default createReducer(
  "HELLO", message => ({message}),
)(init)


// ---- Selectros ----------------

const selectors = {}

// Simple selector.
selectors.getMessage = state => state[STORE_ROOT].message

export {selectors}
