import Overview from "./overview"

// Redux.
import {sayHello} from "actions"
import {connect} from "react-redux"
import {selectors as overwiew} from "reducer"

// ---- Connect ----------------

const mapStateToProps = state => ({
  message: overwiew.getMessage(state)
})

const mapDispatchToProps = dispatch => ({
  sayHello: () => dispatch(sayHello())
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
