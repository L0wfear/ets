import * as React from 'react';
import connectToStores from 'flummox/connect';
import * as _ from 'lodash';
import {
  componentDidMount,
  componentWillReceiveProps,
  componentWillUnmount,
  handleSelectedElementChange,
  initialState,
} from 'components/dashboard/MissionInfoForm/new/utils';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import WithState from 'components/compositions/vokinda-hoc/with-state/WithState';
import withClassMethods from 'components/compositions/vokinda-hoc/with-class-method/WithClassMethod';
import WithLifeCycle from 'components/compositions/vokinda-hoc/with-life-cycle/WithLifeCycle';
import { secondsToTime } from 'utils/dates';
import HybridMap from 'components/map/HybridMap.jsx';
import FluxComponent from 'flummox/component';

import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import MissionReportByODH from 'components/reports/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/mission/MissionReportByPoints.jsx';

const HybridMapTSX: any = HybridMap;


const MissionInfoForm: React.SFC<any> = props => {
  const {
    route: {
      object_list = [],
      type,
    },
    geozonePolys = {},
  } = props;
  const polys = _(_.cloneDeep(object_list))
    .map((object) => {
      if (geozonePolys[object.object_id] && type !== 'points') {
        object.shape = geozonePolys[object.object_id].shape;
      }
      return object;
    })
    .keyBy((o) => {
      if (type === 'points') {
        return o.coordinates.join(',');
      }
      return o.object_id;
    })
    .value();

  return (
    <Div hidden={!props.gov_number}>
      <Modal {...props} id="modal-mission-info" bsSize="large" className="mission-info-modal" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{`Информация о задании. Рег. номер ТС: ${props.gov_number}`}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={6} style={{ height: 400 }}>
              <FluxComponent
                connectToStores={{
                  pointsHybrid: store => ({
                    points: store.state.points,
                    selected: store.getSelectedPoint(),
                  }),
                  settings: store => ({
                    showPlates: store.state.showPlates,
                    showTrack: store.state.showTrack,
                    showPolygons: store.state.showPolygons,
                    showSelectedElement: store.state.showSelectedElement,
                  }),
                  session: store => ({
                    zoom: store.getCurrentUser().getCompanyMapConfig().zoom,
                    center: store.getCurrentUser().getCompanyMapConfig().coordinates,
                  }),
                }}
              >
                <HybridMapTSX
                  polys={polys}
                  routeCenter
                  mkad_speed_lim={props.mkad_speed_lim}
                  speed_lim={props.speed_lim}
                  has_mkad={props.has_mkad}
                  selectedObjects={props.selectedObjects}
                  selectedPoly={props.selectedPoly}
                  car_gov_number={props.gov_number}
                  object_type_name={props.object_type_name}
                />
              </FluxComponent>
            </Col>
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
          <Div className="listStyleTypeNone" hidden={props.tooLongDates}>
            * - расстояние, учитываемое при прохождении задания<br />
            ** - пройдено с рабочей скоростью / пройдено с превышением рабочей скорости<br />
            <li className="colorGreen" ><b>{'Пройдено с рабочей скоростью: '}</b>
              {props.withWorkSpeed}
            </li>
            <li className="colorRed" ><b>{'Пройдено с превышением рабочей скорости: '}</b>
              {props.withHightSpeed}
            </li>
            <li><b>Общее время стоянок:</b>
              {props.parkingCount !== -1 ? secondsToTime(props.parkingCount) : 'Рассчитывается...'}
            </li>
            <li><b>{'Общий пробег с работающим оборудованием: '}</b>
              {`${props.sensor_traveled_working !== null ? props.allRunWithWorkEquipment : 'Нет данных'}`}
            </li>
            <li><b>{'Процент выполнения задания, %: '}</b>
              {props.traveled_percentage || '-'}
            </li>
          </Div>
        </ModalBody>
        <Modal.Footer>
          <Button onClick={props.onHide} >{'Закрыть'}</Button>
        </Modal.Footer>
      </Modal>
    </Div>
  )
}


const all = connectToStores(hocAll(
  WithState({
    ...initialState,
  }),
  withClassMethods({
    handleSelectedElementChange,
  }),
  WithLifeCycle({
    componentDidMount,
    componentWillReceiveProps,
    componentWillUnmount,
  })
)(MissionInfoForm), ['objects', 'employees', 'missions', 'routes', 'geoObjects']);

export default all;