import rhm from "rhm"
import logger from "redux-logger"
import {applyMiddleware, createStore} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"

// Root reducer.
import reducer from "./reducers"

// Apply additional middleware.
const middleware = process.env.NODE_ENV !== "production"
  ? composeWithDevTools(applyMiddleware(rhm, logger))
  : applyMiddleware(rhm)

// Main store.
const store = createStore(reducer, middleware)

// Hot reloading.
if (module.hot) {
  module.hot.accept("./reducers", () =>
    store.replaceReducer(require("./reducers").default)
  );
}

// Export Store.
export default store
