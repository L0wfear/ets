import React from 'react';
import connectToStores from 'flummox/connect';
import { autobind } from 'core-decorators';
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
import moment from 'moment';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form.jsx';
import CarAvailableIcon from 'assets/images/car_available.png';
import CarNotAvailableIcon from 'assets/images/car_not_available.png';
import InsideField from 'components/missions/mission/inside_fields/index';
import { getKindTaskIds } from 'components/missions/utils/utils.ts';

export const checkRouteByNew = (state, route) => {
  const { is_new = true } = state;

  if (is_new) {
    const {
      is_new: route_is_new,
    } = route;

    if (route_is_new) {
      return true;
    }
    return false;
  }
  return true;
};

@autobind
export class MissionForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      selectedRoute: null,
      showRouteForm: false,
      carsList: [],
      routesList: [],
      technicalOperationsList: [],
      car_func_types_ids: [],
    };
  }

  handleRouteIdChange(v) {
    this.handleChange('route_id', v);
    const { flux } = this.context;
    if (v) {
      flux.getActions('routes').getRouteById(v, false).then((r) => {
        this.setState({ selectedRoute: r });
      });
    } else {
      this.setState({ selectedRoute: null });
    }
  }

  async handleCarIdChange(v) {
    this.handleChange('car_id', v);
    if (this.props.formState.status) {
      this.handleRouteIdChange(undefined);
    }
  }

  // Зачем тут таймаут?
  // В текущей версии react-select стоит снятие фокуса через 0.05 секунды
  // Но через 0.05 секунды он не может найти элемент и в консоль падает ошибка
  // С версии 2.0.15.00 используется другая версия react-select и там этой ошибки нет
  handleTechnicalOperationChange(v) {
    setTimeout(() => {
      this.handleChange('technical_operation_id', v);
      this.handleChange('municipal_facility_id', null);
      this.handleRouteIdChange(undefined);
    }, 60);
  }
  handleChangeMF = (name, value) => {
    this.handleChange(name, value);
    this.handleRouteIdChange(undefined);
  }

  handleStructureIdChange(v) {
    const carsList = this.props.carsList.filter(c => !v || c.is_common || c.company_structure_id === v);
    const routesList = this.state.routesList.filter(r => !v || r.structure_id === v);
    if (!find(carsList, c => c.asuods_id === this.props.formState.car_id)) {
      this.handleChange('car_id', null);
    }
    if (!find(routesList, r => r.id === this.props.formState.route_id)) {
      this.handleChange('route_id', null);
      this.handleRouteIdChange(undefined);
    }
    this.handleChange('structure_id', v);
  }

  async componentDidMount() {
    const mission = this.props.formState;
    const { flux } = this.context;
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions');
    const isTemplate = this.props.template || false;

    let { carsList } = this.props;
    let kind_task_ids = null;
    let { selectedRoute } = this.state;
    let { routesList } = this.props;
    let TECH_OPERATIONS = [];

    await missionsActions.getMissionSources();

    if (!isEmpty(mission.route_id)) {
      selectedRoute = await routesActions.getRouteById(mission.route_id, false);
    }

    if (!isEmpty(mission.id)) {
      routesList = await routesActions.getRoutesByMissionId(mission.id, isTemplate);
    }
    if (!isEmpty(mission.norm_id)) {
      routesList = await routesActions.getRoutesBySomeData(mission.norm_id, isTemplate);
    }

    const {
      norm_id,
      id,
      mission_source_id,
    } = mission;

    if (norm_id) {
      await this.getDataByNormId(norm_id);
      carsList = await this.context.flux.getActions('cars').getCarsByNormId({ norm_id })
        .then(({ result: { rows = [] } }) => rows);
    }

    const { missionSourcesList = [] } = this.props;
    if (missionSourcesList.find(({ auto }) => auto).id !== mission_source_id && !this.props.fromOrder) {
      kind_task_ids = getKindTaskIds(id, false);
    }

    /**
     * DITETS-2359
     * GET /technical_operation?only=new
     * GET /technical_operation?only=old
     */
    const { result: technicalOperationsList } = await technicalOperationsActions.getTechnicalOperations();

    let type_id = 0;
    if (mission.status === 'not_assigned') {
      type_id = (carsList.find(({ asuods_id }) => asuods_id === mission.car_id) || {}).type_id;
      this.handleChange('type_id', type_id);
    }

    const {
      is_new,
      type_id: m_type_id = type_id,
    } = mission;

    if ((this.props.fromWaybill || mission.status === 'not_assigned') && m_type_id) {
      TECH_OPERATIONS = technicalOperationsList.reduce((newArr, to) => {
        const {
          is_new: is_new_to,
          id: value,
          name: label,
          car_func_types,
        } = to;

        if (is_new_to && car_func_types.find(({ id }) => id === m_type_id)) {
          newArr.push({ value, label });
        }

        return newArr;
      }, []);
    } else if (is_new) {
      TECH_OPERATIONS = technicalOperationsList.reduce((newArr, to) => {
        const {
          is_new: is_new_to,
          id: value,
          name: label,
        } = to;

        if (is_new_to) {
          newArr.push({ value, label });
        }

        return newArr;
      }, []);
    } else {
      TECH_OPERATIONS = technicalOperationsList.map(({ id: value, name }) => ({ value, label: name }));
    }


    this.setState({
      kind_task_ids,
      carsList,
      TECH_OPERATIONS,
      technicalOperationsList,
      routesList,
      selectedRoute,
    });
  }

  createNewRoute() {
    this.context.flux.getActions('geoObjects').getGeozones().then(() => {
      const {
        formState: {
          norm_id,
        },
      } = this.props;

      const newR = {
        norm_id,
        name: '',
        polys: this.props.geozonePolys,
        technical_operation_id: this.props.formState.technical_operation_id,
        municipal_facility_id: this.props.formState.municipal_facility_id,
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
      const selectedRoute = await routesActions.getRouteById(createdRouteId);
      const routesList = await routesActions.getRoutesBySomeData({
        municipal_facility_id,
        technical_operation_id,
        type: available_route_types.join(','),
      });
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

  renderCarOptions(o) {
    return (
      <div>
        {o.available ?
          <img role="presentation" height="20" src={CarAvailableIcon} style={{ marginRight: 10, marginTop: -2 }} /> :
          <img role="presentation" height="20" src={CarNotAvailableIcon} style={{ marginRight: 10, marginTop: -2 }} />
        }
        {o.label}
      </div>
    );
  }
  handleChangeDateStart = (v) => {
    this.handleChange('date_start', v);
  }
  getDataByNormId = async (norm_id) => {
    this.handleChange('norm_id', norm_id);

    const {
      result: [
        to_data = {},
      ],
    } = await this.context.flux.getActions('technicalOperation').getOneTechOperationByNormId({ norm_id });

    const {
      route_types: available_route_types = [],
    } = to_data;

    if (!this.props.formState.status && !this.props.fromWaybill) {
      if (!this.state.isTemplate) {
        this.handleChange('car_id', undefined);
      }

      const {
        car_func_types = [],
      } = to_data;
      const car_func_types_ids = car_func_types.map(({ id }) => id);

      this.context.flux.getActions('cars').getCarsByNormId({ norm_id })
      .then(({ result: { rows: carsList } }) => {
        this.setState({ carsList, car_func_types_ids });
      });
    }
    const {
      formState: {
        technical_operation_id,
        municipal_facility_id,
      },
    } = this.props;

    this.context.flux.getActions('routes').getRoutesBySomeData({
      municipal_facility_id,
      technical_operation_id,
      type: available_route_types.join(','),
    })
    .then((routesList) => {
      this.setState({ routesList });
    });

    this.setState({ available_route_types });
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

    const ASSIGN_OPTIONS = [
      { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
      { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
      { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
    ];

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
    const isDeferred = moment(state.date_start).toDate().getTime() > moment().toDate().getTime();

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
                optionRenderer={this.renderCarOptions}
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
