// import {STORE_ROOT} from "consts" // Use for Static Selectros.

import {createSelector} from "reselect"
import {createReducer, createBoundSelectors} from "rhm"

const init = {
  message: "",
  pending: false
}

// ---- Reducer ----------------

export default createReducer(
  "HELLO", message => ({message}),
  "SAY_ASYNC", {pending: true},
  "SAY_ASYNC_COMPLETE", message => ({message, pending: false})
)(init)


// ---- Static Selectros -----------------

// const selectors = {}
// selectors.getMessage = state => state[STORE_ROOT].message,
// selectors.haveMessage = createSelector(selectors.getMessage, message => !!message.length)

// ---- Dynamic Selectros ----------------

const selectors = root => {
  const selectors = {}
  selectors.isPending = state => state[root].pending
  selectors.getMessage = state => state[root].message
  selectors.haveMessage = createSelector(selectors.getMessage, message => !!message.length)
  return selectors
}

export {selectors}
