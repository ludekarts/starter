import React from "react"
import PropTypes from "prop-types"

export default class Overview extends React.PureComponent {

  static propTypes  = {
    sayHello: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired
  }

  render() {
    return (
      <div>
        <h1>Overview</h1>
        <button onClick={this.props.sayHello}>Say Hello</button>
        <span> → </span>
        <span className="message">{this.props.message}</span>
      </div>
    )
  }
}
