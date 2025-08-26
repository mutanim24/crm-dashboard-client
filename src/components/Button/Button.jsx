import React from 'react';

const Button = ({ 
  text, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  variant = 'primary',
  children
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 disabled:bg-green-300',
    secondary: 'bg-green-400 text-white hover:bg-green-500 focus:ring-green-400 disabled:bg-green-300',
    outline: 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {text || children}
    </button>
  );
};

export default Button;
