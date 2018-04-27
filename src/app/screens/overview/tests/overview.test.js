import React from "react"
import {shallow, mount} from "enzyme"
import {createStore, combineReducers} from "redux"

// Component.
import Overview from "../overview"

// Redux.
import reducer from "reducer"
import {utils} from "../index"

const {storeHook} = utils
const {sayHello} = utils.actions
const {getMessage} = utils.selectors


describe("Overview Tests", () => {

  it ("Should display 'greeting' message", () => {
    const wrapper = shallow(<Overview message="greeting" sayHello={() => {}} />)
    const message = wrapper.find(".message").text()
    expect(message).toBe("greeting")
  })

  describe("Overview Redux Tests", () => {

    it("Should create HELLO message", () => {
      const store = createStore(combineReducers({...storeHook}))
      store.dispatch(sayHello())
      expect(getMessage(store.getState())).toEqual("hello")
    })

    it ("Should show 'hello' message after button click", () => {
      const store = createStore(combineReducers({...storeHook}))
      store.subscribe(() => wrapper.setProps({message: getMessage(store.getState())}))

      const wrapper = mount(<Overview message="" sayHello={() => store.dispatch(sayHello())} />)
      wrapper.find('button').simulate('click')

      const message = wrapper.find(".message").text()
      expect(message).toEqual("hello")
    })
  })

  it("Renders correctly", () => {
    const wrapper = shallow(<Overview message="" sayHello={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  });

})
