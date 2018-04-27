import Overview from "./container"

// Redux.
import * as actions from "actions"
import {STORE_ROOT} from "consts"
import reducer, {selectors} from "reducer"

// Mounting point for the Overview reducer.
const storeHook = {[STORE_ROOT]: reducer}

// Utilities.
export {storeHook, actions, selectors}

// Main Component.
export default Overview
