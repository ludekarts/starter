import {connect} from "react-redux"
import {createReduxUtils} from "helpers/redux-helpers"

// Component.
import Overview from "./overview"


// ---- Redux ------------------

import * as consts from "consts"
import * as actions from "actions"
import * as reducer from "reducer"

// Redux Utilities.
export const utils = createReduxUtils(reducer, actions, consts)


// ---- Connect ----------------

const {sayHello} = utils.actions
const overwiew = utils.selectors

const mapStateToProps = state => ({
  message: overwiew.getMessage(state)
})

const mapDispatchToProps = dispatch => ({
  sayHello: () => dispatch(sayHello())
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
