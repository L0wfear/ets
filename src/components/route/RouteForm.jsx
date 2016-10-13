import React from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connectToStores } from 'utils/decorators';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';

@connectToStores(['objects'])
@autobind
export default class RouteForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      ROUTE_TYPE_OPTIONS: [
        { value: 'vector', label: 'Вручную' },
        { value: 'simple', label: 'Выбор из ОДХ' },
        { value: 'simple_dt', label: 'Выбор из ДТ' },
        { value: 'points', label: 'Выбор пунктов назначения' },
      ],
      routeTypeDisabled: true,
    };
  }

  handleTypeChange(v) {
    this.handleChange('type', v);
    this.props.resetState();
  }

  setRouteTypeOptionsBasedOnTechnicalOperation(technical_operation_id, technicalOperationsList = this.props.technicalOperationsList, routeTypeValue = null, resetState = true) {
    const technicalOperation = _.find(technicalOperationsList, o => o.id === technical_operation_id);

    const route_type_options = [];

    technicalOperation.objects.forEach((obj) => {
      switch (obj.name) {
        case 'ОДХ':
          route_type_options.push({ value: 'vector', label: 'Вручную' });
          route_type_options.push({ value: 'simple', label: 'Выбор из ОДХ' });
          if (!routeTypeValue) {
            routeTypeValue = 'simple';
          }
          break;
        case 'ПН':
          route_type_options.push({ value: 'points', label: 'Выбор пунктов назначения' });
          if (!routeTypeValue && routeTypeValue !== 'simple') {
            routeTypeValue = 'points';
          }
          break;
        case 'ДТ':
          route_type_options.push({ value: 'simple_dt', label: 'Выбор из ДТ' });
          if (!routeTypeValue && routeTypeValue !== 'simple') {
            routeTypeValue = 'simple_dt';
          }
          break;
        default:
          break;
      }
    });

    this.setState({ ROUTE_TYPE_OPTIONS: route_type_options, routeTypeDisabled: !routeTypeValue });
    this.props.fromMission && this.handleTypeChange(routeTypeValue);
    this.props.handleFormChange('type', routeTypeValue);
    resetState && this.props.resetState();
  }

  handleTechChange(v) {
    this.handleChange('technical_operation_id', v);
    if (!this.props.formState.copy) {
      this.setRouteTypeOptionsBasedOnTechnicalOperation(v);
    }
  }

  async getTechnicalOperationsByType(type) {
    const { flux } = this.context;

    const technicalOperationsList = await flux.getActions('technicalOperation').getTechnicalOperationsByObjectsType(type);
    this.setState({ technicalOperationsList });
  }

  async componentDidMount() {
    const { flux } = this.context;
    const { formState } = this.props;
    const technicalOperationsResponse = await flux.getActions('technicalOperation').getTechnicalOperations();
    let technicalOperationsList = technicalOperationsResponse.result;

    if (formState.technical_operation_id && !formState.copy) {
      this.setRouteTypeOptionsBasedOnTechnicalOperation(formState.technical_operation_id, technicalOperationsList, formState.type, false);
    }

    const OBJECTS_BY_TYPE = {
      points: 3,
      simple_dt: 2,
    };

    const getObjectIdByType = type => OBJECTS_BY_TYPE[type] || 1;

    // this.getTechnicalOperationsByType(formState.type);
    if (formState.copy) {
      technicalOperationsList = technicalOperationsList.filter((to) => {
        return to.objects.find(o => o.id === getObjectIdByType(formState.type));
      });
    }

    this.setState({ technicalOperationsList });
  }

  handleSubmit(isTemplate) {
    this.props.onSubmit(isTemplate);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { ROUTE_TYPE_OPTIONS, technicalOperationsList = [] } = this.state;
    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));

    const title = state.id ? 'Изменение маршрута' : 'Создание нового маршрута';

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row>
            <Col md={4}>
              <Field type="string" label="Название маршрута" value={state.name} onChange={v => this.handleChange('name', v)} error={errors.name} />
            </Col>

            <Div hidden={this.props.forceTechnicalOperation}>
              <Col md={4}>
                <Field
                  type="select"
                  label="Технологическая операция"
                  options={TECH_OPERATIONS}
                  value={state.technical_operation_id}
                  onChange={this.handleTechChange}
                  disabled={this.props.fromMission}
                  clearable={false}
                  error={errors.technical_operation_id}
                />
              </Col>
            </Div>

            <Div hidden={this.props.forceRouteType}>
              <Col md={4}>
                <Field
                  type="select"
                  label="Способ построения маршрута"
                  options={ROUTE_TYPE_OPTIONS}
                  value={state.type}
                  clearable={false}
                  disabled={this.state.routeTypeDisabled || !!state.id || state.copy}
                  onChange={this.handleTypeChange}
                />
              </Col>
            </Div>
          </Row>

          <Row className={'routes-form-map-wrapper'}>
            <Col md={12}>
              <Div hidden={state.type !== 'simple' && state.type !== 'simple_dt'}>
                <RouteCreating route={state} onChange={this.handleChange} />
              </Div>
              <Div hidden={state.type !== 'vector' && state.type !== 'points'}>
                <RouteCreating route={state} manual onChange={this.handleChange} />
              </Div>
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer>
          {this.props.fromMission ?
            <div>
              <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this, 1)}>Сохранить как шаблон</Button>
              <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this, 0)}>Сохранить</Button>
            </div>
          :
            <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this, 1)}>Сохранить</Button>
          }
        </Modal.Footer>

      </Modal>
    );
  }
}
