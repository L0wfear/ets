import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import {
  find,
  uniqBy,
  isEmpty as lodashIsEmpty,
} from 'lodash';

import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import Field from 'components/ui/Field.jsx';

import EtsSelect from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form.jsx';
import InsideField from 'components/missions/mission/inside_fields/index';
import { checkRouteByNew } from 'components/missions/utils/utils.ts';
import { routeTypesBySlug } from 'constants/route';

import { addTime, diffDates } from 'utils/dates.js';
import {
  getDataByNormId,
  getDataBySelectedRoute,
  getRoutesByMissionId,
  getTechnicalOperationData,
  handleRouteFormHide,
} from 'components/missions/mission/utils';

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
      car_func_types_ids: [],
      is_cleaning_norm: false,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    const technicalOperationsActions = flux.getActions('technicalOperation').getTechnicalOperations;
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions').getMissionSources;

    const { formState } = this.props;

    Promise.all([
      getTechnicalOperationData(formState, this.props.fromOrder, this.props.fromWaybill, missionsActions, technicalOperationsActions),
      getDataBySelectedRoute(formState, routesActions.getRouteById),
      getRoutesByMissionId(formState, this.props.isTemplate, routesActions.getRoutesByMissionId, this.props.routesList),
    ])
    .then(([technicalOperationsData, selectedRoute, routesList]) =>
      this.setState({
        ...technicalOperationsData,
        selectedRoute,
        routesList,
        carsList: this.props.carsList,
      })
    );
  }

  handleRouteIdChange = (route_id) => {
    const changesObj = {
      route_id,
    };

    const { flux } = this.context;
    if (route_id) {
      flux.getActions('routes').getRouteById(route_id, false)
        .then((route) => {
          if (this.state.is_cleaning_norm) {
            const { formState: { date_start } } = this.props;
            if (date_start) {
              changesObj.date_end = addTime(date_start, routeTypesBySlug[route.object_type].time, 'hours');
            }
          }
          this.setState({ selectedRoute: route });
        });
    } else {
      this.setState({ selectedRoute: null });
    }

    this.props.handleMultiFormChange(changesObj);
  }

  handleCarIdChange = (car_id) => {
    this.handleChange('car_id', car_id);
    if (this.props.formState.status) {
      this.handleRouteIdChange(undefined);
    }
  }

  handleTechnicalOperationChange = (technical_operation_id) => {
    this.props.handleMultiFormChange({
      technical_operation_id,
      municipal_facility_id: null,
    });

    this.handleRouteIdChange(undefined);
  }
  handleChangeMF = (name, value) => {
    this.handleChange(name, value);
    this.handleRouteIdChange(undefined);
  }

  handleStructureIdChange = (structure_id) => {
    const { formState } = this.props;
    const changesObj = {
      structure_id,
    };

    if (this.props.carsList.find(car => (!structure_id || car.is_common || car.company_structure_id === structure_id) && car.asuods_id === formState.car_id)) {
      changesObj.car_id = null;
    }
    if (this.state.routesList.find(route => (!structure_id || (structure_id === route.structure_id)) && (route.id === formState.route_id))) {
      changesObj.route_id = null;

      this.handleRouteIdChange(undefined);
    }

    this.props.handleMultiFormChange(changesObj);
  }

  createNewRoute = () => {
    this.context.flux.getActions('geoObjects').getGeozones()
      .then(() =>
        this.setState({
          showRouteForm: true,
          selectedRoute: {
            norm_id: this.props.formState.norm_id,
            name: '',
            polys: this.props.geozonePolys,
            technical_operation_id: this.props.formState.technical_operation_id,
            municipal_facility_id: this.props.formState.municipal_facility_id,
            structure_id: this.props.formState.structure_id,
            object_list: [],
          },
        })
      );
  }

  onFormHide = (isSubmitted, result) => {
    const { flux } = this.context;
    const routesActions = flux.getActions('routes');
    const { formState } = this.props;
    return handleRouteFormHide(
      isSubmitted,
      result,
      formState,
      this.state,
      routesActions.getRouteById,
      routesActions.getRoutesBySomeData,
    )
    .then((newStateData) => {
      const changesObj = {};
      const { object_type } = newStateData.selectedRoute;
      changesObj.route_id = newStateData.route_id;

      if (this.state.is_cleaning_norm) {
        const { date_start } = formState;

        if (date_start) {
          changesObj.date_end = addTime(date_start, routeTypesBySlug[object_type].time, 'hours');
        }
      }

      this.props.handleMultiFormChange(changesObj);
      this.setState({ ...newStateData });
    });
  }

  handleChangeDateStart = (date_start) => {
    const changesObj = {
      date_start,
    };

    if (date_start && this.state.is_cleaning_norm) {
      changesObj.date_end = addTime(date_start, routeTypesBySlug[this.state.selectedRoute.object_type].time, 'hours');
    }

    this.props.handleMultiFormChange(changesObj);
  }

  getDataByNormId = (norm_id) => {
    const { flux } = this.context;
    const {
      formState,
      fromWaybill,
    } = this.props;

    return getDataByNormId(
      norm_id,
      formState,
      fromWaybill,
      flux.getActions('technicalOperation').getOneTechOperationByNormId,
      flux.getActions('routes').getRoutesBySomeData,
      flux.getActions('cars').getCarsByNormId,
    )
    .then((newStateData) => {
      const changesObj = {
        norm_id,
      };

      let { car_func_types_ids } = this.state;
      if (!formState.status && !fromWaybill) {
        if (!this.state.isTemplate) {
          changesObj.car_id = undefined;
        }
        car_func_types_ids = newStateData.normData.car_func_types.map(({ asuods_id }) => asuods_id);
      }

      this.props.handleMultiFormChange(changesObj);

      this.setState({
        ...newStateData,
        car_func_types_ids,
        carsList: newStateData.carsList || this.state.carsList,
      });
    });
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
      car_func_types_ids = [],
      kind_task_ids,
    } = this.state;

    const MISSION_SOURCES = missionSourcesList.reduce((newArr, { id, name, auto }) => {
      if (!auto || state.mission_source_id === id) {
        newArr.push({ value: id, label: name });
      }
      return newArr;
    }, []);

    const CARS = carsList
      .filter(c => (!state.structure_id || c.is_common || c.company_structure_id === state.structure_id) && (lodashIsEmpty(car_func_types_ids) ? true : car_func_types_ids.includes(c.type_id)))
      .map(c => ({
        value: c.asuods_id,
        available: c.available,
        label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
        type_id: c.type_id,
      }));
    const routes = routesList.filter(r => (!state.structure_id || r.structure_id === state.structure_id) && checkRouteByNew(state, r, available_route_types));

    const filteredRoutes = (
      route !== null &&
      route.id !== undefined &&
      routes.find(item => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = uniqBy(
      filteredRoutes.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );
    // является ли задание отложенным
    const isDeferred = diffDates(state.date_start, new Date()) > 0;

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


    const IS_CREATING = !state.status;
    const IS_POST_CREATING_NOT_ASSIGNED = state.status === 'not_assigned' || this.props.fromWaybill;
    const IS_ASSIGNED = state.status === 'assigned';
    const IS_POST_CREATING_ASSIGNED = IS_ASSIGNED && isDeferred;
    const IS_DISPLAY = !IS_CREATING && !(IS_POST_CREATING_NOT_ASSIGNED || IS_POST_CREATING_ASSIGNED);// (!!state.status && state.status !== 'not_assigned') || (!isDeferred && !IS_CREATING);
    let title = `Задание № ${state.number || ''} ${state.status === 'fail' ? '(Не выполнено)' : ''}`;

    if (IS_CREATING) {
      title = (
        <div>
          <span>Создание задания</span>
          { !fromOrder && <span style={{ marginLeft: 10, color: 'red' }}>Данное задание не будет учитываться по централизованным заданиям</span>}
        </div>);
    }
    // Старые задания нельзя редактирвоать

    const sourceIsOrder = !lodashIsEmpty(state.order_operation_id);

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={9}>
              <Field
                id="technical-operation-id"
                type="select"
                label="Технологическая операция"
                error={errors.technical_operation_id}
                disabled={!IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY) || this.props.fromOrder || sourceIsOrder}
                options={TECH_OPERATIONS}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange}
                clearable={false}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && <Col md={3}>
              <Field
                id="m-structure-id"
                type="select"
                label="Подразделение"
                error={errors.structure_id}
                disabled={STRUCTURE_FIELD_READONLY || this.props.fromWaybill || (!IS_CREATING && !this.props.fromWaybill) || !IS_CREATING}
                clearable={STRUCTURE_FIELD_DELETABLE}
                options={STRUCTURES}
                emptyValue={null}
                placeholder={''}
                value={state.structure_id}
                onChange={this.handleStructureIdChange}
              />
            </Col>}
          </Row>
          <Row>
            <Col md={12}>
              <InsideField.MunicipalFacility
                id={'municipal_facility_id'}
                label={'municipal_facility_name'}
                errors={errors}
                state={state}
                disabled={(!IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY)) || this.props.fromOrder || sourceIsOrder}
                handleChange={this.handleChangeMF}
                getDataByNormId={this.getDataByNormId}
                technicalOperationsList={technicalOperationsList}
                getNormIdFromState={!!fromOrder || !IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY) || this.props.fromOrder || sourceIsOrder}
                fromWaybill={this.props.fromWaybill}
                type_id={state.type_id}
                kind_task_ids={kind_task_ids}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field
                id="car-id"
                type="select"
                label="Транспортное средство"
                error={errors.car_id}
                className="white-space-pre-wrap"
                disabled={IS_POST_CREATING_ASSIGNED ||
                  state.status === 'not_assigned' ||
                  IS_DISPLAY ||
                  this.props.fromWaybill ||
                  (IS_CREATING && isEmpty(state.technical_operation_id)) ||
                  isEmpty(state.municipal_facility_id)
                }
                options={CARS}
                optionRenderer={InsideField.CarOptionLabel}
                value={state.car_id}
                onChange={this.handleCarIdChange}
              />
            </Col>

            <Col md={3}>
              <label style={{ position: 'absolute', right: -7, top: 31, fontWeight: 400 }}>—</label>
              <Div>
                <Field
                  id="date-start"
                  type="date"
                  label="Время выполнения:"
                  error={errors.date_start}
                  date={state.date_start}
                  disabled={((IS_DISPLAY) && !IS_ASSIGNED)}
                  min={this.props.fromWaybill && this.props.waybillStartDate ? this.props.waybillStartDate : null}
                  max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
                  onChange={this.handleChangeDateStart}
                />
              </Div>
            </Col>
            <Col md={3}>
              <Div>
                <Field
                  id="date_end"
                  type="date"
                  label=""
                  error={errors.date_end}
                  date={state.date_end}
                  disabled={((IS_DISPLAY) && !IS_ASSIGNED)}
                  min={state.date_start}
                  max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
                  onChange={this.handleChange.bind(this, 'date_end')}
                />
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                id="m-route-id"
                type="select"
                label="Маршрут"
                error={errors.route_id}
                disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !state.car_id || !state.municipal_facility_id}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteIdChange}
              />
              <Div hidden={state.route_id}>
                <Button id="create-route" onClick={this.createNewRoute} disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !state.car_id || !state.municipal_facility_id}>Создать новый</Button>
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Div hidden={route ? route.id == null : true} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Field
                id="passes-count"
                type="number"
                label="Кол-во циклов"
                error={errors.passes_count}
                disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
                value={state.passes_count}
                onChange={this.handleChange.bind(this, 'passes_count')}
                min={0}
              />
            </Col>
            <Col md={3}>
              <Field
                id="m-source-id"
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || fromOrder || sourceIsOrder}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
              { IS_CREATING && !fromOrder && <span className="help-block-mission-source">{'Задания на основе централизованных заданий необходимо создавать во вкладке "НСИ"-"Реестр централизованных заданий".'}</span> }
            </Col>
            {state.order_number != null && <Col md={2}>
              <Field
                id="order-number"
                type="string"
                label="Номер централизованного задания"
                readOnly
                value={state.order_number}
              />
            </Col>}
            <Col md={state.order_number != null ? 4 : 6}>
              <Field
                id="m-comment"
                type="string"
                label="Комментарий"
                value={state.comment}
                disabled={state.status === 'fail' || state.status === 'complete' }
                onChange={this.handleChange.bind(this, 'comment')}
                error={errors.comment}
              />
            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }} hidden={!!state.status || this.props.fromWaybill}>
            <EtsSelect
              id="assign-to-waybill"
              type="select"
              options={ASSIGN_OPTIONS}
              value={state.assign_to_waybill}
              clearable={false}
              onChange={this.handleChange.bind(this, 'assign_to_waybill')}
            />
          </Div>
          <Div className="inline-block">
            <Dropdown id="waybill-print-dropdown" dropup disabled={!state.status || !this.props.canSave || !state.route_id} onSelect={this.props.handlePrint}>
              <Dropdown.Toggle disabled={!state.status || !this.props.canSave || !state.route_id}>
                <Glyphicon id="m-print" glyph="print" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem eventKey={1}>Экспорт в файл</MenuItem>
                <MenuItem eventKey={2}>Печать</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
            <Button id="m-submit" onClick={this.handleSubmit} disabled={!this.props.canSave}>Сохранить</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap
          element={route}
          onFormHide={this.onFormHide}
          showForm={this.state.showRouteForm}
          fromMission
          notTemplate
          fromOrder={this.props.fromOrder}
          available_route_types={available_route_types}
          structureId={state.structure_id}
        />
      </Modal>
    );
  }
}

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
