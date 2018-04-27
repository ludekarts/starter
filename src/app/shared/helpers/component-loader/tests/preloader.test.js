import React from "react"
import {shallow} from "enzyme"
import "jest-styled-components"

// Component.
import Preloader from "../preloader"


describe("Component Preloader Tests", () => {

  it ("Should display Error Label", () => {
    const wrapper = shallow(<Preloader error/>)
    const content = wrapper.childAt(0).text()
    expect(content).toEqual("Component Error")
  })

  it ("Should display Timeout Label", () => {
    const wrapper = shallow(<Preloader timedOut />)
    const content = wrapper.childAt(0).text()
    expect(content).toEqual("Component Timeout")
  })

  it ("Should display Spinner", () => {
    const wrapper = shallow(<Preloader pastDelay />)
    expect(wrapper.children().length).toEqual(3)
  })

})
