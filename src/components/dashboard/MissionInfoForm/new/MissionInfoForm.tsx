import * as React from 'react';
import connectToStores from 'flummox/connect';
import {
  cloneDeep,
  keyBy,
}from 'lodash';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import WithState from 'components/compositions/vokinda-hoc/with-state/WithState';
import withClassMethods from 'components/compositions/vokinda-hoc/with-class-method/WithClassMethod';
import WithLifeCycle from 'components/compositions/vokinda-hoc/with-life-cycle/WithLifeCycle';
import { diffDates, secondsToTime } from 'utils/dates';

import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import MissionReportByODH from 'components/reports/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/mission/MissionReportByPoints.jsx';


const VALUE_FOR_FIXED = {
  TWO_F: {
    val: 2,
    list: [
      'кв. м.',
      'м.',
    ],
  },
  THREE_F: {
    val: 3,
    list: [
      'км',
    ],
  },
  floatFixed: (data, val) => parseFloat(data).toFixed(val),
};

const checkFixed = (data, key) => {
  const clone = [...data];

  if (VALUE_FOR_FIXED[key].list.includes(data[1])) {
    clone[0] = VALUE_FOR_FIXED.floatFixed(clone[0], VALUE_FOR_FIXED[key].val);
  }

  return clone;
};

const getDataTraveledYet = (data) => {
  if (data === null) {
    return 0;
  }
  if (Array.isArray(data)) {
    return data.join(' ');
  }

  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};

const MissionInfoForm: React.SFC<any> = props =>
    <Div hidden={!props.gov_number}>
      <Modal {...props} bsSize="large" className="mission-info-modal" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{`Информация о задании. Рег. номер ТС: ${props.gov_number}`}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={6} style={{ height: 400 }}> </Col>
            <Col md={6}>
              <Div hidden={props.tooLongDates}>
                <Div style={{ marginTop: -35 }} hidden={!(props.missionReport && props.missionReport.length > 0)}>
                  <Div hidden={props.routeType !== 'mixed'}>
                    <MissionReportByODH renderOnly enumerated={false} selectedReportDataODHS={props.missionReport} onElementChange={props.handleSelectedElementChange} selectField={'object_id'} />
                  </Div>
                  <Div hidden={props.routeType !== 'simple_dt'}>
                    <MissionReportByDT renderOnly enumerated={false} selectedReportDataDTS={props.missionReport} onElementChange={props.handleSelectedElementChange} selectField={'object_id'} />
                  </Div>
                  <Div hidden={props.routeType !== 'points'}>
                    <MissionReportByPoints renderOnly enumerated={false} selectedReportDataPoints={props.missionReport} />
                  </Div>
                </Div>
                <Div hidden={props.missionReport && props.missionReport.length > 0}>
                  <h5>Нет данных о прохождении задания</h5>
                </Div>
              </Div>
              <Div hidden={!props.tooLongDates}>
                <Col md={9} mdOffset={3}>
                  <span>{'Слишком большой период действия задания'}</span>
                </Col>
              </Div>
            </Col>
          </Row>

          <Div hidden={props.tooLongDates}>
            * - расстояние, учитываемое при прохождении задания<br />
            ** - пройдено с рабочей скоростью / пройдено с превышением рабочей скорости<br />
            <li><b>{'Пройдено с рабочей скоростью: '}</b>
              {props.withWorkSpeed}
            </li>
            <li><b>{'Пройдено с превышением рабочей скорости: '}</b>
              {props.withHightSpeed}
            </li>
            <li><b>Общее время стоянок:</b>
              {props.parkingCount ? secondsToTime(props.parkingCount) : 'Рассчитывается...'}
            </li>
            <li><b>{'Общий пробег с работающим оборудованием: '}</b>
              {`${props.sensor_traveled_working ? props.allRunWithWorkEquipment : 'Данные будут отображены после выполнения задания'}`}
            </li>
            <li><b>{'Процент выполнения задания, %: '}</b>
              {Math.floor(props.current_percentage) || '-'}
            </li>
          </Div>
        </ModalBody>
        <Modal.Footer>
          <Button onClick={props.handleFormChange} >{'Закрыть'}</Button>
        </Modal.Footer>
      </Modal>
    </Div>;


