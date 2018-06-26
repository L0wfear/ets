import * as React from 'react';

export const SpanTitle = (props) => (
  <span> style={{ marginLeft: '15px' }}>
    {props.children}
  </span>
);

export const ColorLegend = (props) => (
  <div> style={{ backgroundColor: props.color }}>
    {props.children}
  </div>
);
