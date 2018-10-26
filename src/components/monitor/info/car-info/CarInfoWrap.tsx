import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

type PropsCarInfo = {
  map: ol.Map,
  centerOn: Function;
};
type StateCarInfo = {
}

const ReactTest: any = React;

const CarInfo = ReactTest.lazy(() => (
  import(/* webpackChunkName: "car_info" */'components/monitor/info/car-info/CarInfo')
));

class CarInfoWrap extends React.Component<PropsCarInfo, StateCarInfo> {
  render() {
    return (
      <ReactTest.Suspense fallback={<LoadingComponent />}>
        <CarInfo
          map={this.props.map}
          centerOn={this.props.centerOn}
        />
      </ReactTest.Suspense>
    )
  }
}

export default withShowByProps({
  path: ['monitorPage', 'carInfo', 'gps_code'],
})(CarInfoWrap);
