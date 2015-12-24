import React, {Component} from 'react';

export default (props) => props.hidden ? <div/> : <div {...props}>{props.children}</div>;
