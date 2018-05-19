import config from "config"
import clientCreator from "./client"

const defaultConfig = {
  mode: "cors",
  method: "post",
  cache: "default",
  // credentials: "include"
}

// Configure your client here!
export default clientCreator(config.api, defaultConfig)
