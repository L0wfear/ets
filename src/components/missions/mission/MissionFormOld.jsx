import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import {
  uniqBy,
} from 'lodash';
import { FluxContext, connectToStores } from 'utils/decorators';

import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';
import Field from 'components/ui/Field.jsx';

import Div from 'components/ui/Div.jsx';

const getRoute = async (routesActions, { route_id, mission_id, isTemplate }) => {
  const selectedRoute = await routesActions.getRouteById(route_id, false);
  const routesList = await routesActions.getRoutesByMissionId(mission_id, isTemplate);

  return {
    selectedRoute,
    routesList,
  };
};

@connectToStores(['routes', 'objects'])
@FluxContext
class MissionFormOld extends React.Component {
  static get propTypes() {
    return {
      carsList: React.PropTypes.array,
      formState: React.PropTypes.object.isRequired,
      onHide: React.PropTypes.func.isRequired,
    };
  }

  state = {
    routesList: [],
    selectedRoute: null,
  }
  async componentDidMount() {
    const {
      template: isTemplate,
      formState: {
        id: mission_id,
        route_id,
      },
    } = this.props;
    const { flux } = this.context;

    const routesActions = flux.getActions('routes');

    flux.getActions('objects').getCars();

    getRoute(routesActions, { route_id, mission_id, isTemplate }).then(({ routesList, selectedRoute }) => this.setState({ routesList, selectedRoute }));
  }

  render() {
    const {
      formState: state,
      carsList = [],
    } = this.props;
    const {
      routesList = [],
    } = this.state;

    const title = `Задание № ${state.number || ''} ${state.status === 'fail' ? '(Не выполнено)' : ''}`;
    const routes = routesList.filter(r => (!state.structure_id || r.structure_id === state.structure_id));
    const CARS = carsList
    .filter(c => (!state.structure_id || c.is_common || c.company_structure_id === state.structure_id))
    .map(c => ({
      value: c.asuods_id,
      available: c.available,
      label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
      type_id: c.type_id,
    }));

    const ROUTES = uniqBy(
      routes.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );
    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={9}>
              <Field
                type="string"
                label="Технологическая операция"
                disabled
                value={state.technical_operation_name}
              />
            </Col>
            <Div hidden={!state.structure_name} >
              <Col md={3}>
                <Field
                  type="string"
                  label="Подразделение"
                  disabled
                  value={state.structure_name}
                />
              </Col>
            </Div>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                type="select"
                label="Транспортное средство"
                value={state.car_id}
                options={CARS}
                disabled
              />
            </Col>
            <Col md={3}>
              <span style={{ position: 'absolute', right: -7, top: 31, fontWeight: 400 }}>—</span>
              <Div>
                <Field
                  type="date"
                  label="Время выполнения:"
                  date={state.date_start}
                  disabled
                />
              </Div>
            </Col>
            <Col md={3}>
              <Div>
                <Field
                  type="date"
                  label=""
                  date={state.date_end}
                  disabled
                />
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Маршрут"
                disabled
                options={ROUTES}
                value={state.route_id}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Div hidden={this.state.selectedRoute ? this.state.selectedRoute.id == null : true} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Field
                type="number"
                label="Кол-во циклов"
                disabled
                value={state.passes_count}
              />
            </Col>
            <Col md={3}>
              <Field
                type="string"
                label="Источник получения задания"
                value={state.mission_source_name}
                disabled
              />
            </Col>
            <Div hidden={!state.order_number} >
              <Col md={2}>
                <Field
                  type="string"
                  label="Номер централизованного задания"
                  readOnly
                  value={state.order_number}
                />
              </Col>
            </Div>
            <Col md={state.order_number != null ? 4 : 6}>
              <Field
                type="string"
                label="Комментарий"
                value={state.comment}
                disabled
              />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer>
          <Button onClick={this.props.onHide}> Закрыть</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MissionFormOld;
