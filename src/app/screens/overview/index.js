import {connect} from "react-redux"
import {createReduxUtils} from "rhm"
import {bindActionCreators} from "redux"

// Component.
import Overview from "./overview"


// ---- Redux ------------------

import * as consts from "consts"
import * as actions from "actions"
import * as reducer from "reducer"

// Redux Utilities.
// Create Redux Utilities object containing mounting point for Overview component in the rootReducer,
// along with "actions", "selectors" and "consts" reated to the Overview.
// createReduxUtils() can also add custom namesaces to the actions so you can reuse component's functionality
// in other instances, or extend new components with current one.
export const overview = createReduxUtils({reducer, actions, consts})


// ---- Connect ----------------

const {actions: overviewActions, selectors} = overview

const mapStateToProps = state => ({
  pending: selectors.isPending(state),
  message: selectors.getMessage(state),
  haveMessage: selectors.haveMessage(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(overviewActions, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Overview)
