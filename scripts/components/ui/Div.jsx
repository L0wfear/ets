import React from 'react';

export default props => props.hidden ? <div className="none" /> : <div {...props}>{props.children}</div>;
