import React, {Component} from 'react';

export default (props) => props.hidden ? <span className="none"/> : <span {...props}>{props.children}</span>;
