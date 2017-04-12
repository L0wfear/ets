import React from 'react';
import connectToStores from 'flummox/connect';
import { connectToStores as connect } from 'utils/decorators';
import { secondsToTime } from 'utils/dates';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import _ from 'lodash';
import HybridMap from 'components/map/HybridMap.jsx';
import Preloader from 'components/ui/Preloader.jsx';
import FluxComponent from 'flummox/component';
import MissionReportByODH from 'components/reports/mission/MissionReportByODH.jsx';
import MissionReportByDT from 'components/reports/mission/MissionReportByDT.jsx';
import MissionReportByPoints from 'components/reports/mission/MissionReportByPoints.jsx';
import Form from '../compositions/Form.jsx';

const getDataTraveledYet = (data) => {
  if (typeof data === 'string') {
    return data;
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
    const { mission_data, car_data, report_data, route_data } = formState;
    const { flux } = this.context;
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
    flux.getActions('objects').getCars();
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
    const { car_data, report_data, route_data,
      technical_operation_data } = state;
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
    draw_object_list.forEach((o) => {
      polys[o.object_id] = o;
    });
    if (!car_data.gov_number) return <div />;
    const title = `Информация о задании. Рег. номер ТС: ${car_data.gov_number}`;
    const { equipmentData } = this.props;
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
            <li><b>Пройдено с рабочей скоростью:</b> {getDataTraveledYet([report_data.traveled_raw, report_data.check_unit, report_data.time_work_speed].join(' '))}</li>
            <li><b>Пройдено с превышением рабочей скорости:</b> {getDataTraveledYet([report_data.traveled_high_speed, report_data.check_unit, report_data.time_high_speed].join(' '))}</li>
            <li><b>Общее время стоянок:</b> {this.state.parkingCount ? secondsToTime(this.state.parkingCount) : 'Рассчитывается...'}</li>
            <li><b>Общий пробег с работающим оборудованием:</b> {equipmentData == null ? <Preloader type="field" /> : `${parseFloat(equipmentData / 1000).toFixed(3)} км`}</li>
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
