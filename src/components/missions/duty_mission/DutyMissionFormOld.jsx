import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import {
  uniqBy,
 } from 'lodash';
import { FluxContext, connectToStores } from 'utils/decorators';

import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';

import { FormTitle } from './utils';

const getRoute = async (routesActions, { route_id, mission_id, isTemplate }) => {
  const selectedRoute = await routesActions.getRouteById(route_id, false);
  const routesList = await routesActions.getRoutesByMissionId(mission_id, isTemplate);

  return {
    selectedRoute,
    routesList,
  };
};

@connectToStores(['employees', 'routes', 'objects'])
@FluxContext
class DutyMissionFormOld extends Form {
  static get propTypes() {
    return {
      employeesList: React.PropTypes.array,
      missionsList: React.PropTypes.array,
      formState: React.PropTypes.object.isRequired,
      onHide: React.PropTypes.func.isRequired,
    };
  }

  state = {
    routesList: [],
    selectedRoute: null,
  }

  componentDidMount() {
    const {
      template: isTemplate,
      formState: {
        id: mission_id,
        technical_operation_id,
        route_id,
      },
    } = this.props;
    const { flux } = this.context;

    const routesActions = flux.getActions('routes');

    flux.getActions('missions').getMissions(technical_operation_id);
    flux.getActions('employees').getEmployees({ 'active': true });

    getRoute(routesActions, { route_id, mission_id, isTemplate }).then(({ routesList, selectedRoute }) => this.setState({ routesList, selectedRoute }));
  }

  render() {
    const {
      formState: state,
      employeesList = [],
      missionsList = [],
    } = this.props;
    const {
      routesList = [],
    } = this.state;

    const ROUTES = uniqBy(
      routesList.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );
    const EMPLOYEES = employeesList.map(d => ({
      value: d.id,
      label: `${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''} ${!d.active ? '(Неактивный сотрудник)' : ''}`,
    }));
    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({
      id,
      value: id,
      label: `№${number} (${technical_operation_name})`,
    }));

    const IS_CLOSING = state.status && state.status === 'assigned';
    const IS_COMPLETED = state.status && state.status === 'complete';

    const title = (
      <FormTitle
        number={state.number || ''}
        status={state.status}
      />
    );

    const brigade_employee_id_list = !state.brigade_employee_id_list
      ? []
      : state.brigade_employee_id_list.filter(b => b.id || b.employee_id).map(b => b.id || b.employee_id).join(',');

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={6}>
              <Field
                type="select"
                label="Технологическая операция"
                value={state.technical_operation_name}
                disabled
              />
            </Col>
            <Col md={6}>
              <Row>
                <Col md={6}>
                  <span style={{ position: 'absolute', right: -7, top: 31, fontWeight: 400 }}>—</span>
                  <Div>
                    <Field
                      type="date"
                      label="Время выполнения, планируемое:"
                      date={state.plan_date_start}
                      disabled
                    />
                  </Div>
                </Col>
                <Col md={6}>
                  <Div>
                    <Field
                      type="date"
                      label=""
                      date={state.plan_date_end}
                      disabled
                    />
                  </Div>
                </Col>
                <Div hidden={!(IS_CLOSING || IS_COMPLETED)}>
                  <Col md={6}>
                    <span style={{ position: 'absolute', right: -7, top: 31, fontWeight: 400 }}>—</span>
                    <Div>
                      <Field
                        type="date"
                        label="Время выполнения, фактическое:"
                        date={state.fact_date_start}
                        disabled
                      />
                    </Div>
                  </Col>
                  <Col md={6}>
                    <Div>
                      <Field
                        type="date"
                        label=""
                        date={state.fact_date_end}
                        disabled
                      />
                    </Div>
                  </Col>
                </Div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                type="string"
                label="Бригадир"
                disabled
                value={state.foreman_fio}
              />
            </Col>
            <Col md={state.structure_name ? 3 : 6}>
              <Field
                type="select"
                label="Бригада"
                multi
                disabled
                options={EMPLOYEES}
                value={brigade_employee_id_list}
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
                label="Источник получения задания"
                disabled
                value={state.mission_source_name}
              />
            </Col>
            <Col md={6}>
              <Field
                type="string"
                label="Комментарий"
                value={state.comment}
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              { !!state.order_number &&
                <Field
                  type="string"
                  label="Номер централизованного задания"
                  readOnly
                  value={state.order_number}
                />
              }
            </Col>
            <Col md={6}>
              <Field
                type="select"
                label="Задание на ТС"
                disabled
                options={MISSIONS}
                value={state.car_mission_id}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                type="select"
                label="Маршрут"
                disabled
                options={ROUTES}
                value={state.route_id}
              />
            </Col>
            <Col md={6}>
              <Div hidden={this.state.selectedRoute ? this.state.selectedRoute.id == null : true} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
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

export default DutyMissionFormOld;
