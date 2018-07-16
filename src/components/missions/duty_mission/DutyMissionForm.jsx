import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import find from 'lodash/find';
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

  handleRouteIdChange = (v) => {
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

  handleChangeStructureId = (v) => {
    if (!v) {
      this.handleChange('brigade_employee_id_list', []);
      this.handleChange('foreman_id', null);
    } else if (this.state.selectedRoute && v !== this.state.selectedRoute.structure_id) {
      this.handleRouteIdChange(undefined);
    }

    this.handleChange('structure_id', v);
  }

  // Зачем тут таймаут?
  // В текущей версии react-select стоит снятие фокуса через 0.05 секунды
  // Но через 0.05 секунды он не может найти элемент и в консоль падает ошибка
  // С версии 2.0.15.00 используется другая версия react-select и там этой ошибки нет
  handleTechnicalOperationChange(v) {
    setTimeout(async () => {
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
    }, 60);
  }
  isActiveEmployee(id) {
    return this.props.employeesList
      .filter(employee => employee.active)
      .map(employee => employee.id)
      .indexOf(parseInt(id, 10)) !== -1;
  }

  handleForemanIdChange = async (foreman_id) => {
    if (!isEmpty(foreman_id) && !this.isActiveEmployee(foreman_id)) {
      onlyActiveEmployeeNotification();
      return;
    }

    if (!isEmpty(foreman_id)) {
      const lastBrigade = await this.context.flux.getActions('employees').getLastBrigade(foreman_id);
      this.props.handleFormChange('foreman_id', foreman_id);
      this.handleBrigadeIdListChange(lastBrigade.join(','));
    }
  }

  handleBrigadeIdListChange = (v) => {
    let brigade_employee_id_list = [];

    if (v) {
      let hasNotActive = false;
      brigade_employee_id_list = v.split(',').map(id => Number(id)).reduce((newArr, brigade_id) => {
        if (!this.isActiveEmployee(brigade_id)) {
          hasNotActive = true;
          return [...newArr];
        }
        return [
          ...newArr,
          this.props.employeesIndex[brigade_id],
        ];
      });

      if (hasNotActive) {
        onlyActiveEmployeeNotification();
      }
    }

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
      const isDisabledRouteField = (!!this.props.formState.status && this.props.formState.status !== 'not_assigned') ||
                                   !this.props.formState.technical_operation_id ||
                                   this.props.readOnly;

      if (isDisabledRouteField) {
        routesList = Array.of(selectedRoute);
      }
      if (!isDisabledRouteField) {
        routesList = await routesActions.getRoutesByDutyMissionId(mission.id, isTemplate);
        const findSelectedRoute_in_routesList = routesList.find(v => v.id === selectedRoute.id);
        if (!findSelectedRoute_in_routesList) {
          routesList.push(selectedRoute);
        }
      }
    }
    if (mission.technical_operation_id) {
      missionsActions.getMissions(mission.technical_operation_id);
    }
    missionsActions.getMissionSources();
    flux.getActions('employees').getEmployees();
    const technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsWithBrigades();

    this.setState({
      selectedRoute,
      technicalOperationsList,
      routesList,
    });
  }

  createNewRoute() {
    this.context.flux.getActions('geoObjects').getGeozones().then(() => {
      const newR = {
        name: '',
        polys: this.props.geozonePolys,
        technical_operation_id: this.props.formState.technical_operation_id,
        structure_id: this.props.formState.structure_id,
        object_list: [],
        input_lines: [],
      };
      this.setState({
        showRouteForm: true,
        selectedRoute: newR,
      });
    });
  }

  onFormHide = async (isSubmitted, result) => {
    const { flux } = this.context;
    const routesActions = flux.getActions('routes');

    const stateChangeObject = {};
    if (isSubmitted === true) {
      const createdRouteId = result.createdRoute.result[0].id;
      this.handleChange('route_id', createdRouteId);
      const selectedRoute = await routesActions.getRouteById(createdRouteId);
      const routesList = await routesActions.getRoutesByTechnicalOperation(this.props.formState.technical_operation_id);
      routesList.push(selectedRoute);
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

    if (!TECH_OPERATIONS.some(({ id }) => id === state.technical_operation_id)) {
      TECH_OPERATIONS.push({ value: state.technical_operation_id, label: state.technical_operation_name });
    }
    const MISSION_SOURCES = missionSourcesList.map(({ id, name }) => ({ value: id, label: name }));
    const ROUTES = routesList
        .filter(route => !state.structure_id || route.structure_id === state.structure_id)
        .map(({ id, name }) => ({ value: id, label: name }));

    const EMPLOYEES = employeesList.reduce((newArr, employee) => {
      if (employee.active) {
        return [
          ...newArr,
          {
            value: employee.id,
            label: `${employee.last_name || ''} ${employee.first_name || ''} ${employee.middle_name || ''}`,
          },
        ];
      }

      return [...newArr];
    }, []);

    const FOREMANS = [...EMPLOYEES];
    if (state.foreman_id && !FOREMANS.some(({ value }) => value === state.foreman_id)) {
      const employee = this.props.employeesIndex[state.foreman_id] || {};

      FOREMANS.push({
        value: state.foreman_id,
        label: `${employee.last_name || ''} ${employee.first_name || ''} ${employee.middle_name || ''} (Неактивный сотрудник)`,
      });
    }

    const BRIGADES = [...EMPLOYEES];
    state.brigade_employee_id_list.forEach(({ id, employee_id }) => {
      const key = id || employee_id;
      if (!BRIGADES.some(({ value }) => value === key)) {
        const employee = this.props.employeesIndex[state.foreman_id] || {};

        BRIGADES.push({
          value: key,
          label: `${employee.last_name || ''} ${employee.first_name || ''} ${employee.middle_name || ''} (Неактивный сотрудник)`,
        });
      }
    });

    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({
      id,
      value: id,
      label: `№${number} (${technical_operation_name})`,
    }));

    const IS_CREATING = !state.number;
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
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const brigade_employee_id_list = !state.brigade_employee_id_list
      ? []
      : state.brigade_employee_id_list.filter(b => b.id || b.employee_id).map(b => b.id || b.employee_id).join(',');

    return (
      <Modal {...this.props} id="modal-duty-mission" bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={6}>
              <Field
                id="dm-technical-operation-id"
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
                <Col md={12}>
                  <label>Время выполнения, планируемое:</label>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="datepicker-range">
                  <Div>
                    <Field
                      id="plan-date-start"
                      type="date"
                      label={false}
                      error={errors.plan_date_start}
                      date={state.plan_date_start}
                      disabled={IS_DISPLAY || readOnly}
                      onChange={this.handleChange.bind(this, 'plan_date_start')}
                    />
                  </Div>
                  <Div className="date-divider">—</Div>
                  <Div>
                    <Field
                      id="plan-date-end"
                      type="date"
                      label={false}
                      error={errors.plan_date_end}
                      date={state.plan_date_end}
                      disabled={IS_DISPLAY || readOnly}
                      min={state.plan_date_start}
                      onChange={this.handleChange.bind(this, 'plan_date_end')}
                    />
                  </Div>
                </Col>
              </Row>
              <Div hidden={!(IS_CLOSING || IS_COMPLETED)}>
                <Row>
                  <Col md={12}>
                    <label>Время выполнения, фактическое:</label>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="datepicker-range">
                    <Div>
                      <Field
                        id="fact-date-start"
                        type="date"
                        label={false}
                        error={errors.fact_date_start}
                        date={state.fact_date_start}
                        disabled={IS_CLOSED || readOnly}
                        onChange={this.handleChange.bind(this, 'fact_date_start')}
                      />
                    </Div>
                    <Div className="date-divider">—</Div>
                    <Div>
                      <Field
                        id="fact-date-end"
                        type="date"
                        label={false}
                        error={errors.fact_date_end}
                        date={state.fact_date_end}
                        min={state.fact_date_start}
                        disabled={IS_CLOSED || readOnly}
                        onChange={this.handleChange.bind(this, 'fact_date_end')}
                      />
                    </Div>
                  </Col>
                </Row>
              </Div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Field
                id="foreman-id"
                type="select"
                label="Бригадир"
                error={errors.foreman_id}
                disabled={IS_DISPLAY || readOnly}
                options={FOREMANS}
                value={state.foreman_id}
                onChange={this.handleForemanIdChange}
              />
            </Col>

            <Col md={STRUCTURE_FIELD_VIEW ? 3 : 6}>
              <Field
                id="brigade-employee-id-list"
                type="select"
                label="Бригада"
                error={errors.brigade_employee_id_list}
                multi
                disabled={IS_DISPLAY || readOnly}
                options={BRIGADES}
                value={brigade_employee_id_list}
                onChange={this.handleBrigadeIdListChange}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && <Col md={3}>
              <Field
                id="dm-structure-id"
                type="select"
                label="Подразделение"
                error={errors.structure_id}
                disabled={STRUCTURE_FIELD_READONLY || (!IS_CREATING && state.status !== 'not_assigned') || readOnly}
                clearable={STRUCTURE_FIELD_DELETABLE}
                options={STRUCTURES}
                emptyValue={null}
                value={state.structure_id}
                onChange={this.handleChangeStructureId}
              />
            </Col>}
          </Row>


          <Row>
            <Col md={state.order_number != null ? 3 : 6}>
              <Field
                id="mission-source-id"
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                disabled={IS_DISPLAY || readOnly}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
            </Col>
            {state.order_number != null && <Col md={3}>
              <Field
                id="order-number"
                type="string"
                label="Номер факсограммы"
                readOnly
                value={state.order_number}
              />
            </Col>}
            <Col md={6}>
              <Field
                id="dm-comment"
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
              <Field
                id="car-mission-id"
                type="select"
                label="Задание на ТС" error={errors.car_mission_id}
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
                id="dm-route-id"
                type="select"
                label="Маршрут"
                error={errors.route_id}
                disabled={IS_DISPLAY || !state.technical_operation_id || readOnly}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteIdChange}
              />
              <Div hidden={state.route_id}>
                <Button
                  id="dm-create-route"
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
              <Glyphicon id="dm-download-all" glyph="download-alt" /> {state.status !== 'not_assigned' ? 'Просмотр' : 'Выдать'}</Button>
            <Button id="dm-submit" onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || readOnly}>{'Сохранить'}</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap
          element={route}
          onFormHide={this.onFormHide}
          showForm={this.state.showRouteForm}
          structureId={state.structure_id}
          fromMission
        />
      </Modal>
    );
  }
}

export default connectToStores(DutyMissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
