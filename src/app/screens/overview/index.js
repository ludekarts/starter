import {connect} from "react-redux"
import {createReduxUtils} from "rhm"

// Component.
import Overview from "./overview"


// ---- Redux ------------------

import * as _consts from "consts"
import * as _actions from "actions"
import * as _reducer from "reducer"

// Redux Utilities.
// Default behavior is to use contants to create proper "stroeHook"
// It cane be overrided with 4th parameter that is customization for all actions & reducer fns.
// export const utils = createReduxUtils(reducer, actions, consts, "CUSTOM") // ✨ Custonization

export const overview = createReduxUtils(_reducer, _actions, _consts)


// ---- Connect ----------------

const {actions, selectors} = overview

const mapStateToProps = state => ({
  pending: selectors.isPending(state),
  message: selectors.getMessage(state),
  haveMessage: selectors.haveMessage(state)
})

const mapDispatchToProps = dispatch => ({
  sayHello: () => dispatch(actions.sayHello()),
  sayAsync: (message) => dispatch(actions.sayAsync(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
