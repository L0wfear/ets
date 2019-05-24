import * as React from 'react';
import { connect } from 'react-redux';
import Preloader from 'components/ui/new/preloader/Preloader';
import { attributeList } from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/attribute-list';
import {
  TypeLastPoint,
  PropsCarAttributeInformation,
} from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation.h';
import CarMissions from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-missions/CarMissions';
import { makeDate, makeTime } from 'utils/dates';

import { roundCoordinates } from 'utils/geo';
import { ReduxState } from 'redux-main/@types/state';
import CarCreateMission from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-create-mission/CreateMission';
import { CarInfoBlockTabData } from 'components/monitor/styled';

const makeLastPointString = (lastPoint: TypeLastPoint): string => {
  const dt = new Date(lastPoint.timestamp * 1000);

  return `${makeDate(dt)} ${makeTime(dt, true)} [${roundCoordinates(lastPoint.coords_msk)}]`;
};

const CarAttributeInformation: React.FC<PropsCarAttributeInformation> = (props) => {
  const { lastPoint, errorInLoadTrack, gps_code } = props;

  return (
    <div>
      <CarInfoBlockTabData>
        <div className="car_info-attributes" >
          {
            attributeList.map((attr) => {
              const value = attr.value(props);

              return (
                <div key={attr.title}>
                  <span className="car_info-attr_title">{`${attr.title}: `}</span>
                  {
                    !value && value !== null ?
                      <Preloader typePreloader="field" />
                    :
                      <span className="car_info-attr_value">{value || '-'}</span>
                  }
                </div>
              );
            })
          }
          <span className="car_info-attr_title">{'Последняя точка: '}</span>
          {
            !lastPoint && lastPoint !== null
            ? (
              errorInLoadTrack
              ? (
                'Ошибка загрузки трека'
              )
              : (
                <Preloader typePreloader="field" />
              )
            )
            : (
              <span className="car_info-attr_value">{lastPoint && makeLastPointString(lastPoint) || '-'}</span>
            )
          }
        </div>
      </CarInfoBlockTabData>
      <CarMissions />
      <CarCreateMission
        gps_code={gps_code}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...attributeList.reduce((newObj, attr) => {
    const { key } = attr;

    if (attr.carActualGpsNumberIndex) {
      newObj[key] = (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { [key]: null})[key];
    }

    return newObj;
  }, {}),
  status: state.monitorPage.carInfo.status,
  lastPoint: state.monitorPage.carInfo.trackCaching.track === -1 ? false : (state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null),
  errorInLoadTrack: state.monitorPage.carInfo.trackCaching.error,
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
});

export default connect<any, any, any, ReduxState>(
  mapStateToProps,
)(CarAttributeInformation);
