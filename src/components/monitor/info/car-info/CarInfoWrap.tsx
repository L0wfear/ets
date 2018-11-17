import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { OwnPropsCarInfo } from './CarInfo';

type PropsCarInfoWrap = {
  map: ol.Map,
  centerOn: any;
};
type StateCarInfoWrap = {
};

const CarInfo = React.lazy<React.ComponentType<OwnPropsCarInfo>>(() => (
  import(/* webpackChunkName: "car_info" */'components/monitor/info/car-info/CarInfo')
));

class CarInfoWrap extends React.Component<PropsCarInfoWrap, StateCarInfoWrap> {
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
