import {createReducer} from "rhm"
import {createSelector} from "reselect"

const init = {
  message: "",
  pending: false
}

// ---- Reducer ----------------

export default createReducer({
  HELLO: message => ({message}),
  SAY_ASYNC: {pending: true},
  SAY_ASYNC_COMPLETE: message => ({message, pending: false})
})(init)


// ---- Selectros -----------------
// NOTE: "state" argument is a slice the global state object related to the current reducer state (init).

const selectors = {}
selectors.isPending = state => state.pending
selectors.getMessage = state => state.message
selectors.haveMessage = createSelector(selectors.getMessage, message => !!message.length)

export {selectors}
