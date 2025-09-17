import React from 'react'

const Button = ({ text, onClick, className }) => {
  return (
    <button onClick={onClick} className={`custom-btn ${className || ""}`}>
      {text}
    </button>
  )
}

export default Button

