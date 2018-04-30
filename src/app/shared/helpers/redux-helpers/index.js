// Redux helpers v 0.4.0
// by Wojciech Ludwin, ludekarts@gmail.com, 2018.

// Check for primitie types & array.
const isPrimitive = object => !object
  || typeof object === "string"
  || typeof object === "number"
  || typeof object === "boolean"
  || Array.isArray(object)

// Verify ~ name convention.
const isAction = (type) => typeof type === "string" && /^[0-9A-Z_-]+$/gm.test(type)

// Verify if action need to be skipped.
const isBypass = args => args[0] && typeof args[0] === "string" && args[0] === "RHM%BYPASS"

// Dumb check, but it works for most cases.
const isPromise = fn => fn && typeof fn.then === "function"

// Slice array in chunks with given size.
const chunk = (array, size) => {
  let index = 0, arrayLength = array.length, chunks = []
  for (index ; index < arrayLength; index += size) {
    chunks.push(array.slice(index, index + size))
  }
  return chunks
}

// Generate UID.
const uid = () => "RHM." + ((+new Date) + Math.random()* 100).toString(32);

// ---- Utilities ----------------

// Create Action Helper.
export const createAction = (type, body) => {
  if (!isAction(type)) throw "Action type name does not match common pattern: [A-Z_-]+"
  return (...args) => {
    const payload = isBypass(args) ? body : typeof body === "function" ? body(...args) : body
    return {type, args, payload}
  }
}

// Create Reducer Helper.
// NOTE: All objects from the reducer function will be flat merge e.g.: {...state, myValue: 12}
//       with default state. So just return a slice of the state you'd like to update e.g.: {myValue: 12}.
//
// USAGE:
//
// const reducer = createReducer(
//   "ACTION_TYPE_A", (payload, state, args) => ({key: value}),
//   "ACTION_TYPE_B", (payload, state, args) => value,
//   "ACTION_TYPE_C", {key: value},
//   "ACTION_TYPE_D", value
// )
export const createReducer = (...args) => {
  if (args.length % 2 !== 0 || args.length === 0)
    throw "Arguments for \"createReducer\" has ODD numbers of arguments.\nCorect pattern is: createReducer(ACTION_NAME, reducer, ...)"

  const cases = chunk(args, 2).reduce((acc, [action_type, reducer]) => {
    if (!isAction(action_type)) throw "Incorrect action type in \"createReducer()\""
    acc[action_type] = reducer
    return acc
  }, {})

  return (initialState) => {
    return (state = initialState, action, exit = false) => {

      // Exit with reducer's args & initialState => for actions customization.
      if (state === null && action === null && exit) return [args, initialState]

      // Default reducing logic.
      const reducer = cases[action.type]
      if (reducer) {
        if (isPrimitive(reducer)) {
          return reducer
        }
        else if (typeof reducer === "function") {
          const itm = reducer(action.payload, state, action.args)
          return isPrimitive(itm) ? itm : {...state, ...itm}
        }
        // Plain object.
        else return {...state, ...reducer}
      }
      else return state
    }
  }
}


// Redux Helpers Middleware.
// Allows to handle asyn actions, and deal with optimistic updates.
// NOTE: When action payload is a Promise then this action is intercepted and is dispatched with
//       payload containing action-creator's arguments (those can be used to calculate optimistic update),
//       after promise is resolved "ACTION_NAME_COMPLETE" action is dispatched.
//       This time the payload contains an actual resolved value that can be used to update redux state.
//       When an error occures the "ACTION_NAME_ERROR" action is dispatched with error message as a payload.
//
// EXAMPLE HOW THE ACTIONS DISPATCH:
// User: const asyncAction = createAction("ASYNC_ACTION", id => call.api(id))
//        ↓
// User: asyncAction(12)
//        ↓
// RHM:  dispatch({type: "ASYNC_ACTION", payload: [12]})
//        ↓
// RHM:  Promise is resolved...
//        ↓
// RHM:  dispatch({type: "ASYNC_ACTION_COMPLETE", payload: promiseResult, args:[12]})
//
export default ({dispatch, getState}) => next => action => {
  if (isPromise(action.payload)){
    dispatch({type: action.type, payload: action.args})
    return action.payload
      .then(payload => dispatch({type: action.type + "_COMPLETE", payload, args: action.args}))
      .catch(payload => dispatch({type: action.type + "_ERROR", payload, error: true, args: action.args}))
  }
  else if (typeof action === "function")
    return action(dispatch, getState)
  else
    return next(action)
}


// ---- Redux Utilities ----------------

// Annotate actions with custom hash.
const annotateActions = (actions, storeRoot) =>
  Object.keys(actions).reduce((acc, name) => {
    const action = actions[name]("RHM%BYPASS")
    acc[name] = createAction(`${action.type}_${storeRoot}`, action.payload)
    return acc
  }, {})


// Annotate reducer's actions with custom hash.
const annotateReducer = (reducer, storeRoot) => {
  const [reducerArgs, initialState] = reducer(null, null, true)
  const annotatedReducer = reducerArgs.map((arg, index) =>
    index % 2 === 0
      ? /(_COMPLETE|_ERROR)$/m.test(arg)
        ? arg.replace(/(_COMPLETE|_ERROR)$/m, match => `_${storeRoot}${match}`)
        : `${arg}_${storeRoot}`
      : arg
  )
  return createReducer(...annotatedReducer)(initialState)
}


// Create Redux Utilities.
// Helper that gelps to reduce boilerplate code when destructuring redux related utilities like e.g.
// consts, actions, reducer,selectors etc. It also produce the "storeHook" for rootReducer.
// If there is no "STORE_ROOT" const to supply it UID will be genrated automaticly with console warning.

// NOTE: When You're creating your Selectros you can wrap them in a function (root) => ({selcetors})
//       to supply them with dynamic "STORE_ROOT" key.
//
export const createReduxUtils = (fromReducer, fromActions, consts = {}, hash) => {
  let storeRoot = hash || consts.STORE_ROOT
  let actions = fromActions
  let reducer = fromReducer.default

  // Create random "storeRoot" to not crash.
  if (!storeRoot) {
    storeRoot = uid()
    console.warn("There is no STORE_ROOT constant to generate 'storeHook'. UID was generated: " + storeRoot)
  }

  // Annotate action types and reducer's functions with given hash.
  if (hash) {
    actions = annotateActions(actions, storeRoot)
    reducer = annotateReducer(reducer, storeRoot)
  }

  const selectors = typeof fromReducer.selectors === "function"
    ? fromReducer.selectors(storeRoot)
    : fromReducer.selectors
  const storeHook = {[storeRoot]: reducer}
  return {storeHook, actions, selectors, consts}
}


// ---- Test Async Actions ----------------

export const testAsyncActions = () => {

  let timer
  let resolveProise
  let stopActionRegex = /\^/

  const sniffer = store => next => action => {
    if (stopActionRegex.test(action.type)) {
      timer && clearTimeout(timer)
      resolveProise(action)
    }
    return next(action)
  }


  const listener = (action, timeout, resolveActionType) => new Promise((resolve, reject) => {
    resolveProise = resolve
    stopActionRegex = new RegExp(resolveActionType ? resolveActionType : `(${action.type}_COMPLETE|${action.type}_ERROR)`, "m")
    if (timeout) timer = setTimeout(() => reject("Async action time exeded"), timeout)
  })

  return {sniffer, listener}
}
