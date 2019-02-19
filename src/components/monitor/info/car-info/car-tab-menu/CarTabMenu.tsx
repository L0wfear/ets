import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import {
  fetchTrack,
  fetchCarInfo,
} from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import { DivNone } from 'global-styled/global-styled';
import { CarInfoButtonsRow } from './styled/index';

type PropsCarTabMenu = {
  fetchMissionsData: any;
  fetchTrack: any;
  asuods_id: number | void;
  gps_code: number | void;
  odh_mkad: -1 | null | any[];
  map: ol.Map;

  centerOn: any;
};

const CarAttributeInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_attribute_information" */ 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation'),
);

const CarChartsInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_charts_information" */ 'components/monitor/info/car-info/car-tab-menu/car-chart-information/CarChartsInformation'),
);

const CarTrackInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_track_information" */ 'components/monitor/info/car-info/car-tab-menu/car-track-information/CarTrackInformation'),
);

const CarTabMenu: React.FC<PropsCarTabMenu> = (props) => {
  const { asuods_id, odh_mkad, gps_code } = props;

  const [tabNum, setTabNum] = React.useState(1);
  React.useEffect(() => {
    if (asuods_id && odh_mkad !== -1) {
      props.fetchMissionsData({
        asuods_id,
        gps_code,
      });
      props.fetchTrack({
        asuods_id,
        gps_code,
      });
    }
  }, [asuods_id, odh_mkad]);

  const handleSelectInfo = React.useCallback<React.MouseEventHandler<Button>>(
    () => setTabNum(1),
    [],
  );
  const handleSelectChart = React.useCallback<React.MouseEventHandler<Button>>(
    () => setTabNum(2),
    [],
  );
  const handleSelectTrack = React.useCallback<React.MouseEventHandler<Button>>(
    () => setTabNum(3),
    [],
  );

  return (
    <div>
      <CarInfoButtonsRow>
        <Button active={tabNum === 1} onClick={handleSelectInfo}>
          Информация
        </Button>
        <Button active={tabNum === 2} onClick={handleSelectChart}>
          Графики
        </Button>
        <Button active={tabNum === 3} onClick={handleSelectTrack}>
          Трекинг
        </Button>
      </CarInfoButtonsRow>
      <React.Suspense fallback={<LoadingComponent />}>
        {tabNum === 1 ? (
          <CarAttributeInformation map={props.map} />
        ) : (
          <DivNone />
        )}
        {tabNum === 2 ? (
          <CarChartsInformation centerOn={props.centerOn} />
        ) : (
          <DivNone />
        )}
        {tabNum === 3 ? <CarTrackInformation map={props.map} /> : <DivNone />}
      </React.Suspense>
    </div>
  );
};

const mapStateToProps = (state) => ({
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
  gps_code: state.monitorPage.carInfo.gps_code,
  date_start: state.monitorPage.carInfo.date_start,
  asuods_id: (
    state.monitorPage.carActualGpsNumberIndex[
      state.monitorPage.carInfo.gps_code
    ] || { asuods_id: null }
  ).asuods_id,
});

const mapDispatchToProps = null;
const mergeProps = (
  { asuods_id, odh_mkad, gps_code, ...otherStateProps },
  { dispatch },
  { map, ...other },
) => ({
  asuods_id,
  odh_mkad,
  gps_code,
  map,
  ...other,
  fetchMissionsData: (props) =>
    dispatch(
      fetchCarInfo({
        asuods_id: props.asuods_id,
        gps_code: props.gps_code,
      }),
    ),
  fetchTrack: (props) =>
    dispatch(
      fetchTrack(
        {
          asuods_id: props.asuods_id,
          gps_code: props.gps_code,
          date_start: otherStateProps.date_start,
        },
        odh_mkad,
      ),
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CarTabMenu);
