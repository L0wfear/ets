import React from 'react';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  uniqBy,
  isEmpty as lodashIsEmpty,
  get,
} from 'lodash';

import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import { DivNone } from 'global-styled/global-styled';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';

import Field from 'components/ui/Field';

import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import Div, { ExtDiv } from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form';
import InsideField from 'components/missions/mission/inside_fields/index';
import { routeTypesByKey } from 'constants/route';

import { addTime, diffDates } from 'utils/dates';
import {
  getDataByNormatives,
  getDataBySelectedRoute,
  getRoutesByMissionId,
  getTechnicalOperationData,
  handleRouteFormHide,
  isOdhRouteTypePermitted,
  makeCarOptionLabel,
  makePayloadFromState,
} from 'components/missions/mission/MissionForm/utils';
import { AvailableRouteTypes } from 'components/missions/mission/MissionForm/types';

import ColumnAssignment from 'components/missions/mission/MissionForm/ColumnAssignment';

import HiddenMapForPrint from 'components/missions/mission/MissionForm/print/HiddenMapForPrint';
import missionPermission from 'components/missions/mission/config-data/permissions';
import { isArray } from 'util';
import { DropdownDateEnd, TimeDevider, DropdownDateEndCol } from 'components/missions/mission/MissionForm/styled';

const ButtonSaveMission = withRequirePermissionsNew({
  permissions: missionPermission.update,
})(Button);

const modalKey = 'mission';

