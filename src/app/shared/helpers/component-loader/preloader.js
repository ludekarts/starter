import React from "react"
import styled from "styled-components"

const Spinner = styled.div `
 & > div {
    width: 8px;
    height: 8px;
    margin: 2px;
    background-color: ${({color}) => color || "#424242"};

    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  & div:nth-child(1) {
    animation-delay: -0.32s;
  }

  & div:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1.0);
    }
  }
`

const Label = styled.span`
  color: white;
  font-size: 11px;
  padding: 3px 5px;
  border-radius: 2px;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  background: ${({color = "#ccc"}) => color};
`

export default props => {
  if (props.error) {
    console.error("Component Loading Error\n", props.error)
    return <Label color="#f7003b">Component Error</Label>
  }
  else if (props.timedOut) {
    return <Label color="#620cc7">Component Timeout</Label>
  }
  else if (props.pastDelay) {
    return (
      <Spinner className="spinner" color={props.color}>
        <div></div>
        <div></div>
        <div></div>
      </Spinner>
    )
  }
  else {
    return null
  }
}