const all = connectToStores(hocAll(
  WithState({
    selectedElementId: null,
    selectedPoint: null,
    missionReport: [],
    selectedObjects: [],
    parkingCount: 0,
    tooLongDates: ({ formState: { mission_data } }) => diffDates(mission_data.date_end, mission_data.date_start, 'days') > 3,
    routeType: ({ formState: { route_data: { type: routeType } } }) => routeType,
    current_percentage: ({ formState: { mission_data: { current_percentage } } }) => current_percentage,
    polys: {},
    withWorkSpeed: ({ formState: { report_data }}) => getDataTraveledYet([
      ...checkFixed([report_data.traveled_raw, report_data.check_unit], 'TWO_F'),
      report_data.time_work_speed,
    ]),
    withHightSpeed: ({ formState: { report_data }}) => getDataTraveledYet([
      ...checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F'),
      report_data.time_high_speed,
    ]),
    sensor_traveled_working: ({ formState: { mission_data: { sensor_traveled_working } } }) => sensor_traveled_working,
    allRunWithWorkEquipment: ({ formState: { mission_data: { sensor_traveled_working } } }) => getDataTraveledYet(
      checkFixed([sensor_traveled_working / 1000, 'км'], 'THREE_F')
    ),
    gov_number: ({ formState: { car_data: { gov_number } }}) => gov_number,
  }),
  withClassMethods({
    handleSelectedElementChange: props => selectedElementId => props.setSelectedElementId({ selectedElementId }),
    handlePointChange: props => selectedPoint => props.setSelectedPoint({ selectedPoint }),
  }),
  WithLifeCycle({
    componentDidMount: async (props) => {
      const {
        formState: {
          mission_data,
          car_data,
          report_data,
          route_data,
        },
        flux,
      } = props;
  
      flux.getActions('objects').getTypes();
      await flux.getActions('objects').getCars();
      if (!props.tooLongDates) {
        flux.getActions('points').createConnection();
        flux.getActions('points').setSingleCarTrack(car_data.gov_number);
        flux.getActions('points').setSingleCarTrackDates([mission_data.date_start, mission_data.date_end]);
      }
  
      const [route] = await Promise.all([
        flux.getActions('routes').getRouteById(route_data.id, true),
        flux.getActions('geoObjects').getGeozones(),
      ]);
      const { geozonePolys = {} } = props;

      const { object_list = [] } = route;
      const polys = keyBy(
        cloneDeep(object_list)
        .map((object) => {
          if (geozonePolys[object.object_id] && route.type !== 'points') {
            object.shape = geozonePolys[object.object_id].shape;
          }
          return object;
        }),
        (o) => {
          if (route.type === 'points') {
            return o.coordinates.join(',');
          }
          return o.object_id;
        })

      const missionReport = report_data.entries || [];

      const selectedObjects = missionReport.filter(p => p.status === 'success');
      if (report_data.check_unit) {
        missionReport.forEach(report => (report.route_check_unit = report_data.check_unit));
      }

      console.log(props)
      props.multyChange({ missionReport, selectedObjects, route, polys });
    },
    componentWillReceiveProps: (props) => {
      const { track: { time_of_parking: parkingCount } } = props;
      if (parkingCount && parkingCount !== props.parkingCount) {
        props.setParkingCount(parkingCount);
      }
    },
    componentWillUnmount: (props) => {
      if (!props.tooLongDates) {
        props.flux.getActions('points').closeConnection();
        props.flux.getActions('points').setSingleCarTrack(null);
      }
    }
  })
)(MissionInfoForm), ['objects', 'employees', 'missions', 'routes', 'geoObjects']);


console.log

export default all;