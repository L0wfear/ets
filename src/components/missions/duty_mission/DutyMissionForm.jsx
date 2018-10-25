import React from 'react';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';


import find from 'lodash/find';
import uniqBy from 'lodash/uniqBy';
import lodashIsEmpty from 'lodash/isEmpty';
import ModalBody from 'components/ui/Modal';
import RouteFormWrap from 'components/route/form/RouteFormWrap';
import Field from 'components/ui/Field';
import Div from 'components/ui/Div';
import { isEmpty } from 'utils/functions';
import { getKindTaskIds, getPermittetEmployeeForBrigade } from 'components/missions/utils/utils';
import Form from 'components/compositions/Form';
import InsideField from 'components/missions/duty_mission/inside_fields/index';
import RouteInfo from 'components/route/route-info/RouteInfo';
import { DivNone } from 'global-styled/global-styled';

import { FormTitle, onlyActiveEmployeeNotification } from './utils';

const makePayloadFromState = formState => ({
  datetime: formState.plan_date_start,
  technical_operation_id: formState.technical_operation_id,
  municipal_facility_id: formState.municipal_facility_id,
  route_type: formState.route_type,
  needs_brigade: true,
  hasNotActiveEmployees: false,
});
const modalKey = 'duty_mission';

export class DutyMissionForm extends Form {
  constructor(props) {
    super(props);

    this.state = {
      selectedRoute: null,
      showRouteForm: false,
      routesList: [],
      available_route_types: [],
    };
  }

