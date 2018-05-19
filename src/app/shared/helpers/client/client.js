
// ---- Helpers ---------------

const checkResponse = response =>
  !~response.headers.get("content-type").indexOf("application/json")
   ? {error: true, message: "Invalid content-type"}
   : response.json()

const objectToFetchBody = objectBody => {
  const body = new FormData()
  Object.keys(objectBody).forEach(name => body.append(name, objectBody[name]))
  return {body}
}

const request = ({url, config}, defaultConfig) => {
  // Allows to extend/override current fetch configuration.
  let finalConfig = config ? {...defaultConfig, ...config} : defaultConfig
  // Allows for custom body.
  if (config && config.body) finalConfig = {...finalConfig, ...objectToFetchBody(config.body)}
  // Finaly fetch the URL.
  return fetch(url, finalConfig).then(checkResponse).catch(console.error)
}


// NOTE:
// You may wan to configure request directly from "config.js" file.
// In that case config method need to return an object => {url, config}
const clientCreator = (methods, defaultConfig = {}) => {
  if (!methods) throw "No methods proveided for the client component."

  return Object.keys(methods).reduce((acc, name) => {
    acc[name] = (...args) => {
      const proxy = methods[name](...args)
      return request (proxy.config ? proxy : {url: proxy}, defaultConfig)
    }
    return acc
  }, {})
}

export default clientCreator
