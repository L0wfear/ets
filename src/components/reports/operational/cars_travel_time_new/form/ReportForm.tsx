import * as React from 'react';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

import MapContainer from 'components/new/ui/mission_info_form/form-components/map-contaienr/MapContainer';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

import {
  actionGetAndSetInStoreCarsTravelTime,
  actionResetCarsTravelTime,
} from 'redux-main/reducers/modules/some_uniq/cars_travel_time/actions';

import {
  actionGetAndSetInStoreTracksCaching,
  actionResetTracksCaching,
} from 'redux-main/reducers/modules/some_uniq/tracks_caching/actions';

import { getSomeUniqState } from 'redux-main/reducers/selectors';

import { get } from 'lodash';
import DataTable from 'components/ui/table/DataTable';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReportFormRightWrapper } from 'components/reports/operational/cars_travel_time_new/styled';
import {
  CarsTravelTimeModalStateProps,
  CarsTravelTimeModalDispatchProps,
  PropsCarsTravelTimeModal,
  CarsTravelTimeModalOwnProps,
} from 'components/reports/operational/cars_travel_time_new/form/@types/CarsTravelTime.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';
// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

export const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Наименование объекта',
      type: 'string',
      cssClassName: 'width120',
      filter: false,
    },
    {
      name: 'type',
      displayName: 'Тип объекта',
      type: 'string',
      filter: false,
    },
    {
      name: 'distance',
      displayName: 'Дистанция, км',
      type: 'number',
      filter: false,
    },
    {
      name: 'time_by_objects',
      displayName: 'Время нахождения на объекте, ч.мин',
      type: 'string',
      filter: false,
    },
  ],
};

