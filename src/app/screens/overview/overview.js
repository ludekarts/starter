import React from "react"
import PropTypes from "prop-types"

export default class Overview extends React.PureComponent {

  static propTypes  = {
    pending: PropTypes.bool.isRequired,
    sayHello: PropTypes.func.isRequired,
    sayAsync: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    haveMessage: PropTypes.bool.isRequired
  }

  sayAsync = event => this.props.sayAsync("Async Hello")

  render() {
    return (
      <div>
        <h1>Overview { this.props.pending ? "🌌" : this.props.haveMessage ? "👑" : "🕵️"}</h1>
        <button onClick={this.props.sayHello}>Say Hello</button>
        <span> 🖐 </span>
        <button onClick={this.sayAsync}>Say it Async</button>
        <span> → </span>
        <span className="message">{this.props.message}</span>
      </div>
    )
  }
}
