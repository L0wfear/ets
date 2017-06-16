import React from 'react';

export const ExtDiv = ({ className = '', hidden = false, ...props }) => (
  <div {...props} className={`${className} ${hidden ? 'hidden' : ''}`}>
    {props.children}
  </div>
);

export default props => props.hidden ? <div className="none" /> : <div {...props}>{props.children}</div>;
