import {combineReducers} from "redux"

// Component Reducers.
import {storeHook as overview} from "../screens/overview"

// Main Reducer.
export default combineReducers({
  ...overview
})
