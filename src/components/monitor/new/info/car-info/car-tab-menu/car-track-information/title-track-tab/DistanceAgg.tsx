import * as React from 'react';
import { connect } from 'react-redux';
import Preloader from 'components/ui/Preloader';

type PropsDistanceAgg = {
  distance_agg2: any;
};

const DistanceAgg: React.SFC<PropsDistanceAgg> = ({ distance_agg2 }) => (
  <div className="car_info-distance">
    <span>Протяженность, км: </span>
    {
      distance_agg2 === -1 ?
        ( <Preloader type="field" /> )
      :
      (
        distance_agg2 === null ?
          <span>{'---'}</span>
        :
          <span>{distance_agg2 / 1000}</span>
      )
    }
  </div>
      
)
const mapStateToProps = state => ({
  distance_agg2: state.monitorPage.carInfo.trackCaching.distance_agg2,
});

export default connect(
  mapStateToProps,
)(DistanceAgg);
