import * as React from 'react';
import Map from 'ol/Map';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { OwnPropsCarInfo } from 'components/old/monitor/info/car-info/CarInfo';

type PropsCarInfoWrap = {
  map: Map;
  centerOn: any;
};
type StateCarInfoWrap = {
};

const CarInfo = React.lazy<React.ComponentType<OwnPropsCarInfo>>(() => (
  import(/* webpackChunkName: "car_info" */ 'components/old/monitor/info/car-info/CarInfo')
));

class CarInfoWrap extends React.PureComponent<PropsCarInfoWrap, StateCarInfoWrap> {
  render() {
    return (
      <React.Suspense fallback={<LoadingComponent />}>
        <CarInfo
          map={this.props.map}
          centerOn={this.props.centerOn}
        />
      </React.Suspense>
    );
  }
}

export default withShowByProps({
  path: ['monitorPage', 'carInfo', 'gps_code'],
})(CarInfoWrap);
