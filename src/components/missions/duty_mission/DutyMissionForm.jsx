import React from 'react';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';


import find from 'lodash/find';
import lodashIsEmpty from 'lodash/isEmpty';
import ModalBody from 'components/ui/Modal';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';
import Field from 'components/ui/Field';
import Div from 'components/ui/Div';
import { isEmpty } from 'utils/functions';
import { getKindTaskIds } from 'components/missions/utils/utils';
import Form from 'components/compositions/Form';
import InsideField from 'components/missions/duty_mission/inside_fields/index';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import { DivNone } from 'global-styled/global-styled';

import {
  FormTitle,
  makeRoutesForDutyMissionForm,
  getEmployeeFormDutyMission,
} from 'components/missions/duty_mission/utils';
import { components } from 'react-select';

import dutyMissionPermission from 'components/missions/duty_mission/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonSaveDutyMission = withRequirePermissionsNew({
  permissions: dutyMissionPermission.update,
})(Button);

const makePayloadFromState = (formState) => ({
  datetime: formState.plan_date_start,
  technical_operation_id: formState.technical_operation_id,
  municipal_facility_id: formState.municipal_facility_id,
  route_type: formState.route_type,
  needs_brigade: true,
  hasNotActiveEmployees: false,
});
const modalKey = 'duty_mission-form';

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

  multiValueContainerReander({ innerProps, ...props }) {
    const newInnerProps = {
      ...innerProps,
      className: `${innerProps.className}${typeof props.data.active === 'boolean' && !props.data.active ? ' red' : ''}`,
    };

    return <components.MultiValueContainer innerProps={newInnerProps} {...props} />;
  }

  handleRouteChange = (route_id) => {
    this.handleRouteIdChange(route_id);
  }

  handleRouteIdChange = async (route_id, fullRoute) => {
    this.handleChange('route_id', route_id);
    this.handleChange('norm_id', null);

    if (route_id) {
      const { flux } = this.context;
      let route = fullRoute;
      if (!route) {
        route = await flux.getActions('routes').getRouteById(route_id);
      }
      const payload = {
        ...makePayloadFromState(this.props.formState),
        route_type: route.type,
        kind_task_ids: this.state.kind_task_ids,
      };
      flux.getActions('missions').getCleaningOneNorm(payload)
        .then(normData => this.handleChange('norm_id', normData.norm_id));

      this.setState({ selectedRoute: route });
    } else {
      this.setState({ selectedRoute: null });
    }
  }

  handleChangeStructureId = (v) => {
    if (v !== this.props.formState.structure_id) {
      if (v) {
        const {
          formState: {
            foreman_id,
            brigade_employee_id_list,
          },
        } = this.props;

        const newBrigadeEmployeeIdList = brigade_employee_id_list.filter(id => (
          this.props.employeesIndex[id]
            ? !this.props.employeesIndex[id].company_structure_id || this.props.employeesIndex[id].company_structure_id === v
            : false
        ));
        const newForemanId = (
          this.props.employeesIndex[foreman_id]
            && (
              !this.props.employeesIndex[foreman_id].company_structure_id
              || this.props.employeesIndex[foreman_id].company_structure_id === v
            )
            ? foreman_id
            : null
        );

        this.handleChange('brigade_employee_id_list', newBrigadeEmployeeIdList);
        this.handleChange('foreman_id', newForemanId);
        if (!newForemanId) {
          this.handleChange('foreman_full_fio', null);
        }

        if (this.state.selectedRoute && v !== this.state.selectedRoute.structure_id) {
          this.handleRouteIdChange(null);
        }
      }

      this.handleChange('structure_id', v);
    }
  }

  handleTechnicalOperationChange = (v) => {
    if (Array.isArray(v) || !v) {
      return;
    }

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

  handleForemanIdChange = async (foreman_id) => {
    if (foreman_id !== this.props.formState.foreman_id) {
      if (foreman_id) {
        const lastBrigade = await this.context.flux.getActions('employees').getLastBrigade(foreman_id);

        this.handleBrigadeIdListChange(lastBrigade.map(({ id }) => id));
      }
      this.props.handleFormChange('foreman_id', foreman_id);
    }
  }

  // Можно принять второй параметр
  // Туда попадает вся опция
  // И не искать каждый раз всех
  handleBrigadeIdListChange = (v) => {
    this.props.handleFormChange('brigade_employee_id_list', v);
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
    const {
      currentUser: { company_id },
    } = this.props;

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

  createNewRouteNew = () => {
    const { formState } = this.props;

    this.setState({
      showRouteForm: true,
      selectedRoute: {
        is_main: true,
        name: '',
        municipal_facility_id: formState.municipal_facility_id,
        municipal_facility_name: '',
        technical_operation_id: formState.technical_operation_id,
        technical_operation_name: '',
        structure_id: formState.structure_id,
        structure_name: '',
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      },
    });
  }

  async changeRouteAfterSubmit(createdRouteId) {
    const { flux } = this.context;
    const routesActions = flux.getActions('routes');
    const {
      formState: {
        technical_operation_id,
        municipal_facility_id,
      },
    } = this.props;
    const { available_route_types = [] } = this.state;

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

    this.setState({
      showRouteForm: false,
      selectedRoute,
      routesList,
    });
  }

  onFormHide = async (isSubmitted, route) => {
    if (isSubmitted && route) {
      const createdRouteId = route.id;
      return this.changeRouteAfterSubmit(createdRouteId)
    }
    this.setState({
      showRouteForm: false,
      selectedRoute: null,
    });

    return Promise.resolve(true);
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
      missionsList = [],
      readOnly = false,
      fromOrder = false,
    } = this.props;
    const {
      TECH_OPERATIONS: [...TECH_OPERATIONS] = [],
      available_route_types = [],
      technicalOperationsList = [],
      selectedRoute: route = null,
      kind_task_ids,
    } = this.state;

    if (state.technical_operation_id && !TECH_OPERATIONS.some(({ value }) => value === state.technical_operation_id)) {
      TECH_OPERATIONS.push({ value: state.technical_operation_id, label: state.technical_operation_name });
    }

    const MISSION_SOURCES = missionSourcesList.reduce((newArr, { id, name, auto }) => {
      if (!auto || state.mission_source_id === id) {
        newArr.push({ value: id, label: name });
      }
      return newArr;
    }, []);

    const ROUTES = makeRoutesForDutyMissionForm(this.state, this.props);
    const {
      FOREMANS,
      BRIGADES,
      hasNotActiveEmployees,
    } = getEmployeeFormDutyMission(this.props);

    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => ({
      id,
      value: id,
      label: `№${number} (${technical_operation_name})`,
    }));

    const IS_CREATING = !state.number;
    const IS_CLOSING = state.status && state.status === 'assigned';
    const IS_COMPLETED = state.status && state.status === 'complete';
    const IS_CLOSED = state.status === 'complete' || state.status === 'fail' || state.status === 'canceled';

    const title = IS_CREATING
      ? (
        'Создание наряд-задания'
      )
      : (
        <FormTitle
          number={state.number || ''}
          status={state.status}
        />
      );

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

    const sourceIsOrder = !lodashIsEmpty(state.order_operation_id);

    const municipalFacilityIdDisabled = (
      IS_DISPLAY
      || !!state.route_id
      || readOnly
      || fromOrder
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
                id="technical-operation-id"
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
                value={state.brigade_employee_id_list}
                onChange={this.handleBrigadeIdListChange}
                multiValueContainerReander={this.multiValueContainerReander}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && (
            <Col md={3}>
              <Field
                id="structure-id"
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
                id="comment"
                modalKey={modalKey}
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
                id="route-id"
                modalKey={modalKey}
                type="select"
                modalKey={modalKey}
                label="Маршрут"
                error={errors.route_id}
                disabled={IS_DISPLAY || !state.municipal_facility_id || readOnly}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteChange}
              />
              <Div hidden={state.route_id}>
                <Button
                  id="dm-create-route"
                  onClick={this.createNewRouteNew}
                  disabled={IS_DISPLAY || !state.municipal_facility_id || readOnly}
                >
                  Создать новый
                </Button>
              </Div>
            </Col>
            <Col md={6}>
              {
                !this.state.showRouteForm && route && route.id !== null
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
          <Div className="inline-block" >
            <Button onClick={this.props.onPrint} disabled={!this.props.canSave || hasNotActiveEmployees}>
              <Glyphicon id="dm-download-all" glyph="download-alt" />
              {' '}
              {state.status !== 'not_assigned' ? 'Просмотр' : 'Выдать'}
            </Button>
            <ButtonSaveDutyMission id="dm-submit" onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || readOnly || hasNotActiveEmployees}>{'Сохранить'}</ButtonSaveDutyMission>
          </Div>
        </Modal.Footer>
        <RouteFormWrap
          element={route}
          showForm={this.state.showRouteForm}
          handleHide={this.onFormHide}
          hasMissionStructureId={!!state.structure_id}
          missionAvailableRouteTypes={available_route_types}
          fromMission
        />
      </Modal>
    );
  }
}

export default connectToStores(DutyMissionForm, ['objects', 'employees', 'missions', 'session']);
