import React from 'react';
import connectToStores from 'flummox/connect';
import { secondsToTime } from 'utils/dates';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import _ from 'lodash';
import HybridMap from 'components/map/HybridMap.jsx';
import FluxComponent from 'flummox/component';
import MissionReportByODH from 'components/reports/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/mission/MissionReportByPoints.jsx';
import Form from '../compositions/Form.jsx';

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
  if (typeof data === 'object') {
    return data.join(' ');
  }

  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};

@autobind
class MissionInfoForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      missionReport: [],
      selectedObjects: [],
      selectedElementId: null,
      selectedPoint: null,
      parkingCount: 0,
    };
  }

  async componentDidMount() {
    const { formState } = this.props;
    const {
      mission_data,
      car_data,
      report_data,
      route_data,
    } = formState;
    
    const { flux } = this.context;
    await flux.getActions('objects').getCars();
    flux.getActions('points').createConnection();
    flux.getActions('points').setSingleCarTrack(car_data.gov_number);
    flux.getActions('points').setSingleCarTrackDates([mission_data.date_start, mission_data.date_end]);
    await flux.getActions('geoObjects').getGeozones();
    const route = await flux.getActions('routes').getRouteById(route_data.id, true);
    let missionReport = report_data.entries;
    if (!missionReport) {
      missionReport = [];
    }
    const selectedObjects = missionReport.filter(p => p.status === 'success');
    if (report_data.check_unit) {
      _.each(missionReport, mr => (mr.route_check_unit = report_data.check_unit));
    }
    this.setState({ missionReport, selectedObjects, route });
    flux.getActions('objects').getTypes();
  }

  componentWillUnmount() {
    this.context.flux.getActions('points').closeConnection();
    this.context.flux.getActions('points').setSingleCarTrack(null);
  }

  handleSelectedElementChange(id) {
    this.setState({ selectedElementId: id });
  }

  handlePointChange(point) {
    this.setState({ selectedPoint: point });
  }

  componentWillReceiveProps(props) {
    if (props.track.time_of_parking && this.props.track.time_of_parking !== this.state.parkingCount) {
      this.setState({ parkingCount: props.track.time_of_parking });
    }
  }

  render() {
    const state = this.props.formState;
    const {
      car_data,
      report_data,
      route_data,
      technical_operation_data,
      mission_data: {
        current_percentage = null,
        sensor_traveled_working = null,
      },
    } = state;

    const routeType = route_data.type;
    const { route = {} } = this.state;
    const { geozonePolys = {} } = this.props;
    const { object_list = [], draw_object_list = [] } = route;
    const polys = _(_.cloneDeep(object_list))
      .map((object) => {
        if (geozonePolys[object.object_id] && route.type !== 'points') {
          object.shape = geozonePolys[object.object_id].shape;
        }
        return object;
      })
      .keyBy((o) => {
        if (route.type === 'points') {
          return o.coordinates.join(',');
        }
        return o.object_id;
      })
      .value();
    // Здесь попадались объекты с одинаковым id, поэтому некоторые объекты перетирались.
    draw_object_list.forEach((o, i) => {
      polys[`${o.object_id}_index_${i}`] = o;
    });
    if (!car_data.gov_number) return <div />;
    const title = `Информация о задании. Рег. номер ТС: ${car_data.gov_number}`;

    const traveled_rawAndCheck_unit = checkFixed([report_data.traveled_raw, report_data.check_unit], 'TWO_F');
    const traveled_high_speedCheck_unit = checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F');
    const sensor_traveled_workingAndCheck_unit = checkFixed([sensor_traveled_working / 1000, 'км'], 'THREE_F');

    return (
      <Modal {...this.props} bsSize="large" className="mission-info-modal" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={6} style={{ height: 400 }}>
              <FluxComponent
                connectToStores={{
                  points: store => ({
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

                <HybridMap
                  polys={polys}
                  routeCenter
                  maxSpeed={technical_operation_data.max_speed}
                  selectedObjects={this.state.selectedObjects}
                  selectedPoly={geozonePolys[this.state.selectedElementId]}
                  car_gov_number={car_data.gov_number}
                />

              </FluxComponent>
            </Col>

            <Col md={6}>
              <Div style={{ marginTop: -35 }} hidden={!(this.state.missionReport && this.state.missionReport.length > 0)}>
                <Div hidden={routeType !== 'mixed'}>
                  <MissionReportByODH renderOnly enumerated={false} selectedReportDataODHS={this.state.missionReport} onElementChange={this.handleSelectedElementChange} selectField={'object_id'} />
                </Div>
                <Div hidden={routeType !== 'simple_dt'}>
                  <MissionReportByDT renderOnly enumerated={false} selectedReportDataDTS={this.state.missionReport} onElementChange={this.handleSelectedElementChange} selectField={'object_id'} />
                </Div>
                <Div hidden={routeType !== 'points'}>
                  <MissionReportByPoints renderOnly enumerated={false} selectedReportDataPoints={this.state.missionReport} />
                </Div>
              </Div>
              <Div hidden={this.state.missionReport && this.state.missionReport.length > 0}>
                <h5>Нет данных о прохождении задания</h5>
              </Div>
            </Col>

          </Row>

          <Div>
            * - расстояние, учитываемое при прохождении задания<br />
            ** - пройдено с рабочей скоростью / пройдено с превышением рабочей скорости<br />
            <li><b>Пройдено с рабочей скоростью:</b>
              {getDataTraveledYet([...traveled_rawAndCheck_unit, report_data.time_work_speed])}
            </li>
            <li><b>Пройдено с превышением рабочей скорости:</b>
              {getDataTraveledYet([...traveled_high_speedCheck_unit, report_data.time_high_speed])}
            </li>
            <li><b>Общее время стоянок:</b>
              {this.state.parkingCount ? secondsToTime(this.state.parkingCount) : 'Рассчитывается...'}
            </li>
            <li><b>Общий пробег с работающим оборудованием:</b>
              {`${sensor_traveled_working ? getDataTraveledYet(sensor_traveled_workingAndCheck_unit) : 'Данные будут отображены после выполнения задания'}`}
            </li>
            <li><b>Процент выполнения заданияб %:</b>
              {Math.floor(current_percentage) || '-'}
            </li>
          </Div>

        </ModalBody>

        <Modal.Footer>
          <Div>
            <Button onClick={this.handleSubmit} >{'Закрыть'}</Button>
          </Div>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connectToStores(MissionInfoForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