  handleRouteIdChange = (v) => {
    this.handleChange('route_id', v);
    this.handleChange('norm_id', null);

    if (v) {
      const { flux } = this.context;
      flux.getActions('routes').getRouteById(v).then((route) => {
        const payload = {
          ...makePayloadFromState(this.props.formState),
          route_type: route.type,
          kind_task_ids: this.state.kind_task_ids,
        };
        flux.getActions('missions').getCleaningOneNorm(payload)
          .then(normData => this.handleChange('norm_id', normData.norm_id));

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

  handleTechnicalOperationChange = (v) => {
    const {
      flux,
    } = this.context;

    this.handleChange('technical_operation_id', v);
    this.handleChange('municipal_facility_id', null);
    this.handleChange('norm_id', null);
    this.handleRouteIdChange(null);
    if (!isEmpty(this.props.formState.car_mission_id)) {
      this.handleChange('car_mission_id', 0);
    }
    flux.getActions('missions').getMissions(v);
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
      this.handleBrigadeIdListChange(lastBrigade);
    }

    this.props.handleFormChange('foreman_id', foreman_id);
  }

  // Можно принять второй параметр
  // Туда попадает вся опция
  // И не искать каждый раз всех
  handleBrigadeIdListChange = (v) => {
    let brigade_employee_id_list = [];
    if (v) {
      let hasNotActiveEmployees = false;
      brigade_employee_id_list = v.map(id => Number(id)).reduce((newArr, brigade_id) => {
        if (!this.isActiveEmployee(brigade_id)) {
          hasNotActiveEmployees = true;
          return [...newArr];
        }
        return [
          ...newArr,
          this.props.employeesIndex[brigade_id],
        ];
      }, []);

      if (hasNotActiveEmployees) {
        onlyActiveEmployeeNotification();
      }
    }
    this.props.handleFormChange('brigade_employee_id_list', brigade_employee_id_list);
  }

  async componentDidMount() {
    const mission = this.props.formState;
    const { flux } = this.context;
    const { id } = mission;
    let TECH_OPERATIONS = [];

    const technicalOperationsActions = flux.getActions('technicalOperation');
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions');
    const isTemplate = this.props.template || false;

    let kind_task_ids = null;
    let { selectedRoute } = this.state;
    let { routesList } = this.props;

    flux.getActions('geoObjects').getGeozones();

    if (!isEmpty(mission.route_id)) {
      selectedRoute = await routesActions.getRouteById(mission.route_id);
    }

    if (!isEmpty(mission.id)) {
      routesList = await routesActions.getRoutesByDutyMissionId(mission.id, isTemplate);
    }
    const {
      is_new,
      mission_source_id,
    } = mission;
    // const kind_task_ids = getKindTaskIds(id, this.props.fromOrder);

    if (mission.technical_operation_id) {
      missionsActions.getMissions(mission.technical_operation_id);
    }
    await missionsActions.getMissionSources();
    if (!isTemplate && this.props.missionSourcesList.find(({ auto }) => auto).id !== mission_source_id && !this.props.fromOrder) {
      kind_task_ids = getKindTaskIds(id, false);
    }

    flux.getActions('employees').getEmployees();
    const technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsWithBrigades({ kind_task_ids, for: 'duty_mission' });

    if (is_new) {
      TECH_OPERATIONS = technicalOperationsList.filter(({ is_new: is_new_to }) => !!is_new_to).map(({ id: value, name }) => ({ value, label: name }));
    } else {
      TECH_OPERATIONS = technicalOperationsList.map(({ id: value, name }) => ({ value, label: name }));
    }

    this.setState({
      kind_task_ids,
      selectedRoute,
      technicalOperationsList,
      TECH_OPERATIONS,
      routesList,
    });
  }

  createNewRoute() {
    const { formState } = this.props;
    this.context.flux.getActions('geoObjects').getGeozones().then(() => {
      const newR = {
        normatives: formState.normatives,
        name: '',
        technical_operation_id: formState.technical_operation_id,
        municipal_facility_id: formState.municipal_facility_id,
        structure_id: formState.structure_id,
        object_list: [],
        input_lines: [],
        is_main: true,
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
    const {
      formState: {
        technical_operation_id,
        municipal_facility_id,
      },
    } = this.props;
    const { available_route_types = [] } = this.state;

    const stateChangeObject = {};
    if (isSubmitted === true) {
      const createdRouteId = result.createdRoute.result[0].id;
      this.handleChange('route_id', createdRouteId);
      const [selectedRoute, routesList] = await Promise.all([
        routesActions.getRouteById(createdRouteId),
        routesActions.getRoutesBySomeData({
          municipal_facility_id,
          technical_operation_id,
          type: available_route_types.join(','),
        }),
      ]);

      const payload = {
        ...makePayloadFromState(this.props.formState),
        route_type: selectedRoute.type,
        kind_task_ids: this.state.kind_task_ids,
      };
      flux.getActions('missions').getCleaningOneNorm(payload)
        .then(normData => this.handleChange('norm_id', normData.norm_id));

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

  getDataByNormatives = async (normatives) => {
    const norm_ids = normatives.map(({ id }) => id).join(',');
    this.context.flux.getActions('technicalOperation').getTechOperationsByNormIds({ norm_ids, kind_task_ids: this.state.kind_task_ids })
      .then(({ result: normativesData }) => {
        const available_route_types = normativesData.reduce((newArr, { route_types }) => [...newArr, ...route_types], []);
        const { formState } = this.props;
        this.context.flux.getActions('routes').getRoutesBySomeData({
          municipal_facility_id: formState.municipal_facility_id,
          technical_operation_id: formState.technical_operation_id,
          type: available_route_types.join(','),
        })
          .then((routesList) => {
            this.setState({ routesList });
          });

        this.setState({ available_route_types, normatives });
      });
  }

  handleChangePDS = (plan_date_start) => {
    if (plan_date_start) {
      this.handleChange('plan_date_start', plan_date_start);
    }
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const {
      missionSourcesList = [],
      employeesList = [],
      missionsList = [],
      readOnly = false,
      fromOrder = false,
    } = this.props;
    const {
      TECH_OPERATIONS: [...TECH_OPERATIONS] = [],
      routesList = [],
      available_route_types = [],
      technicalOperationsList = [],
      selectedRoute: route = null,
      kind_task_ids,
    } = this.state;

    if (state.technical_operation_id && !TECH_OPERATIONS.find(({ value }) => value === state.technical_operation_id)) {
      TECH_OPERATIONS.push({ value: state.technical_operation_id, label: state.technical_operation_name });
    }

    const MISSION_SOURCES = missionSourcesList.reduce((newArr, { id, name, auto }) => {
      if (!auto || state.mission_source_id === id) {
        newArr.push({ value: id, label: name });
      }
      return newArr;
    }, []);

    const routes = routesList.filter(r => (!state.structure_id || r.structure_id === state.structure_id));

    const filteredRoutes = (
      route !== null
      && route.id !== undefined
      && routes.find(item => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = uniqBy(
      filteredRoutes.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );
    const EMPLOYEES = getPermittetEmployeeForBrigade(employeesList).reduce((newArr, employee) => {
      if (employee.active) {
        return [
          ...newArr,
          {
            value: employee.value,
            label: employee.label,
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
      if (key && !BRIGADES.some(({ value }) => value === key)) {
        const employee = this.props.employeesIndex[key] || {};

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

    const sourceIsOrder = !lodashIsEmpty(state.order_operation_id);

    const municipalFacilityIdDisabled = (
      IS_DISPLAY
      || !!state.route_id
      || readOnly
      || sourceIsOrder
    );

    const alreadyDefineNormId = (
      IS_DISPLAY
      || !!state.route_id
      || readOnly
      || sourceIsOrder
    );

    return (
      <Modal id="modal-duty-mission" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={6}>
              <Field
                id="dm-technical-operation-id"
                type="select"
                modalKey={modalKey}
                clearable={false}
                label="Технологическая операция"
                error={errors.technical_operation_id}
                disabled={IS_DISPLAY || !!state.route_id || readOnly || fromOrder || sourceIsOrder}
                options={TECH_OPERATIONS}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange}
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
                      error={errors.plan_date_start || errors.plan_date}
                      date={state.plan_date_start}
                      disabled={IS_DISPLAY || readOnly}
                      onChange={this.handleChangePDS}
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
            <Col md={12}>
              <InsideField.MunicipalFacility
                modalKey={modalKey}
                error={errors.municipal_facility_id}
                name={state.municipal_facility_name}
                value={state.municipal_facility_id}
                date_start={state.plan_date_start}
                technical_operation_id={state.technical_operation_id}
                norm_id={state.norm_id}
                clearable={false}
                disabled={municipalFacilityIdDisabled}
                alreadyDefineNormId={alreadyDefineNormId}
                handleChange={this.handleChange}
                getDataByNormatives={this.getDataByNormatives}
                technicalOperationsList={technicalOperationsList}
                kind_task_ids={kind_task_ids}
                getCleaningMunicipalFacilityList={this.context.flux.getActions('missions').getCleaningMunicipalFacilityList}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="foreman-id"
                type="select"
                modalKey={modalKey}
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
                modalKey={modalKey}
                label="Бригада"
                error={errors.brigade_employee_id_list}
                multi
                disabled={IS_DISPLAY || readOnly}
                options={BRIGADES}
                value={brigade_employee_id_list}
                onChange={this.handleBrigadeIdListChange}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && (
            <Col md={3}>
              <Field
                id="dm-structure-id"
                type="select"
                modalKey={modalKey}
                label="Подразделение"
                error={errors.structure_id}
                disabled={STRUCTURE_FIELD_READONLY || (!IS_CREATING && state.status !== 'not_assigned') || readOnly}
                clearable={STRUCTURE_FIELD_DELETABLE}
                options={STRUCTURES}
                emptyValue={null}
                value={state.structure_id}
                onChange={this.handleChangeStructureId}
              />
            </Col>
            )}
          </Row>


          <Row>
            <Col md={6}>
              <Field
                id="mission-source-id"
                type="select"
                modalKey={modalKey}
                label="Источник получения задания"
                error={errors.mission_source_id}
                disabled={IS_DISPLAY || readOnly || this.props.fromOrder || sourceIsOrder}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
              { IS_CREATING && !this.props.fromOrder && <span className="help-block-mission-source">Задания на основе централизованных заданий необходимо создавать во вкладке "НСИ"-"Реестр централизованных заданий".</span> }
            </Col>
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
            <Col md={6}>
              { !!state.order_number
                && (
                <Field
                  id="order-number"
                  type="string"
                  label="Номер централизованного задания"
                  readOnly
                  value={state.order_number}
                />
                )
              }
            </Col>
            <Col md={6}>
              <Field
                id="car-mission-id"
                type="select"
                modalKey={modalKey}
                label="Задание на ТС"
                error={errors.car_mission_id}
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
                modalKey={modalKey}
                label="Маршрут"
                error={errors.route_id}
                disabled={IS_DISPLAY || !state.municipal_facility_id || readOnly}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteIdChange}
              />
              <Div hidden={state.route_id}>
                <Button
                  id="dm-create-route"
                  onClick={this.createNewRoute.bind(this)}
                  disabled={IS_DISPLAY || !state.municipal_facility_id || readOnly}
                >
Создать новый
                </Button>
              </Div>
            </Col>
            <Col md={6}>
              {
                route && route.id !== null
                  ? (
                    <RouteInfo
                      route={route}
                      noRouteName
                      mapKey="mapDutyMissionFrom"
                    />
                  )
                  : (
                    <DivNone />
                  )
              }
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button onClick={this.props.onPrint} disabled={!this.props.canSave}>
              <Glyphicon id="dm-download-all" glyph="download-alt" />
              {' '}
              {state.status !== 'not_assigned' ? 'Просмотр' : 'Выдать'}
            </Button>
            <Button id="dm-submit" onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || readOnly}>Сохранить</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap
          element={route}
          onFormHide={this.onFormHide}
          showForm={this.state.showRouteForm}
          structureId={state.structure_id}
          available_route_types={available_route_types}
          fromMission
          notTemplate
        />
      </Modal>
    );
  }
}

export default connectToStores(DutyMissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