const ASSIGN_OPTIONS = [
  { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
  { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
  { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
];

export class MissionForm extends Form {
  constructor(props) {
    super(props);

    this.state = {
      available_route_types: [],
      selectedRoute: null,
      showRouteForm: false,
      carsList: [],
      routesList: [],
      technicalOperationsList: [],
      columnPermittedTechOps: [],
      showColumnAssignment: false,
      firstFormState: {
        ...this.props.formState,
      },
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    const technicalOperationsActions = flux.getActions('technicalOperation').getTechnicalOperations;
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions').getMissionSources;

    const { formState } = this.props;

    Promise.all([
      getTechnicalOperationData(formState, this.props.template, this.props.fromOrder, this.props.withDefineCarId, missionsActions, technicalOperationsActions),
      getDataBySelectedRoute(formState, routesActions.getRouteById),
      getRoutesByMissionId(formState, this.props.template, routesActions.getRoutesByMissionId, this.props.routesList),
    ])
      .then(([technicalOperationsData, selectedRoute, routesList]) => this.setState({
        ...technicalOperationsData,
        selectedRoute,
        routesList,
        carsList: this.props.carsList,
      }));
  }

  handleRouteChange = (route_id) => {
    this.handleRouteIdChange(route_id);
  }

  handleRouteIdChange = async (route_id, fullRoute) => {
    const changesObj = {
      route_id,
    };

    if (!this.props.fromOrder) {
      if (this.props.formState.is_column) {
        changesObj.is_cleaning_norm = this.props.formState.car_id.map(() => false);
        changesObj.norm_id = this.props.formState.car_id.map(() => null);
      } else if (!this.props.withDefineCarId) {
        changesObj.is_cleaning_norm = false;
        changesObj.norm_id = null;
      }
    }

    const { flux } = this.context;
    if (route_id) {
      let route = null;
      if (fullRoute) {
        route = fullRoute;
      } else {
        route = await flux.getActions('routes').getRouteById(route_id, false);
      }
      const { formState } = this.props;

      let ans = null;
      if (formState.is_column) {
        ans = await Promise.all(
          formState.type_id.map(type_id => (
            flux.getActions('missions').getCleaningOneNorm({
              ...makePayloadFromState(formState, type_id),
              route_type: route.type,
              kind_task_ids: this.state.kind_task_ids,
            })
          )),
        );
      } else {
        ans = await flux.getActions('missions').getCleaningOneNorm({
          ...makePayloadFromState(formState),
          route_type: route.type,
          kind_task_ids: this.state.kind_task_ids,
        }).then(Array);
      }
      const changesObjSecond = ans.reduce((newObj, normData) => ({
        norm_id: [...newObj.norm_id, normData.norm_id],
        is_cleaning_norm: [...newObj.is_cleaning_norm, normData.is_cleaning_norm],
      }), { norm_id: [], is_cleaning_norm: [] });

      if (changesObjSecond.is_cleaning_norm.some(value => value)) {
        const { formState: { date_start, date_end } } = this.props;

        if (date_start && date_end) {
          const { time } = routeTypesByKey[route.type];

          if (diffDates(date_end, date_start, 'hours') > time) {
            changesObjSecond.date_end = addTime(date_start, time, 'hours');
          }
        }
      }

      if (!formState.is_column) {
        [changesObjSecond.norm_id] = changesObjSecond.norm_id;
        [changesObjSecond.is_cleaning_norm] = changesObjSecond.is_cleaning_norm;
      }

      this.props.handleMultiFormChange(changesObjSecond);

      this.setState({ selectedRoute: route });
    } else {
      this.setState({ selectedRoute: null });
    }

    this.props.handleMultiFormChange(changesObj);
  }

  handleCarIdChange = (car_id, dataCar) => {
    const { formState } = this.props;

    if (car_id !== formState.car_id) {
      let type_id = null;
      let assign_to_waybill = formState.assign_to_waybill;
      const IS_NOT_IN_WAYBILL = formState.can_edit_car_and_route;
      const IS_ASSIGNED = formState.status === 'assigned';

      if (Array.isArray(dataCar)) {
        type_id = dataCar.map(({ type_id: car_type_id }) => car_type_id);
        assign_to_waybill = Array(dataCar.length).fill('assign_to_new_draft');
      } else if (car_id) {
        type_id = dataCar.type_id;
        assign_to_waybill = 'assign_to_new_draft';
      }

      if (IS_ASSIGNED && IS_NOT_IN_WAYBILL && formState.car_id === this.state.firstFormState.car_id) {
        global.NOTIFICATION_SYSTEM.notify({
          title: 'Внимание!',
          message: 'Данное задание было связано с черновиком путевого листа. При сохранении данного задания с новым ТС необходимо выбрать тип добавления в ПЛ. Из предыдущего ПЛ данное задание будет удалено.',
          level: 'info',
          dismissible: true,
          position: 'tr',
          uid: 'IS_NOT_IN_WAYBILL_car_id',
          autoDismiss: 0,
        });
      }

      const {
        fromOrder,
      } = this.props;

      const chageObj = {
        car_id,
        type_id,
        assign_to_waybill,
      };

      if (!fromOrder) {
        chageObj.is_cleaning_norm = isArray(car_id) ? car_id.map(() => false) : false;
        chageObj.norm_id = isArray(car_id) ? car_id.map(() => null) : null;
      }

      this.props.handleMultiFormChange(chageObj);

      this.handleRouteIdChange(null);
    }
  }

  handleColumnFlag = (e) => {
    const is_column = get(e, ['target', 'checked']);

    let {
      formState: {
        car_id,
        type_id,
        norm_id,
        is_cleaning_norm,
        assign_to_waybill,
      },
    } = this.props;

    if (car_id) {
      if (is_column) {
        car_id = [car_id];
      } else {
        car_id = null;
      }
    }
    if (type_id) {
      if (is_column) {
        type_id = [type_id];
      } else {
        type_id = null;
      }
    }
    if (norm_id) {
      if (is_column) {
        norm_id = [norm_id];
      } else {
        norm_id = this.props.formOrder ? norm_id : null;
      }
    }
    if (is_cleaning_norm) {
      if (is_column) {
        is_cleaning_norm = [is_cleaning_norm];
      } else {
        is_cleaning_norm = this.props.formOrder ? is_cleaning_norm : null;
      }
    }
    if (assign_to_waybill) {
      if (is_column) {
        assign_to_waybill = [assign_to_waybill];
      } else {
        assign_to_waybill = null;
      }
    }

    this.props.handleMultiFormChange({
      car_id,
      type_id,
      norm_id,
      is_cleaning_norm,
      is_column,
      assign_to_waybill,
    });
  }

  handleTechnicalOperationChange = (technical_operation_id) => {
    const changedObj = {};

    if (!this.props.withDefineCarId) {
      changedObj.car_id = null;
      changedObj.type_id = null;
    }

    this.props.handleMultiFormChange({
      technical_operation_id,
      municipal_facility_id: null,
      is_cleaning_norm: false,
      is_column: false,
      norm_id: null,
      ...changedObj,
    });

    this.handleRouteIdChange(null);
  }

  handleChangeMF = (name, value) => {
    this.handleChange(name, value);
    if (!this.props.withDefineCarId) {
      this.handleChange('car_id', null);
    }
    this.handleRouteIdChange(null);
  }

  handleStructureIdChange = (structure_id) => {
    const changesObj = {
      structure_id,
    };

    const car = this.props.carsIndex[this.props.formState.car_id];

    if (!structure_id) {
      if (car && !car.is_common) {
        this.handleChange('car_id', null);
      }
    } else {
      if (car && structure_id !== car.company_structure_id) {
        changesObj.car_id = null;
      }
      if (this.state.selectedRoute && structure_id !== this.state.selectedRoute.structure_id) {
        this.handleRouteIdChange(null);
      }
    }

    this.props.handleMultiFormChange(changesObj);
  }

  createNewRoute = () => {
    this.setState({
      showRouteForm: true,
      selectedRoute: {
        is_main: true,
        name: '',
        municipal_facility_id: this.props.formState.municipal_facility_id,
        municipal_facility_name: '',
        technical_operation_id: this.props.formState.technical_operation_id,
        technical_operation_name: '',
        structure_id: this.props.formState.structure_id,
        structure_name: '',
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      },
    });
  }

  onFormHide = (isSubmitted, route) => {
    const { flux } = this.context;
    const routesActions = flux.getActions('routes');
    const { formState } = this.props;

    if (isSubmitted) {
      handleRouteFormHide(
        formState,
        this.state,
        routesActions.getRoutesBySomeData,
      ).then((ans) => {
        this.setState({ ...ans });
      });

      this.handleRouteIdChange(route.id);
    }

    this.setState({ showRouteForm: false });
  }

  handleChangeDateStart = (date_start) => {
    if (date_start) {
      const { date_end } = this.props.formState;
      let { is_cleaning_norm } = this.props.formState;

      if (!this.props.formState.is_column) {
        is_cleaning_norm = [is_cleaning_norm];
      }

      is_cleaning_norm = isArray(is_cleaning_norm) ? is_cleaning_norm : [is_cleaning_norm];

      const changesObj = {
        date_start,
        date_end,
      };
      const { selectedRoute } = this.state;

      if (date_start && date_end && is_cleaning_norm.some(value => value) && selectedRoute) {
        const { time } = routeTypesByKey[selectedRoute.type];

        if (diffDates(date_end, date_start, 'hours') > time) {
          changesObj.date_end = addTime(date_start, time, 'hours');
        }
      }

      this.props.handleMultiFormChange(changesObj);
    }
    this.handleChange('date_start', date_start);
  }

  handleChangeHoursDateEnd = (countHours) => {
    if (this.props.formState.date_start) {
      this.handleChangeDateEnd(addTime(this.props.formState.date_start, countHours, 'hours'));
    }
  }

  handleChangeDateEnd = newDate => this.handleChange('date_end', newDate);

  handleSubmit = (...props) => {
    if (this.props.formState.is_column && !this.props.template) {
      this.setState({ showColumnAssignment: true });
    } else {
      this.props.onSubmit(...props);
    }
  }

  handleSubmitFromAssignmentModal = (...props) => this.props.onSubmit(...props);

  hideColumnAssignment = () => {
    this.setState({ showColumnAssignment: false });
  }

  getDataByNormatives = (normatives) => {
    const { formState } = this.props;

    const trigger = (
      !formState.normatives
      || normatives.some(({ id }) => (
        !formState.normatives.find(({ id: formStateNormativeId }) => (
          id === formStateNormativeId
        ))
      ))
      || formState.can_edit_car_and_route
    );

    if (trigger) {
      const { flux } = this.context;
      const { withDefineCarId } = this.props;

      return getDataByNormatives(
        normatives,
        this.state.kind_task_ids,
        formState,
        withDefineCarId,
        flux.getActions('technicalOperation').getTechOperationsByNormIds,
        flux.getActions('routes').getRoutesBySomeData,
        flux.getActions('cars').getCarsByNormIds,
      ).then((newStateData) => {
        const changesObj = {
          normatives,
        };

        this.props.handleMultiFormChange(changesObj);

        this.setState({
          ...newStateData,
          carsList: newStateData.carsList || this.state.carsList,
        });
      });
    }

    return Promise.resolve(false);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const {
      missionSourcesList = [],
      fromOrder = false,
    } = this.props;

    const {
      TECH_OPERATIONS = [],
      routesList = [],
      carsList = [],
      technicalOperationsList = [],
      selectedRoute: route = null,
      available_route_types = [],
      kind_task_ids,
    } = this.state;

    const MISSION_SOURCES = missionSourcesList.reduce((newArr, { id, name, auto }) => {
      if (!auto || state.mission_source_id === id) {
        newArr.push({ value: id, label: name });
      }
      return newArr;
    }, []);

    const CARS = carsList
      .filter(c => ((!state.structure_id || c.is_common || c.company_structure_id === state.structure_id) && c.available_to_bind) || (state.car_id && state.car_id === c.asuods_id))
      .map(c => ({
        value: c.asuods_id,
        available: c.available,
        label: makeCarOptionLabel(c),
        type_id: c.type_id,
      }));

    const routes = routesList.filter(r => (!state.structure_id || r.structure_id === state.structure_id));

    const filteredRoutes = (
      route !== null
      && route.id !== undefined
      && routes.find(item => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = uniqBy(
      filteredRoutes.filter(({ type }) => (state.is_column ? type === AvailableRouteTypes.Mixed : true)).map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );
    // является ли задание отложенным
    const isDeferred = diffDates(state.date_start, new Date()) > 0;

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    let STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    if (this.props.withDefineCarId) {
      const selectedCar = carsList.find(({ asuods_id }) => asuods_id === state.car_id);
      const isCommonCar = get(selectedCar, 'is_common', false);
      const companyStructureIdCar = get(selectedCar, 'company_structure_id', null);

      if (!isCommonCar && companyStructureIdCar) {
        STRUCTURES = STRUCTURES.filter(({ value }) => value === companyStructureIdCar);
      }
    }
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;

    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) {
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_DELETABLE = true;
    }
    const structureValue = state.structure_id;

    const IS_COMPLETE = state.status === 'complete';
    const IS_CANCELED = state.status === 'canceled';
    const IS_FAIL = state.status === 'fail';
    const IS_CREATING = !state.status;
    const IS_POST_CREATING_NOT_ASSIGNED = state.status === 'not_assigned' || this.props.fromWaybill;
    const IS_ASSIGNED = state.status === 'assigned';
    const IS_IN_PROGRESS = state.status === 'in_progress';
    const IS_EXPIRED = state.status === 'expired';
    const IS_POST_CREATING_ASSIGNED = (IS_ASSIGNED || IS_EXPIRED || IS_IN_PROGRESS) && isDeferred;
    const IS_DISPLAY = !IS_CREATING && !(IS_POST_CREATING_NOT_ASSIGNED || IS_POST_CREATING_ASSIGNED);// (!!state.status && state.status !== 'not_assigned') || (!isDeferred && !IS_CREATING);
    const IS_DISABLED_ASSIGNED = (IS_ASSIGNED || IS_EXPIRED || IS_IN_PROGRESS) ? false : IS_DISPLAY; // флаг для возможности редактирования поля задач со статусом "Назначено", in_progress, expired
    const IS_NOT_IN_WAYBILL = state.can_edit_car_and_route;
    const IS_VALID_PUSH = state.car_id && state.car_gov_number && !CARS.some((({ value }) => value === state.car_id));

    if (IS_VALID_PUSH) {
      CARS.push({
        value: state.car_id,
        label: state.car_gov_number,
      });
    }

    let title = `Задание № ${state.number}${state.status === 'fail' || state.status === 'canceled' ? ' (Не выполнено)' : ''}`;
    if (state.column_id) {
      title = `${title} . Колонна № ${state.column_id}`;
    }

    const sourceIsOrder = !lodashIsEmpty(state.order_operation_id);

    const carEditionDisability = (
      (
        IS_POST_CREATING_ASSIGNED
        || state.status === 'not_assigned'
        || IS_DISPLAY
        || this.props.withDefineCarId
        || (IS_CREATING && isEmpty(state.technical_operation_id))
        || isEmpty(state.municipal_facility_id)
      )
      && !IS_NOT_IN_WAYBILL
    );

    const columnFlagDisability = (
      isEmpty(state.technical_operation_id)
      || isEmpty(state.municipal_facility_id)
      || !isOdhRouteTypePermitted(this.state.available_route_types)
    );


    const hiddenAssignToWaybill = (
      (
        !!state.status
        || this.props.fromWaybill
      )
      && !(
        IS_NOT_IN_WAYBILL
        && this.state.firstFormState.car_id !== state.car_id
      )
    );

    const routeIdDisabled = (
      (
        IS_POST_CREATING_ASSIGNED
        || IS_DISPLAY
        || !state.car_id
        || !state.municipal_facility_id
      ) && !IS_NOT_IN_WAYBILL
    );

    const municipalFacilityIdDisabled = (
      (!IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY))
      || sourceIsOrder
      || fromOrder
    );

    const alreadyDefineNormId = (
      sourceIsOrder
      || fromOrder
      || (
        !IS_CREATING
        && (
          IS_POST_CREATING_ASSIGNED
          || IS_DISPLAY
        )
      )
    );

    if (IS_CREATING) {
      title = (
        <div>
          <span>Создание задания</span>
          { !fromOrder && <span style={{ marginLeft: 10, color: 'red' }}>Данное задание не будет учитываться по централизованным заданиям</span>}
        </div>);
    }
    // Старые задания нельзя редактирвоать


    return (
      <>
        <ColumnAssignment
          ASSIGN_OPTIONS={ASSIGN_OPTIONS}
          formState={state}
          hideColumnAssignment={this.hideColumnAssignment}
          handleChange={this.handleChange}
          carsList={carsList}
          handleSubmit={this.handleSubmitFromAssignmentModal}
          show={this.state.showColumnAssignment}
        />
        <Modal id="modal-mission" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">
          <ExtDiv hidden={this.state.showColumnAssignment}>
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <ModalBody>
              <Row>
                <Col md={9}>
                  <Field
                    id="technical-operation-id"
                    type="select"
                    modalKey={modalKey}
                    label="Технологическая операция"
                    error={errors.technical_operation_id}
                    disabled={!IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY) || this.props.fromOrder || sourceIsOrder}
                    options={TECH_OPERATIONS}
                    value={state.technical_operation_id}
                    onChange={this.handleTechnicalOperationChange}
                    clearable={false}
                  />
                </Col>
                {
                  STRUCTURES.length > 0 && (
                    <Col md={3}>
                      <Field
                        id="m-structure-id"
                        type="select"
                        modalKey={modalKey}
                        label="Подразделение"
                        error={errors.structure_id}
                        disabled={STRUCTURE_FIELD_READONLY || this.props.fromWaybill || (!IS_CREATING && !this.props.fromWaybill) || !IS_CREATING}
                        clearable={STRUCTURE_FIELD_DELETABLE}
                        options={STRUCTURES}
                        emptyValue={null}
                        placeholder=""
                        value={structureValue}
                        onChange={this.handleStructureIdChange}
                      />
                    </Col>
                  )
              }
              </Row>
              <Row>
                <Col md={6}>
                  <InsideField.MunicipalFacility
                    modalKey={modalKey}
                    error={errors.municipal_facility_id}
                    name={state.municipal_facility_name}
                    value={state.municipal_facility_id}
                    date_start={state.date_start}
                    technical_operation_id={state.technical_operation_id}
                    norm_id={state.norm_id}
                    clearable={false}
                    disabled={municipalFacilityIdDisabled}
                    alreadyDefineNormId={alreadyDefineNormId}
                    handleChange={this.handleChangeMF}
                    technicalOperationsList={technicalOperationsList}
                    kind_task_ids={kind_task_ids}
                    getCleaningMunicipalFacilityList={this.context.flux.getActions('missions').getCleaningMunicipalFacilityList}
                    typeIdWraomWaybill={this.props.withDefineCarId ? state.type_id : null}
                    getDataByNormatives={this.getDataByNormatives}
                  />
                </Col>
                <Col md={6}>
                  <Row>
                    <Col className="date-label" md={12}><label>Время выполнения:</label></Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={10} xm={10} sm={10} xs={10}>
                          <Field
                            id="date-start"
                            type="date"
                            error={errors.date_start}
                            date={state.date_start}
                            disabled={IS_DISABLED_ASSIGNED}
                            min={this.props.fromWaybill && this.props.waybillStartDate ? this.props.waybillStartDate : null}
                            max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
                            onChange={this.handleChangeDateStart}
                          />
                        </Col>
                        <DropdownDateEndCol md={2} xm={2} sm={2} xs={2}>
                          <DropdownDateEnd id="date-end-dropdown" disabled={IS_DISPLAY || !state.date_start} onSelect={this.handleChangeHoursDateEnd} title="Продолжительность задания, ч">
                            <Dropdown.Toggle disabled={IS_DISPLAY}>
                              <Glyphicon id="select-date_end" glyph="time" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="select-date-end-custom">
                              <MenuItem eventKey={1}>1</MenuItem>
                              <MenuItem eventKey={2}>2</MenuItem>
                              <MenuItem eventKey={3}>3</MenuItem>
                              <MenuItem eventKey={4}>4</MenuItem>
                              <MenuItem eventKey={5}>5</MenuItem>
                            </Dropdown.Menu>
                          </DropdownDateEnd>
                        </DropdownDateEndCol>
                      </Row>
                    </Col>
                    <Col md={1}>
                      <Col md={12}>
                        <TimeDevider>
                          —
                        </TimeDevider>
                      </Col>
                    </Col>
                    <Col md={5}>
                      <Row>
                        <Col md={12}>
                          <Field
                            id="date_end"
                            type="date"
                            error={errors.date_end}
                            date={state.date_end}
                            disabled={IS_DISABLED_ASSIGNED}
                            min={state.date_start}
                            max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
                            onChange={this.handleChangeDateEnd}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Field
                    id="car-id"
                    type="select"
                    modalKey={modalKey}
                    multi={state.is_column}
                    label="Транспортное средство"
                    error={errors.car_id}
                    clearable={false}
                    className="white-space-pre-wrap"
                    disabled={carEditionDisability}
                    options={CARS}
                    optionRenderer={InsideField.CarOptionLabel}
                    value={state.car_id}
                    onChange={this.handleCarIdChange}
                  />
                </Col>
              </Row>
              <Row>
                {IS_CREATING && !this.props.fromWaybill && !this.props.withDefineCarId && (
                  <Col md={12}>
                    <ExtField
                      id="is_column"
                      type="boolean"
                      label="Создать задания на колонну"
                      disabled={columnFlagDisability}
                      value={state.is_column}
                      onChange={this.handleColumnFlag}
                    />
                  </Col>
                )}
              </Row>
              <Row>
                <Col md={12}>
                  <Field
                    id="m-route-id"
                    type="select"
                    modalKey={modalKey}
                    label="Маршрут"
                    error={errors.route_id}
                    disabled={routeIdDisabled}
                    options={ROUTES}
                    value={state.route_id}
                    onChange={this.handleRouteChange}
                  />
                  <Div hidden={state.route_id}>
                    <Button id="create-route" onClick={this.createNewRoute} disabled={false}>Создать новый</Button>
                  </Div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {
                    route && route.id
                      ? (
                        <RouteInfo
                          route={route}
                          noRouteName
                          mapKey="mapMissionFrom"
                        />
                      )
                      : (
                        <DivNone />
                      )
                  }
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <Field
                    id="passes-count"
                    type="number"
                    label="Количество циклов"
                    error={errors.passes_count}
                    disabled={(IS_POST_CREATING_ASSIGNED || IS_DISPLAY) && (IS_FAIL || IS_CANCELED || IS_COMPLETE)}
                    value={state.passes_count}
                    onChange={this.handleChange.bind(this, 'passes_count')}
                    min={0}
                  />
                </Col>
                <Col md={3}>
                  <Field
                    id="m-source-id"
                    type="select"
                    modalKey={modalKey}
                    label="Источник получения задания"
                    error={errors.mission_source_id}
                    disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || fromOrder || sourceIsOrder}
                    options={MISSION_SOURCES}
                    value={state.mission_source_id}
                    onChange={this.handleChange.bind(this, 'mission_source_id')}
                  />
                  { IS_CREATING && !fromOrder && <span className="help-block-mission-source">{'Задания на основе централизованных заданий необходимо создавать во вкладке "НСИ"-"Реестр централизованных заданий".'}</span> }
                </Col>
                {state.order_number != null
                  && (
                    <Col md={2}>
                      <Field
                        id="order-number"
                        type="string"
                        label="Номер централизованного задания"
                        readOnly
                        value={state.order_number}
                      />
                    </Col>
                  )
                }
                <Col md={state.order_number != null ? 4 : 6}>
                  <Field
                    id="m-comment"
                    type="string"
                    label="Комментарий"
                    value={state.comment}
                    disabled={IS_FAIL || IS_CANCELED || IS_COMPLETE}
                    onChange={this.handleChange.bind(this, 'comment')}
                    error={errors.comment}
                  />
                </Col>
              </Row>
            </ModalBody>

            <Modal.Footer>
              <Div className="inline-block">
                {!state.is_column && (
                  <Div className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }} hidden={hiddenAssignToWaybill}>
                    <ReactSelect
                      id="assign-to-waybill"
                      type="select"
                      modalKey={modalKey}
                      options={ASSIGN_OPTIONS}
                      value={state.assign_to_waybill}
                      clearable={false}
                      onChange={this.handleChange.bind(this, 'assign_to_waybill')}
                    />
                  </Div>
                )}
                {
                  !state.is_column && (
                  <Dropdown id="waybill-print-dropdown" dropup disabled={!state.status || !this.props.canSave || !state.route_id} onSelect={this.props.handlePrint}>
                    <Dropdown.Toggle disabled={!state.status || !this.props.canSave || !state.route_id}>
                      <Glyphicon id="m-print" glyph="print" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem eventKey={1}>Экспорт в файл</MenuItem>
                      <MenuItem eventKey={2}>Печать</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                  )}
                <ButtonSaveMission id="m-submit" onClick={this.handleSubmit} disabled={!this.props.canSave}>Сохранить</ButtonSaveMission>
              </Div>
            </Modal.Footer>
            <HiddenMapForPrint
              route={route}
              printMapKeySmall={this.props.printMapKeySmall}
            />
            <RouteFormWrap
              element={route}
              showForm={this.state.showRouteForm}
              handleHide={this.onFormHide}
              hasMissionStructureId={!!state.structure_id}
              missionAvailableRouteTypes={state.is_column ? available_route_types.filter(type => type === 'mixed') : available_route_types}
              fromMission
            />
          </ExtDiv>
        </Modal>
      </>
    );
  }
}

export default connectToStores(
  withRequirePermissionsNew({
    permissions: missionPermission.update,
    withIsPermittedProps: true,
  })(MissionForm),
  ['objects', 'employees', 'missions', 'session'],
);
