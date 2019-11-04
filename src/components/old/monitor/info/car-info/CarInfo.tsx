import * as React from 'react';
import Map from 'ol/Map';
import { compose } from 'recompose';

import TitleBlock from 'components/old/monitor/info/car-info/title-block/TitleBlock';
import CarMainDataBlock from 'components/old/monitor/info/car-info/car-main-data-block/CarMainDataBlock';
import CarTabMenu from 'components/old/monitor/info/car-info/car-tab-menu/CarTabMenu';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { DataContainer } from 'components/old/monitor/styled';

export type StatePropsCarInfo = {};
export type DispatchPropsCarInfo = {};
export type OwnPropsCarInfo = {
  map: Map;
  centerOn: any;
};

export type PropsCarInfo = (
  StatePropsCarInfo
  & DispatchPropsCarInfo
  & OwnPropsCarInfo
);

const CarInfo: React.FC<PropsCarInfo> = React.memo(
  (props) => {
    return (
      <DataContainer className="car_info">
        <TitleBlock />
        <CarMainDataBlock map={props.map} centerOn={props.centerOn} />
        <CarTabMenu map={props.map} centerOn={props.centerOn} />
      </DataContainer>
    );
  },
);

export default compose<PropsCarInfo, OwnPropsCarInfo>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'gps_code'],
  }),
)(CarInfo);
