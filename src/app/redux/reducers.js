import {combineReducers} from "redux"

// Component Reducers.
import {utils as overview} from "../screens/overview"

// Main Reducer.
export default combineReducers({
  ...overview.storeHook
})
