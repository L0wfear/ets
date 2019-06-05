import * as React from 'react';
import { connect } from 'react-redux';
import Map from 'ol/Map';

import TitleBlock from 'components/monitor/info/car-info/title-block/TitleBlock';
import CarMainDataBlock from 'components/monitor/info/car-info/car-main-data-block/CarMainDataBlock';
import CarTabMenu from 'components/monitor/info/car-info/car-tab-menu/CarTabMenu';
import { carInfoSetGpsNumber } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { DataContainer } from 'components/monitor/styled';

export type StateCarInfo = {
};

export type StatePropsCarInfo = {};
export type DispatchPropsCarInfo = {
  carInfoSetGpsNumber: () => any;
};
export type OwnPropsCarInfo = {
  map: Map,
  centerOn: any;
};

export type PropsCarInfo = (
  StatePropsCarInfo
  & DispatchPropsCarInfo
  & OwnPropsCarInfo
);

class CarInfo extends React.Component<PropsCarInfo, StateCarInfo> {
  componentWillUnmount() {
    this.props.carInfoSetGpsNumber();
  }

  render() {
    return (
      <DataContainer className="car_info">
        <TitleBlock />
        <CarMainDataBlock map={this.props.map} centerOn={this.props.centerOn} />
        <CarTabMenu map={this.props.map} centerOn={this.props.centerOn} />
      </DataContainer>
    );
  }
}

export default compose<PropsCarInfo, OwnPropsCarInfo>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'gps_code'],
  }),
  connect<StatePropsCarInfo, DispatchPropsCarInfo, OwnPropsCarInfo, ReduxState>(
    null,
    (dispatch) => ({
      carInfoSetGpsNumber() {
        dispatch(carInfoSetGpsNumber(null, null));
      },
    }),
  ),
)(CarInfo);
