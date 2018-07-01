import React from "react"
import {hot} from "react-hot-loader"
import {injectGlobal} from "styled-components"
import ComponentLoader from "helpers/component-loader"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

// Config.
import config from "config"

// Redux.
import store from "../redux/store"
import {Provider} from "react-redux"

// Screens.
const Overview = ComponentLoader(() => import("../screens/overview"))

// Set globals styles.
injectGlobal`
  body {
    margin: 0;
    height: 100%;
    font-family: "Roboto", sans-serif;
  }
`

export default hot(module)(prop =>
  <Provider store={store}>
    <Router basename={config.basename}>
      <Switch>
        <Route path="/" exact component={Overview}/>
      </Switch>
    </Router>
  </Provider>
)
