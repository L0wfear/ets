import React from 'react';

export const ExtDiv = ({
  className = '',
  hidden = false,
  nonExist = false,
  ...props
}) =>
  !nonExist && (
    <div {...props} className={`${className} ${hidden ? 'hidden' : ''}`}>
      {props.children}
    </div>
  );

export default (props) =>
  !props.hidden && <div {...props}>{props.children}</div>;
