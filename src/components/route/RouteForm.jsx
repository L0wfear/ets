import React from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import { connectToStores } from 'utils/decorators';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';

@connectToStores(['objects'])
@autobind
export default class RouteForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      ROUTE_TYPE_OPTIONS: [
        { value: 'mixed', label: 'Выбор из ОДХ' },
        { value: 'simple_dt', label: 'Выбор из ДТ' },
        { value: 'points', label: 'Выбор пунктов назначения' },
      ],
      routeTypeDisabled: true,
    };
    this.handleClickSelectFromODH = this.handleClickSelectFromODH.bind(this);
  }

  handleTypeChange(v) {
    this.setState({ vector: false });
    this.handleChange('type', v);
    this.props.resetState();
  }

  setRouteTypeOptionsBasedOnTechnicalOperation(technical_operation_id, technicalOperationsList = this.props.technicalOperationsList, routeTypeValue = null, resetState = true) {
    const technicalOperation = _.find(technicalOperationsList, o => o.id === technical_operation_id);

    const route_type_options = [];

    technicalOperation.objects.forEach((obj) => {
      switch (obj.name) {
        case 'ОДХ':
          route_type_options.push({ value: 'mixed', label: 'Выбор из ОДХ' });
          if (!routeTypeValue) {
            routeTypeValue = 'mixed';
          }
          break;
        case 'ПН':
          route_type_options.push({ value: 'points', label: 'Выбор пунктов назначения' });
          if (!routeTypeValue && routeTypeValue !== 'mixed') {
            routeTypeValue = 'points';
          }
          break;
        case 'ДТ':
          route_type_options.push({ value: 'simple_dt', label: 'Выбор из ДТ' });
          if (!routeTypeValue && routeTypeValue !== 'mixed') {
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
    this.handleChange('input_lines', []);
    this.handleChange('draw_object_list', []);

    this.setState({
      vector: false,
    });
    if (!this.props.formState.copy) {
      this.setRouteTypeOptionsBasedOnTechnicalOperation(v);
    }
  }

  handleClickSelectFromODH() {
    this.setState({ vector: false });
    this.handleChange('input_lines', []);
  }

  async getTechnicalOperationsByType(type) {
    const { flux } = this.context;

    const technicalOperationsList = await flux.getActions('technicalOperation').getTechnicalOperationsByObjectsType(type);
    this.setState({ technicalOperationsList });
  }

  async componentDidMount() {
    const { flux } = this.context;
    const { formState } = this.props;
    const technicalOperationsResponse = await flux.getActions('technicalOperation').getTechnicalOperations(true);
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
      technicalOperationsList = technicalOperationsList.filter(to =>
         to.objects.find(o => o.id === getObjectIdByType(formState.type))
      );
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

    const title = state.id ? 'Изменение маршрута' : 'Создание нового маршрута';
    const canSave = this.props.canSave && ((!!state.object_list && state.object_list.length) || (!!state.input_lines && state.input_lines.length));

    return (
      <Modal {...this.props} id="modal-route" bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 3 : 4}>
              <Field
                id="route-name"
                type="string"
                label="Название маршрута"
                value={state.name}
                onChange={v => this.handleChange('name', v)}
                error={errors.name}
              />
            </Col>

            <Div hidden={this.props.forceTechnicalOperation}>
              <Col md={STRUCTURE_FIELD_VIEW ? 3 : 4}>
                <Field
                  id="route-technical-operation-id"
                  type="select"
                  label="Технологическая операция"
                  options={TECH_OPERATIONS}
                  value={state.technical_operation_id}
                  onChange={this.handleTechChange}
                  disabled={this.props.fromMission || state.id}
                  clearable={false}
                  error={errors.technical_operation_id}
                />
              </Col>
            </Div>
            <Div hidden={!STRUCTURE_FIELD_VIEW}>
              <Col md={3}>
                <Field
                  id="route-structure-id"
                  type="select"
                  label="Подразделение"
                  error={errors.structure_id}
                  disabled={STRUCTURE_FIELD_READONLY || (this.props.fromMission && this.props.structureId)}
                  clearable={STRUCTURE_FIELD_DELETABLE}
                  options={STRUCTURES}
                  emptyValue={null}
                  value={state.structure_id}
                  onChange={this.handleChange.bind(this, 'structure_id')}
                />
              </Col>
            </Div>
            <Div hidden={this.props.forceRouteType}>
              <Col md={STRUCTURE_FIELD_VIEW ? 3 : 4}>
                <Field
                  id="type"
                  type="select"
                  label="Способ построения маршрута"
                  options={ROUTE_TYPE_OPTIONS}
                  value={state.type !== 'mixed' ? state.type : 'mixed'}
                  clearable={false}
                  disabled={this.state.routeTypeDisabled || state.copy}
                  onChange={this.handleTypeChange}
                />
              </Col>
            </Div>
          </Row>

          <Row className={'routes-form-map-wrapper'}>
            <Div hidden={!state.type}>
              <Col md={12}>
                <Div hidden={state.type !== 'mixed'} className="vector-toggle">
                  <Button
                    id="manual"
                    onClick={() => this.setState({ vector: true })}
                    className={this.state.vector && 'active'}
                  >
                    Вручную
                  </Button>
                  <Button
                    id="select-from-odh"
                    onClick={this.handleClickSelectFromODH}
                    className={!this.state.vector && 'active'}
                  >
                    Выбор из ОДХ
                  </Button>
                </Div>
                <RouteCreating
                  route={state}
                  manual={this.state.vector || state.type === 'points'}
                  onChange={this.handleChange}
                />
              </Col>
            </Div>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <div>
            <Button id="route-submit-tempalte" disabled={!canSave} onClick={this.handleSubmit.bind(this, 1)}>Сохранить как шаблон</Button>
            {this.props.fromMission && <Button id="route-submit" disabled={!canSave} onClick={this.handleSubmit.bind(this, 0)}>{state.id ? 'Сохранить' : 'Создать'}</Button>}
          </div>
        </Modal.Footer>

      </Modal>
    );
  }
}
