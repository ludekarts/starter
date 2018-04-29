import {connect} from "react-redux"
import {createReduxUtils} from "helpers/redux-helpers"

// Component.
import Overview from "./overview"


// ---- Redux ------------------

import * as consts from "consts"
import * as actions from "actions"
import * as reducer from "reducer"

// Redux Utilities.
export const utils = createReduxUtils(reducer, actions, consts, "CUSTOM")


// ---- Connect ----------------

const overview = utils.selectors
const {sayHello, sayAsync} = utils.actions

const mapStateToProps = state => ({
  pending: overview.isPending(state),
  message: overview.getMessage(state),
  haveMessage: overview.haveMessage(state)
})

const mapDispatchToProps = dispatch => ({
  sayHello: () => dispatch(sayHello()),
  sayAsync: (message) => dispatch(sayAsync(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
