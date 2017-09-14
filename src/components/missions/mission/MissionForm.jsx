import React from 'react';
import connectToStores from 'flummox/connect';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Button, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import Field from 'components/ui/Field.jsx';
import EtsSelect from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';
import moment from 'moment';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form.jsx';
import _ from 'lodash';
import CarAvailableIcon from 'assets/images/car_available.png';
import CarNotAvailableIcon from 'assets/images/car_not_available.png';

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
      this.handleChange('technical_operation_id', undefined);
      this.handleRouteIdChange(undefined);
      try {
        const technicalOperationsList = await this.context.flux.getActions('technicalOperation')
                                                             .getTechnicalOperationsByCarId(v);
        this.setState({ technicalOperationsList });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async handleTechnicalOperationChange(v) {
    this.handleChange('technical_operation_id', v);
    this.handleRouteIdChange(undefined);

    if (!this.props.formState.status && !this.props.fromWaybill) {
      this.handleChange('car_id', undefined);
      const carsList = await this.context.flux.getActions('cars')
                                            .getCarsByTechnicalOperation(v);
      this.setState({ carsList });
    }

    try {
      const routesList = await this.context.flux.getActions('routes')
                                              .getRoutesByTechnicalOperation(v);
      if (routesList.length === 1) {
        this.handleRouteIdChange(routesList[0].id);
      }
      this.setState({ routesList });
    } catch (e) {
      console.error(e);
    }
  }

  handleStructureIdChange(v) {
    const carsList = this.props.carsList.filter(c => !v || c.is_common || c.company_structure_id === v);
    const routesList = this.state.routesList.filter(r => !v || r.structure_id === v);
    if (!_.find(carsList, c => c.asuods_id === this.props.formState.car_id)) this.handleChange('car_id', null);
    if (!_.find(routesList, r => r.id === this.props.formState.route_id)) {
      this.handleChange('route_id', null);
      this.handleRouteIdChange(undefined);
    }
    this.handleChange('structure_id', v);
  }

  async componentWillMount() {
    const mission = this.props.formState;
    const { flux } = this.context;
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions');
    const isTemplate = this.props.template || false;

    let { selectedRoute } = this.state;
    let { technicalOperationsList, routesList, carsList } = this.props;

    if (!isEmpty(mission.route_id)) {
      selectedRoute = await routesActions.getRouteById(mission.route_id, false);
    }

    if (!isEmpty(mission.technical_operation_id)) {
      carsList = await this.context.flux.getActions('cars').getCarsByTechnicalOperation(mission.technical_operation_id);
    }

    if (!isEmpty(mission.id)) {
      routesList = await routesActions.getRoutesByMissionId(mission.id, isTemplate);
    }

    technicalOperationsList = await technicalOperationsActions.getTechnicalOperationsByCarId(mission.car_id);
    missionsActions.getMissionSources();

    this.setState({
      carsList,
      technicalOperationsList,
      routesList,
      selectedRoute,
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

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { missionSourcesList = [] } = this.props;
    const { technicalOperationsList = [], routesList = [], carsList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const MISSION_SOURCES = missionSourcesList.map(({ id, name }) => ({ value: id, label: name }));
    const ASSIGN_OPTIONS = [
      { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
      { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
      { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
    ];
    const CARS = carsList
      .filter(c => !state.structure_id || c.is_common || c.company_structure_id === state.structure_id)
      .map(c => ({
        value: c.asuods_id,
        available: c.available,
        label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`,
      }));

    const route = this.state.selectedRoute;
    const routes = routesList.filter(r => !state.structure_id || r.structure_id === state.structure_id);

    const filteredRoutes = (
      route !== null &&
      route.id !== undefined &&
      routes.find(item => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = _.uniqBy(
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
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && _.find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }


    const IS_CREATING = !state.status;
    const IS_POST_CREATING_NOT_ASSIGNED = state.status === 'not_assigned' || this.props.fromWaybill;
    const IS_POST_CREATING_ASSIGNED = state.status === 'assigned' && isDeferred;
    const IS_DISPLAY = !IS_CREATING && !(IS_POST_CREATING_NOT_ASSIGNED || IS_POST_CREATING_ASSIGNED);// (!!state.status && state.status !== 'not_assigned') || (!isDeferred && !IS_CREATING);
    let title = `Задание № ${state.number || ''} ${state.status === 'fail' ? '(Не выполнено)' : ''}`;

    if (IS_CREATING) {
      title = 'Создание задания';
    }


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
                label="Транспортное средство"
                error={errors.car_id}
                className="white-space-pre-wrap"
                disabled={IS_POST_CREATING_ASSIGNED ||
                  IS_POST_CREATING_NOT_ASSIGNED ||
                  IS_DISPLAY ||
                  this.props.fromWaybill ||
                  (IS_CREATING && isEmpty(state.technical_operation_id))}
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
                  type="date"
                  label="Время выполнения:"
                  error={errors.date_start}
                  date={state.date_start}
                  disabled={IS_DISPLAY}
                  min={this.props.fromWaybill && this.props.waybillStartDate ? this.props.waybillStartDate : null}
                  max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
                  onChange={this.handleChange.bind(this, 'date_start')}
                />
              </Div>
            </Col>
            <Col md={3}>
              <Div>
                <Field
                  type="date"
                  label=""
                  error={errors.date_end}
                  date={state.date_end}
                  disabled={IS_DISPLAY}
                  min={state.date_start}
                  max={this.props.fromWaybill && this.props.waybillEndDate ? this.props.waybillEndDate : null}
                  onChange={this.handleChange.bind(this, 'date_end')}
                />
              </Div>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Field
                type="number"
                label="Кол-во проходов"
                error={errors.passes_count}
                disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
                value={state.passes_count}
                onChange={this.handleChange.bind(this, 'passes_count')}
                min={0}
              />
            </Col>
            <Col md={3}>
              <Field
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
              { IS_CREATING && <span style={{ opacity: 0.5 }}>{'Задания на основе факсограмм необходимо создавать во вкладке "НСИ"-"Реестр факсограмм".'}</span> }
            </Col>
            {state.order_number != null && <Col md={2}>
              <Field
                type="string"
                label="Номер факсограммы"
                readOnly
                value={state.order_number}
              />
            </Col>}
            <Col md={state.order_number != null ? 4 : 6}>
              <Field
                type="string"
                label="Комментарий"
                value={state.comment}
                onChange={this.handleChange.bind(this, 'comment')}
                error={errors.comment}
              />
            </Col>
          </Row>

          <Row>
            <Col md={9}>
              <Field
                type="select"
                label="Технологическая операция"
                error={errors.technical_operation_id}
                disabled={!IS_CREATING && (IS_POST_CREATING_ASSIGNED || IS_DISPLAY || isEmpty(state.car_id))}
                options={TECH_OPERATIONS}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && <Col md={3}>
              <Field type="select"
                label="Подразделение"
                error={errors.structure_id}
                disabled={STRUCTURE_FIELD_READONLY || this.props.fromWaybill || (!IS_CREATING && !IS_POST_CREATING_NOT_ASSIGNED) || !IS_CREATING}
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
              <Field
                type="select"
                label="Маршрут"
                error={errors.route_id}
                disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !state.technical_operation_id}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteIdChange}
              />
              <Div hidden={state.route_id}>
                <Button onClick={this.createNewRoute} disabled={IS_POST_CREATING_ASSIGNED || IS_DISPLAY || !state.technical_operation_id}>Создать новый</Button>
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

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }} hidden={!!state.status || this.props.fromWaybill}>
            <EtsSelect
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
                <Glyphicon glyph="print" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem eventKey={1}>Экспорт в файл</MenuItem>
                <MenuItem eventKey={2}>Печать</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={this.handleSubmit} disabled={!this.props.canSave}>Сохранить</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap
          element={route}
          onFormHide={this.onFormHide}
          showForm={this.state.showRouteForm}
          fromMission
          structureId={state.structure_id}
        />
      </Modal>
    );
  }
}

export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
