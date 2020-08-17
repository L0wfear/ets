import * as React from 'react';
import { connect } from 'react-redux';
import Map from 'ol/Map';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';
import { getStatusById } from 'constants/statuses';

import CarMissions from 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/car-missions/CarMissions';
import { makeDate, makeTime } from 'components/@next/@utils/dates/dates';

import { roundCoordinates } from 'utils/geo';
import { ReduxState } from 'redux-main/@types/state';
import CarCreateMission from 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/car-create-mission/CreateMission';
import { CarInfoBlockTabData } from 'components/old/monitor/styled';
import CarWaybills from 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/car-waybills/CarWaybills';
import WaybillFormWrap from 'components/old/waybill/WaybillFormWrap';
import { compose } from 'redux';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { fetchCarInfo } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const makeLastPointString = (lastPoint: TypeLastPoint): string => {
  const dt = new Date(lastPoint.timestamp * 1000);

  return `${makeDate(dt)} ${makeTime(dt, true)} [${roundCoordinates(lastPoint.coords_msk)}]`;
};

export const makeLastPointTrack = (trackCaching) => trackCaching.track === -1 ? false : (trackCaching.track.slice(-1)[0] || null);

export type TypeLastPoint = {
  timestamp: number;
  coords_msk: [number, number];
};

export type PropsCarAttributeInformation = {
  asuods_id: {asuods_id: number;};
  company_name: string;
  gov_number: string;
  garage_number: string;
  gps_code: number;
  status: number;
  type_name: string;
  model_name: string;
  lastPoint: TypeLastPoint;
  errorInLoadTrack: boolean;
  map: Map;
  fetchMissionsData: any;
  missionsAndWaybillsData: any;
  dispatch: EtsDispatch;
} & WithSearchProps;

type OneAtt<P> = {
  key?: string;
  title: string;
  value: (props: P) => string | number | JSX.Element | Array<JSX.Element>;
  loader?: boolean;
  carActualGpsNumberIndex?: boolean;
  missionsAndWaybillsData?: boolean;
};

export const attributeList: Array<OneAtt<PropsCarAttributeInformation>> = [
  {
    key: 'company_name',
    title: 'Организация',
    value: ({ company_name }) => company_name,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'customer_name',
    title: 'Заказчик',
    value: ({ missionsAndWaybillsData: { carTabInfo: { customer_name } } }) => customer_name,
    missionsAndWaybillsData: true,
  },
  {
    key: 'contractor_name',
    title: 'Подрядчик',
    value: ({ missionsAndWaybillsData: { carTabInfo: { contractor_name } } }) => contractor_name,
    missionsAndWaybillsData: true,
  },
  {
    key: 'owner_name',
    title: 'Владелец техники',
    value: ({ missionsAndWaybillsData: { carTabInfo: { owner_name } } }) => owner_name,
    missionsAndWaybillsData: true,
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

const CarAttributeInformation: React.FC<PropsCarAttributeInformation> = React.memo(
  (props) => {
    const { 
      lastPoint, 
      errorInLoadTrack,
      gps_code, 
      missionsAndWaybillsData, 
      asuods_id,
      fetchMissionsData, 
      setParamsAndSearch,
      searchState,
    } = props;

    const [showWaybillForm, setShowWaybillForm] = React.useState(false);
    const [waybillData, setWaybillData] = React.useState(null);
    const [defaultCarData, setDefaultCarData] = React.useState(null);

    const handleHideWaybillForm = React.useCallback(() => {
      setParamsAndSearch({
        params: {waybill_id: null}, 
        search: {
          date_start: searchState.date_start,
          date_end: searchState.date_end,
        }
      });
      fetchMissionsData({
        asuods_id,
        gps_code,
      });
    }, [asuods_id, searchState.date_start, searchState.date_end]);

    return (
      <div>
        <CarInfoBlockTabData>
          <div id="car_main_data" className="car_info-attributes" >
            {
              attributeList.map((attr) => {
                const value = attr.value(props);

                return (
                  <div key={attr.title}>
                    <span className="car_info-attr_title">{`${attr.title}: `}</span>
                    {
                      (attr.missionsAndWaybillsData ? missionsAndWaybillsData.isLoading : (!value && value !== null))
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
        <CarWaybills 
          setShowWaybillForm={setShowWaybillForm}
          setWaybillData={setWaybillData}
          setDefaultCarData={setDefaultCarData}
          gps_code={gps_code}
          showWaybillForm={showWaybillForm}
        />
        <CarCreateMission
          gps_code={gps_code}
        />
        {
          showWaybillForm
            && (
              <WaybillFormWrap
                onFormHide={handleHideWaybillForm}
                onCallback={handleHideWaybillForm}
                defaultCarData={defaultCarData}
                element={waybillData}
              />
            )
        }
      </div>
    );
  },
);

const mapStateToProps = (state) => ({
  ...attributeList.reduce((newObj, attr) => {
    const { key } = attr;

    if (attr.carActualGpsNumberIndex) {
      newObj[key] = (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { [key]: null})[key];
    }

    return newObj;
  }, {}),
  status: state.monitorPage.carInfo.status,
  lastPoint: makeLastPointTrack(state.monitorPage.carInfo.trackCaching),
  errorInLoadTrack: state.monitorPage.carInfo.trackCaching.error,
  missionsAndWaybillsData: state.monitorPage.carInfo.missionsAndWaybillsData,
  asuods_id: (
    state.monitorPage.carActualGpsNumberIndex[
      state.monitorPage.carInfo.gps_code
    ] || { asuods_id: null }
  ).asuods_id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    fetchMissionsData: (props) => {
      return dispatch(
        fetchCarInfo(
          {
            asuods_id: props.asuods_id,
            gps_code: props.gps_code,
          },
          {
            page: 'mainpage',
          },
        ),
      );
    },
  };
};

export default compose<any>(
  withSearch, 
  connect<any, any, any, ReduxState>(
    mapStateToProps,
    mapDispatchToProps
  )
)(CarAttributeInformation);
