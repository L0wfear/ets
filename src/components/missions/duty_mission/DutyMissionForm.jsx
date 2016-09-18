import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import { isEmpty } from 'utils/functions';
import Form from 'components/compositions/Form.jsx';

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

  handleBrigadeIdListChange(v) {
    const data = v.split(',');
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

    let { selectedRoute } = this.state;
    let { routesList } = this.props;

    if (!isEmpty(mission.route_id)) {
      selectedRoute = await routesActions.getRouteById(mission.route_id);
    }

    if (!isEmpty(mission.technical_operation_id)) {
      routesList = await routesActions.getRoutesByDutyMissionId(mission.id);
    }

    missionsActions.getMissions(mission.technical_operation_id);
    missionsActions.getMissionSources();
    flux.getActions('employees').getEmployees(true);
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
        object_list: [],
        type: 'vector',
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

    const EMPLOYEES_RKU_FILTER = 'brigade_worker';

    const { missionSourcesList = [], employeesList = [], missionsList = [] } = this.props;
    const { technicalOperationsList = [], routesList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const MISSION_SOURCES = missionSourcesList.map(({ id, name }) => ({ value: id, label: name }));
    const ROUTES = routesList.map(({ id, name }) => ({ value: id, label: name }));
    const EMPLOYEES = employeesList.map(d => ({ value: d.id, label: `${d.last_name} ${d.first_name} ${d.middle_name}` }));
    const MISSIONS = missionsList.map(({ id, number, technical_operation_name }) => {
      return { id, value: id, label: `№${number} (${technical_operation_name})` };
    });

    const IS_CREATING = !!!state.number;
    const IS_CLOSING = state.status && state.status === 'assigned';
    const IS_COMPLETED = state.status && state.status === 'complete';
    const IS_CLOSED = state.status === 'complete' || state.status === 'fail';

    let title = `Наряд-задание № ${state.number || ''}`;

    if (IS_CREATING) {
      title = 'Создание наряд-задания';
    }

    const route = this.state.selectedRoute;
    const IS_DISPLAY = !!state.status && state.status !== 'not_assigned';

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row>

            <Col md={6}>
              <Field type="select" label="Технологическая операция" error={errors.technical_operation_id}
                disabled={IS_DISPLAY || !!state.route_id}
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
                      disabled={IS_DISPLAY}
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
                      disabled={IS_DISPLAY}
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
                        disabled={IS_CLOSED}
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
                        disabled={IS_CLOSED}
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
                disabled={IS_DISPLAY}
                options={EMPLOYEES}
                value={state.foreman_id}
                onChange={this.handleChange.bind(this, 'foreman_id')}
              />
            </Col>

            <Col md={6}>
              <Field type="select" label="Бригада" error={errors.brigade_employee_id_list}
                multi
                disabled={IS_DISPLAY}
                options={EMPLOYEES}
                value={state.brigade_employee_id_list.filter(b => b.id || b.employee_id).map(b => b.id || b.employee_id).join(',')}
                onChange={this.handleBrigadeIdListChange.bind(this)}
              />
            </Col>
          </Row>


          <Row>
            <Col md={6}>
              <Field type="select" label="Источник получения задания" error={errors.mission_source_id}
                disabled={IS_DISPLAY}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
            </Col>
            <Col md={6}>
              <Field type="string" label="Комментарий" value={state.comment} onChange={this.handleChange.bind(this, 'comment')} error={errors.comment} />
            </Col>
          </Row>

          <Row>
            <Col md={6} />
            <Col md={6}>
              <Field type="select" label="Задание на ТС" error={errors.car_mission_id}
                disabled={IS_DISPLAY}
                options={MISSIONS}
                value={state.car_mission_id}
                onChange={this.handleChange.bind(this, 'car_mission_id')}
              /></Col>
          </Row>

          <Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors.route_id}
                disabled={IS_DISPLAY || !!!state.technical_operation_id}
                options={ROUTES}
                value={state.route_id}
                onChange={this.handleRouteIdChange.bind(this)}
              />
              <Div hidden={state.route_id}>
                <Button onClick={this.createNewRoute.bind(this)} disabled={IS_DISPLAY || !state.technical_operation_id}>Создать новый</Button>
              </Div>
            </Col>
            <Col md={6}>
              <Div hidden={this.state.selectedRoute === null} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer>
          <Div className="inline-block" >
            <Button onClick={this.props.onPrint} disabled={!this.props.canSave}>
              <Glyphicon glyph="download-alt" /> {state.status !== 'not_assigned' ? 'Просмотр' : 'Выдать'}</Button>
            <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{'Сохранить'}</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap element={route}
          onFormHide={this.onFormHide.bind(this)}
          showForm={this.state.showRouteForm}
          fromMission
        />
      </Modal>
    );
  }
}

export default connectToStores(DutyMissionForm, ['objects', 'employees', 'missions', 'routes', 'geoObjects']);
