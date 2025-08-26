import React, { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-md',
  rounded = 'rounded-lg',
  background = 'bg-white'
}, ref) => {
  const baseClasses = 'border border-gray-200';
  const classes = `${baseClasses} ${background} ${shadow} ${rounded} ${padding} ${className}`;

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
});

export default Card;
