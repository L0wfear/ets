import * as React from 'react';
import { connect } from 'react-redux';
import DistanceOverSpeedValue from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceOverSpeedValue';

type PropsDistanceOverSpeed = {
};

const DistanceOverSpeed: React.FC<PropsDistanceOverSpeed> = () => (
  <div className="car_info-distance-over">
    <span>Дистанция с превышением скорости, км: </span><DistanceOverSpeedValue />
  </div>
);

export default connect(
)(DistanceOverSpeed);
