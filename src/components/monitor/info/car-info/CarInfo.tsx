import * as React from 'react';
import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import TitleBlock from 'components/monitor/info/car-info/title-block/TitleBlock';
import CarMainDataBlock from 'components/monitor/info/car-info/car-main-data-block/CarMainDataBlock';
import CarTabMenu from 'components/monitor/info/car-info/car-tab-menu/CarTabMenu';
import { carInfoSetGpsNumber } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
type PropsCarInfo = {
  carInfoSetGpsNumber: Function,
  map: ol.Map,

  centerOn: Function;
};
type StateCarInfo = {
}

class CarInfo extends React.Component<PropsCarInfo, StateCarInfo> {
  componentWillUnmount() {
    this.props.carInfoSetGpsNumber();
  }

  render() {
    return (
      <div className="data_container car_info">
        <TitleBlock />
        <CarMainDataBlock map={this.props.map} centerOn={this.props.centerOn} />
        <CarTabMenu map={this.props.map} centerOn={this.props.centerOn} />
      </div>
    )
  }
}

const mapStateToProps = null;
const mapDispatchToProps = dispatch => ({
  carInfoSetGpsNumber() { dispatch(carInfoSetGpsNumber(null, null)); },
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'gps_code'],
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CarInfo);
