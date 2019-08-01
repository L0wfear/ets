import * as React from 'react';
import Map from 'ol/Map';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';

import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import {
  fetchTrack,
  fetchCarInfo,
} from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';

import { CarInfoButtonsRow } from './styled/index';
import {
  BtnGroupWrapper,
  BtnPart,
} from 'global-styled/global-styled';

type PropsCarTabMenu = {
  fetchMissionsData: any;
  fetchTrack: any;
  asuods_id: number | void;
  gps_code: number | void;
  odh_mkad: -1 | null | any[];
  map: Map;

  centerOn: any;
};

const CarAttributeInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_attribute_information" */ 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation'),
);

const CarChartsInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_charts_information" */ 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/CarChartsInformation'),
);

const CarTrackInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_track_information" */ 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/CarTrackInformation'),
);

const CarTabMenu: React.FC<PropsCarTabMenu> = React.memo(
  (props) => {
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

    const handleSelectInfo = React.useCallback(
      () => setTabNum(1),
      [],
    );
    const handleSelectChart = React.useCallback(
      () => setTabNum(2),
      [],
    );
    const handleSelectTrack = React.useCallback(
      () => setTabNum(3),
      [],
    );

    return (
      <div>
        <CarInfoButtonsRow>
          <BtnGroupWrapper fullWidth={true}>
            <BtnPart>
              <EtsBootstrap.Button active={tabNum === 1} onClick={handleSelectInfo}>
                Информация
              </EtsBootstrap.Button>
            </BtnPart>
            <BtnPart>
              <EtsBootstrap.Button active={tabNum === 2} onClick={handleSelectChart}>
                Графики
              </EtsBootstrap.Button>
            </BtnPart>
            <BtnPart>
              <EtsBootstrap.Button active={tabNum === 3} onClick={handleSelectTrack}>
                  Трекинг
              </EtsBootstrap.Button>
            </BtnPart>
          </BtnGroupWrapper>
        </CarInfoButtonsRow>
        <React.Suspense fallback={<LoadingComponent />}>
          <EtsBootstrap.ViewCarousel indexShow={tabNum - 1}>
            <CarAttributeInformation map={props.map} />
            <CarChartsInformation centerOn={props.centerOn} />
            <CarTrackInformation map={props.map} />
          </EtsBootstrap.ViewCarousel>
        </React.Suspense>
      </div>
    );
  },
);

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
