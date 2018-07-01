import {mountReducers} from "rhm"
import {combineReducers} from "redux"

// Component Reducers.
import {overview} from "../screens/overview"

// Main Reducer.
export default combineReducers(mountReducers(overview))
