import * as React from 'react';
import { connect } from 'react-redux';
import Preloader from 'components/ui/Preloader';

type PropsDistanceAgg = {
  distance: any;
};

const DistanceAgg: React.SFC<PropsDistanceAgg> = ({ distance }) => (
  <div className="car_info-distance">
    <span>Протяженность, км: </span>
    {
      distance === -1 ?
        ( <Preloader type="field" /> )
      :
      (
        distance === null ?
          <span>{'---'}</span>
        :
          <span>{distance / 1000}</span>
      )
    }
  </div>
      
)
const mapStateToProps = state => ({
  distance: state.monitorPage.carInfo.trackCaching.distance,
});

export default connect(
  mapStateToProps,
)(DistanceAgg);
