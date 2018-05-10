import * as React from 'react';
import * as CarAvailableIcon from 'assets/images/car_available.png';
import * as CarNotAvailableIcon from 'assets/images/car_not_available.png';

const style = {
  marginRight: 10,
  marginTop: -2,
};

const CarOptionLabel: React.SFC<any> = ({ available, label }) =>
  <div>
    {
      available
      ?
      <img role="presentation" height="20" src={CarAvailableIcon} style={style} />
      :
      <img role="presentation" height="20" src={CarNotAvailableIcon} style={style} />
    }
    {label}
  </div>;

export default CarOptionLabel;