const CarsTravelTimeModal: React.FC<PropsCarsTravelTimeModal> = (props) => {

  const [geoobjects, setGeoobjects] = React.useState({});
  const [track, setTrack] = React.useState(null);
  const [selectedElement, setSelectedElement] = React.useState(null);

  const gov_number = get(props.selectedElement, 'gov_number', null);
  const gps_code = get(props.selectedElement, 'gps_code', null);
  const has_mkad = get(props.selectedElement, 'has_mkad', false);
  const type = '';
  const front_parkings = get(props.tracksCaching, 'front_parkings', []);
  const cars_sensors = get(props.tracksCaching, 'sensors', []);
  const distance_out_mission_text = `Дистанция не по объектам задания: ${get(props.selectedElement, 'distance_out_mission', null)} км.`;
  const travel_time_out_mission_text = `Время не по объектам задания: ${get(props.selectedElement, 'travel_time_out_mission', null)} ч.`;
  const modalTitle = `Детализация объектов, по которым двигалось ТС: ${gov_number}`;

  const setGeoobjectsValidValue = React.useCallback(() => {
    if (Object.values(props.carsTravelTimeList).length) {
      const typeLayer = 'any';
      const selectedFrontKey = `${typeLayer}/${get(selectedElement, 'id', null)}`;
      const newGeoobjects = props.carsTravelTimeList.reduce((newElem, currentElem) => {
        const front_key = `${typeLayer}/${currentElem.id}`;
        const { shape, type: someType, frontIsSelected, ...someElem } = currentElem;
        return {
          [front_key]: {
            shape: JSON.parse(shape),
            front_key,
            front_id: currentElem.id,
            object_id: currentElem.id,
            type: typeLayer,
            state: 2, // влияет на окраску одх/дт
            frontIsSelected: selectedFrontKey === front_key ? true : false, // выделение объекта на карте (заливка)
            ...someElem,
          },
          ...newElem,
        };
      }, {});
      setGeoobjects({
        [typeLayer]: {
          ...newGeoobjects,
        },
      });
    }
  }, [selectedElement, props.carsTravelTimeList]);

  React.useEffect( () => {
    const loadFunc = async () => {
      const page = 'cars_travel_time_new';
      const path = 'cars_travel_time_new';
      const {
        date_from,
        date_to,
      } = props;

      const car_id = get(props, 'selectedElement.car_id', null);

      let odh_mkad = {};
      if (has_mkad) {
        const { serverName } = GEOOBJECTS_OBJ.odh_mkad;

        const response = await props.loadGeozones(serverName)
          .then(({ payload: geozones }) => {
            odh_mkad = get(geozones, 'odh_mkad', {});
          });

        odh_mkad = get(response, 'payload.odh_mkad', {});
      }

      props.actionGetAndSetInStoreTracksCaching({
        date_start: date_from,
        date_end: date_to,
        car_id,
        gps_code,
        odh_mkad,
        sensors: 0,
      }, { page, path });

      props.actionGetAndSetInStoreCarsTravelTime({
        date_from,
        date_to,
        car_id,
      }, { page, path });
    };

    loadFunc();

    return () => {
      props.actionResetCarsTravelTime();
      props.actionResetTracksCaching();
    };
  }, []);

  React.useEffect(() => {
    setGeoobjectsValidValue();
  }, [props.carsTravelTimeList]);

  React.useEffect(() => {
    setTrack(get(props.tracksCaching, 'track', null));
  }, [props.tracksCaching]);

  const handleSelectedElementChange = React.useCallback((selectedRow) => {
    const selectedRowElement = get(selectedRow, 'props.data', null);
    setSelectedElement(selectedRowElement);
  }, [geoobjects]);

  React.useEffect(() => { // для перевода фокуса на объект ОДХ/ДТ
    setGeoobjectsValidValue();
  }, [selectedElement]);

  return (
    <EtsBootstrap.ModalContainer id="modal-geoobjects-map" show onHide={props.onFormHide} bsSize="large" backdrop="static">
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{modalTitle}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <MapContainer
                gov_number={gov_number}
                gps_code={gps_code}
                track={track}
                geoobjects={geoobjects}
                inputLines={[]} //
                front_parkings={front_parkings}
                speed_limits={{mkad_speed_lim: 60, speed_lim: 60}}
                cars_sensors={cars_sensors} //
                missionNumber={777} //
                has_mkad={has_mkad}
                object_type_name={type}
              />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ReportFormRightWrapper>
              {
                props.carsTravelTimeList.length ?
                  (
                    <Table
                      noTitle={true}
                      noFilter
                      results={props.carsTravelTimeList}
                      enumerated={false}
                      tableMeta={tableMeta}
                      className="report-time-table"
                      onRowSelected={handleSelectedElementChange}
                      selected={selectedElement}
                    />
                  ) : (
                    <div>У данной ТС за выбранный промежуток времени заданий по ОДХ / ДТ не было</div>
                  )
              }
            </ReportFormRightWrapper>
            <b>{distance_out_mission_text} <br/>
            {travel_time_out_mission_text}</b>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
    </EtsBootstrap.ModalContainer>
  );

};

export default connect<CarsTravelTimeModalStateProps, CarsTravelTimeModalDispatchProps, CarsTravelTimeModalOwnProps, ReduxState>(
  (state) => ({
    carsTravelTimeList: getSomeUniqState(state)
      .carsTravelTimeList,
    tracksCaching: getSomeUniqState(state)
      .tracksCaching,
    company_id: getSessionState(state).userData.company_id,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreCarsTravelTime: (...arg) => (
      dispatch(
        actionGetAndSetInStoreCarsTravelTime(...arg),
      )
    ),
    actionResetCarsTravelTime: () => (
      dispatch(
        actionResetCarsTravelTime(),
      )
    ),
    actionGetAndSetInStoreTracksCaching: (...arg) => (
      dispatch(
        actionGetAndSetInStoreTracksCaching(...arg),
      )
    ),
    actionResetTracksCaching: () => (
      dispatch(
        actionResetTracksCaching(),
      )
    ),
    loadGeozones: (serverName, company_id) =>
      dispatch(
        loadGeozones(
          'none',
          serverName,
          {
            promise: true,
            page: 'any',
            path: 'missionInfoForm',
          },
          company_id,
        ),
      ),
  }),
)(CarsTravelTimeModal);
