import {createAction} from "rhm"

export const sayHello = createAction("HELLO", "hello")
export const sayAsync = createAction("SAY_ASYNC", message => new Promise((resolve) => setTimeout(() => resolve(message), 1500)))
