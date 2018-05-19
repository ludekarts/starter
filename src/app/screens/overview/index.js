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

export const utils = createReduxUtils(_reducer, _actions, _consts)


// ---- Connect ----------------

const overview = utils.selectors
const actions = utils.actions

const mapStateToProps = state => ({
  pending: overview.isPending(state),
  message: overview.getMessage(state),
  haveMessage: overview.haveMessage(state)
})

const mapDispatchToProps = dispatch => ({
  sayHello: () => dispatch(actions.sayHello()),
  sayAsync: (message) => dispatch(actions.sayAsync(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
