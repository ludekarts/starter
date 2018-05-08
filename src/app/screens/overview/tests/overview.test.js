import React from "react"
import {shallow, mount} from "enzyme"
import {createStore, combineReducers, applyMiddleware} from "redux"

import rhm, {testAsyncActions} from "rhm"

// Component.
import Overview from "../overview"

// Redux.
import {utils} from "../index"

const {storeHook} = utils
const {getMessage} = utils.selectors
const {sayHello, sayAsync} = utils.actions


describe("Overview Tests", () => {

  const overviewProps = {
    message: "",
    pending: false,
    haveMessage: false,
    sayHello: () => {},
    sayAsync: () => {}
  }


  it ("Should display \"greeting\" message", () => {
    const wrapper = shallow(<Overview {...overviewProps} message="greeting"/>)
    const message = wrapper.find("span[data-message]").text()
    expect(message).toBe("greeting")
  })



  describe("Overview Redux Tests", () => {

    it("Should create \"hello\" message in store", () => {
      const store = createStore(combineReducers({...storeHook}))
      store.dispatch(sayHello())
      expect(getMessage(store.getState())).toEqual("hello")
    })



    it ("Should show \"hello\" message after button click", () => {

      const store = createStore(combineReducers({...storeHook}))
      const wrapper = mount(<Overview {...overviewProps} sayHello={() => store.dispatch(sayHello())} />)

      store.subscribe(() => wrapper.setProps({message: getMessage(store.getState())}))
      wrapper.find("button[data-hello]").simulate("click")

      const message = wrapper.find("span[data-message]").text()
      expect(message).toEqual("hello")
    })



    it ("Should show \"Async Hello\" message after button click", () => {

      const {sniffer, listener} = testAsyncActions()
      const store = createStore(combineReducers({...storeHook}), applyMiddleware(rhm, sniffer))

      // Since value of async message came from the internal <Overview/> state make sure that "dispatchedAction"
      // is the same as the one we want to listen for.
      // Typically you'd just pass "asyncActionName()" directly to the "lietsner"
      let dispatchedAction
      const dispatchAsync = msg => {
        dispatchedAction = sayAsync(msg)
        store.dispatch(dispatchedAction)
      }

      const wrapper = mount(<Overview {...overviewProps} sayAsync={dispatchAsync} />)
      wrapper.find("button[data-async]").simulate("click")

      return listener(dispatchedAction, 4000).then(action => {

        wrapper.setProps({message: getMessage(store.getState())})
        const message = wrapper.find("span[data-message]").text()

        expect.assertions(1)
        expect(message).toEqual("Async Hello")
      })
    })



    it("Renders correctly", () => {
      const wrapper = shallow(<Overview {...overviewProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
