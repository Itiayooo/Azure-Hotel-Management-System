import React from 'react';

const Button = ({ text, children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`custom-btn ${className || ""}`}
    >
      {children ?? text}
    </button>
  )
}

export default Button;
