import * as React from 'react';
import { connect } from 'react-redux';
import TravelTimeValue from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/TravelTimeValue';

type PropsTravelTime = {
};

const TravelTime: React.FC<PropsTravelTime> = () => (
  <div className="car_info-time">
    <span>Время движения общее, ч: </span><TravelTimeValue />
  </div>
);

export default connect(
)(TravelTime);
