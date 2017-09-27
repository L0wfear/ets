import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import last from 'lodash/last';

import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form.jsx';

import { FormTitle, onlyActiveEmployeeNotification } from './utils';

export class DutyMissionForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      selectedRoute: null,
      showRouteForm: false,
      routesList: [],
    };
  }

  handleRouteIdChange(v) {
    this.handleChange('route_id', v);
    const { flux } = this.context;
    if (v) {
      flux.getActions('routes').getRouteById(v).then((route) => {
        this.setState({ selectedRoute: route });
      });
    } else {
      this.setState({ selectedRoute: null });
    }
  }

  async handleTechnicalOperationChange(v) {
    this.handleChange('technical_operation_id', v);
    this.handleChange('route_id', undefined);
    if (!isEmpty(this.props.formState.car_mission_id)) {
      this.handleChange('car_mission_id', 0);
    }
    this.context.flux.getActions('missions').getMissions(v);

    const routesList = await this.context.flux.getActions('routes')
      .getRoutesByTechnicalOperation(v);
    if (routesList.length === 1) {
      this.handleRouteIdChange(routesList[0].id);
    }

    this.setState({ routesList });
  }
  isActiveEmployee(id) {
    return this.props.employeesList
      .filter(employee => employee.active)
      .map(employee => employee.id)
      .indexOf(parseInt(id, 10)) !== -1;
  }

  handleForemanIdChange = (foreman_id) => {
    let value = foreman_id;

    if (value !== '' && !this.isActiveEmployee(value)) {
      onlyActiveEmployeeNotification();
      value = this.props.formState.foreman_id;
    }
    this.props.handleFormChange('foreman_id', value);
  }

  handleBrigadeIdListChange(v) {
    const data = v.split(',');
    const lastEmployee = last(data);

    if (lastEmployee !== '' && !this.isActiveEmployee(lastEmployee)) {
      onlyActiveEmployeeNotification();
      data.pop();
    }

    const { employeesList = [] } = this.props;
    const brigade_employee_id_list = employeesList.filter(e => data.indexOf(e.id.toString()) > -1);
    this.props.handleFormChange('brigade_employee_id_list', brigade_employee_id_list);
  }

  async componentDidMount() {
    const mission = this.props.formState;
    const { flux } = this.context;
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions');
    const isTemplate = this.props.template || false;

    let { selectedRoute } = this.state;
    let { routesList } = this.props;

    if (!isEmpty(mission.route_id)) {
      selectedRoute = await routesActions.getRouteById(mission.route_id);
    }

    if (!isEmpty(mission.technical_operation_id)) {
      routesList = await routesActions.getRoutesByDutyMissionId(mission.id, isTemplate);
    }

    missionsActions.getMissions(mission.technical_operation_id);
    missionsActions.getMissionSources();
    flux.getActions('employees').getEmployees({ 'active': true });
    const technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsWithBrigades();
    this.setState({
      selectedRoute,
      technicalOperationsList,
      routesList,
    });
  }

  createNewRoute() {
    this.context.flux.getActions('geoObjects').getGeozones().then((v) => {
      const newR = {
        name: '',
        polys: this.props.geozonePolys,
        technical_operation_id: this.props.formState.technical_operation_id,
        structure_id: this.props.formState.structure_id,
        object_list: [],
      };
      this.setState({
        showRouteForm: true,
        selectedRoute: newR,
      });
    });
  }

  async onFormHide(isSubmitted, result) {
    const { flux } = this.context;
    const routesActions = flux.getActions('routes');

    const stateChangeObject = {};
    if (isSubmitted === true) {
      const createdRouteId = result.createdRoute.result[0].id;
      this.handleChange('route_id', createdRouteId);
      const selectedRoute = await routesActions.getRouteById(createdRouteId);
      const routesList = await routesActions.getRoutesByTechnicalOperation(this.props.formState.technical_operation_id);
      Object.assign(stateChangeObject, {
        showRouteForm: false,
        selectedRoute,
        routesList,
      });
    } else {
      Object.assign(stateChangeObject, {
        showRouteForm: false,
        selectedRoute: null,
      });
    }

    this.setState(stateChangeObject);
  }

  componentWillReceiveProps(props) {
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const {
      missionSourcesList = [],
      employeesList = [],
      missionsList = [],
      readOnly = false,
    } = this.props;
    const {
      technicalOperationsList = [],
      routesList = [],
    } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const MISSION_SOURCES = missionSourcesList.map(({ id, name }) => ({ value: id, label: name }));
    const ROUTES = routesList.map(({ id, name }) => ({ value: id, label: name }));
    const EMPLOYEES = employeesList.map(d => ({
      value: d.id,
      label: `${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''} ${!d.active ? '(Неактивный сотрудник)' : ''}`,
    }));
    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({
      id,
      value: id,
      label: `№${number} (${technical_operation_name})`,
    }));

    const IS_CREATING = !!!state.number;
    const IS_CLOSING = state.status && state.status === 'assigned';
    const IS_COMPLETED = state.status && state.status === 'complete';
    const IS_CLOSED = state.status === 'complete' || state.status === 'fail';

    let title = (
      <FormTitle
        number={state.number || ''}
        status={state.status}
      />
    );

    if (IS_CREATING) {
      title = 'Создание наряд-задания';
    }

    const route = this.state.selectedRoute;
    const IS_DISPLAY = !!state.status && state.status !== 'not_assigned';

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;

    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && _.find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

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
                error={errors.technical_operation_id}
                disabled={IS_DISPLAY || !!state.route_id || readOnly}
                options={TECH_OPERATIONS}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange.bind(this)}
              />
            </Col>

            <Col md={6}>
              <Row>
                <Col md={6}>
                  <label style={{ position: 'absolute', right: -7, top: 31, fontWeight: 400 }}>—</label>
                  <Div>
                    <Field
                      type="date"
                      label="Время выполнения, планируемое:"
                      error={errors.plan_date_start}
                      date={state.plan_date_start}
                      disabled={IS_DISPLAY || readOnly}
                      onChange={this.handleChange.bind(this, 'plan_date_start')}
                    />
                  </Div>
                </Col>
                <Col md={6}>
                  <Div>
                    <Field
                      type="date"
                      label=""
                      error={errors.plan_date_end}
                      date={state.plan_date_end}
                      disabled={IS_DISPLAY || readOnly}
                      min={state.plan_date_start}
                      onChange={this.handleChange.bind(this, 'plan_date_end')}
                    />
                  </Div>
                </Col>

                <Div hidden={!(IS_CLOSING || IS_COMPLETED)}>
                  <Col md={6}>
                    <label style={{ position: 'absolute', right: -7, top: 31, fontWeight: 400 }}>—</label>
                    <Div>
                      <Field
                        type="date"
                        label="Время выполнения, фактическое:"
                        error={errors.fact_date_start}
                        date={state.fact_date_start}
                        disabled={IS_CLOSED || readOnly}
                        onChange={this.handleChange.bind(this, 'fact_date_start')}
                      />
                    </Div>
                  </Col>
                  <Col md={6}>
                    <Div>
                      <Field
                        type="date"
                        label=""
                        error={errors.fact_date_end}
                        date={state.fact_date_end}
                        min={state.fact_date_start}
                        disabled={IS_CLOSED || readOnly}
                        onChange={this.handleChange.bind(this, 'fact_date_end')}
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
                type="select"
                label="Бригадир"
                error={errors.foreman_id}
                disabled={IS_DISPLAY || readOnly}
                options={EMPLOYEES}
                value={state.foreman_id}
                onChange={this.handleForemanIdChange}
              />
            </Col>

            <Col md={STRUCTURE_FIELD_VIEW ? 3 : 6}>
              <Field type="select" label="Бригада" error={errors.brigade_employee_id_list}
                multi
                disabled={IS_DISPLAY || readOnly}
                options={EMPLOYEES}
                value={brigade_employee_id_list}
                onChange={this.handleBrigadeIdListChange.bind(this)}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && <Col md={3}>
              <Field type="select"
                label="Подразделение"
                error={errors.structure_id}
                disabled={STRUCTURE_FIELD_READONLY || (!IS_CREATING && state.status !== 'not_assigned') || readOnly}
                clearable={STRUCTURE_FIELD_DELETABLE}
                options={STRUCTURES}
                emptyValue={null}
                value={state.structure_id}
                onChange={this.handleChange.bind(this, 'structure_id')}
              />
            </Col>}
          </Row>


          <Row>
            <Col md={state.order_number != null ? 3 : 6}>
              <Field type="select" label="Источник получения задания" error={errors.mission_source_id}
                disabled={IS_DISPLAY || readOnly}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
              { IS_CREATING && <span style={{ opacity: 0.5 }}>{'Задания на основе факсограмм необходимо создавать во вкладке "НСИ"-"Реестр факсограмм".'}</span> }
            </Col>
            {state.order_number != null && <Col md={3}>
              <Field
                type="string"
                label="Номер факсограммы"
                readOnly
                value={state.order_number}
              />
            </Col>}
            <Col md={6}>
              <Field
                type="string"
                label="Комментарий"
                value={state.comment}
                disabled={readOnly}
                onChange={this.handleChange.bind(this, 'comment')}
                error={errors.comment}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} />
            <Col md={6}>
              <Field type="select" label="Задание на ТС" error={errors.car_mission_id}
                disabled={IS_DISPLAY || readOnly}
                options={MISSIONS}
                value={state.car_mission_id}
                onChange={this.handleChange.bind(this, 'car_mission_id')}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Field
                type="select"
                label="Маршрут"
                error={errors.route_id}
                disabled={IS_DISPLAY || !state.technical_operation_id || readOnly}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteIdChange.bind(this)}
              />
              <Div hidden={state.route_id}>
                <Button
                  onClick={this.createNewRoute.bind(this)}
                  disabled={IS_DISPLAY || !state.technical_operation_id || readOnly}
                >Создать новый</Button>
              </Div>
            </Col>
            <Col md={6}>
              <Div hidden={route ? route.id == null : true} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block" >
            <Button onClick={this.props.onPrint} disabled={!this.props.canSave}>
              <Glyphicon glyph="download-alt" /> {state.status !== 'not_assigned' ? 'Просмотр' : 'Выдать'}</Button>
            <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || readOnly}>{'Сохранить'}</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap
          element={route}
          onFormHide={this.onFormHide.bind(this)}
          showForm={this.state.showRouteForm}
          structureId={state.structure_id}
          fromMission
        />
      </Modal>
    );
  }
}

export default connectToStores(DutyMissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
