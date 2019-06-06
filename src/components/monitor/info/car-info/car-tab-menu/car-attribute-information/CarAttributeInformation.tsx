import * as React from 'react';
import { connect } from 'react-redux';
import Map from 'ol/Map';
import PreloadNew from 'components/ui/new/preloader/PreloadNew';
import { getStatusById } from 'constants/statuses';

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

export type TypeLastPoint = {
  timestamp: number;
  coords_msk: [number, number],
};

export type PropsCarAttributeInformation = {
  company_name: string,
  gov_number: string,
  garage_number: string,
  gps_code: number,
  status: number,
  type_name: string,
  model_name: string,
  lastPoint: TypeLastPoint,
  errorInLoadTrack: boolean;
  map: Map;
  carActualGpsNumberIndex: any;

  missionsData: any;
};

type OneAtt<P> = {
  key?: string,
  title: string,
  value: (props: P) => string | number | JSX.Element | JSX.Element[],
  loader?: boolean;
  carActualGpsNumberIndex?: boolean;
  missionsData?: boolean;
};

export const attributeList: OneAtt<PropsCarAttributeInformation>[] = [
  {
    key: 'company_name',
    title: 'Организация',
    value: ({ company_name }) => company_name,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'customer_name',
    title: 'Заказчик',
    value: ({ missionsData: { carTabInfo: { customer_name } } }) => customer_name,
    missionsData: true,
  },
  {
    key: 'contractor_name',
    title: 'Подрядчик',
    value: ({ missionsData: { carTabInfo: { contractor_name } } }) => contractor_name,
    missionsData: true,
  },
  {
    key: 'owner_name',
    title: 'Владелец техники',
    value: ({ missionsData: { carTabInfo: { owner_name } } }) => owner_name,
    missionsData: true,
  },
  {
    key: 'gov_number',
    title: 'Рег. номер ТС',
    value: ({ gov_number }) => gov_number,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'garage_number',
    title: 'Гаражный номер',
    value: ({ garage_number }) => garage_number,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'gps_code',
    title: 'ID БНСО',
    value: ({ gps_code }) => gps_code,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'status',
    title: 'Статус',
    value: ({ status }) => status && getStatusById(status).title,
  },
  {
    key: 'type_name',
    title: 'Тип техники',
    value: ({ type_name }) => type_name,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'model_name',
    title: 'Шасси',
    value: ({ model_name }) => model_name,
    carActualGpsNumberIndex: true,
  },
];

const CarAttributeInformation: React.FC<PropsCarAttributeInformation> = (props) => {
  const { lastPoint, errorInLoadTrack, gps_code, missionsData } = props;

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
                    (attr.missionsData ? missionsData.isLoading : (!value && value !== null))
                      ? <PreloadNew typePreloader="field" />
                      : <span className="car_info-attr_value">{value || '-'}</span>
                  }
                </div>
              );
            })
          }
          <div>
            <span className="car_info-attr_title">{'Последняя точка: '}</span>
            {
              !lastPoint && lastPoint !== null
              ? (
                errorInLoadTrack
                ? (
                  'Ошибка загрузки трека'
                )
                : (
                  <PreloadNew typePreloader="field" />
                )
              )
              : (
                <span className="car_info-attr_value">{lastPoint && makeLastPointString(lastPoint) || '-'}</span>
              )
            }
          </div>
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
  missionsData: state.monitorPage.carInfo.missionsData,
});

export default connect<any, any, any, ReduxState>(
  mapStateToProps,
)(CarAttributeInformation);
