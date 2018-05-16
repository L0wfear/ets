import * as React from 'react';

const ButtonCarsFilter: React.SFC<any> = props =>
  <div className={`button-cars-filter ${props.className}`} onClick={props.onClick}>{props.children}</div>;

export default ButtonCarsFilter;
