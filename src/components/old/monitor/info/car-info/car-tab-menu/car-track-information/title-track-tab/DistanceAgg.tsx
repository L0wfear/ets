import * as React from 'react';
import { connect } from 'react-redux';
import DistanceAggValue from 'components/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceAggValue';

type PropsDistanceAgg = {
};

const DistanceAgg: React.FC<PropsDistanceAgg> = () => (
  <div className="car_info-distance">
    <span>Протяженность, км: </span><DistanceAggValue />
  </div>
);

export default connect(
)(DistanceAgg);
