import React from 'react';

export const ExtDiv = ({ className = '', hidden = false, nonExist = false, ...props }) => (
  !nonExist
    ? (
      <div {...props} className={`${className} ${hidden ? 'hidden' : ''}`}>
        {props.children}
      </div>
    )
    : <div className="none" />
);

export default props => props.hidden ? <div className="none" /> : <div {...props}>{props.children}</div>;
