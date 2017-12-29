import React from 'react';
import {
  find,
} from 'lodash';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import { connectToStores } from 'utils/decorators';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';

import MunicipalFacility from './inside_fields/MunicipalFacility';

@connectToStores(['objects', 'geoObjects'])
@autobind
export default class RouteForm extends Form {

  constructor(props) {
    super(props);
    const ROUTE_TYPE_OPTIONS = [
      { value: 'mixed', label: 'ОДХ' },
      { value: 'simple_dt', label: 'ДТ' },
      { value: 'points', label: 'Пункты назначения' },
    ];

    this.state = {
      ROUTE_TYPE_OPTIONS,
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
    const technicalOperation = find(technicalOperationsList, o => o.id === technical_operation_id);
    const route_type_options = [];
    let {
      route_types = [],
    } = technicalOperation;

    if (!!this.props.fromMission && !!this.props.notTemplate) {
      route_types = route_types.filter(name => this.props.available_route_types.includes(name));
    }

    route_types.forEach((obj) => {
      switch (obj) {
        case 'mixed':
          route_type_options.push({ value: 'mixed', label: 'ОДХ' });
          if (!routeTypeValue) {
            routeTypeValue = 'mixed';
          }
          break;
        case 'points':
          route_type_options.push({ value: 'points', label: 'Пункты назначения' });
          if (!routeTypeValue && routeTypeValue !== 'mixed') {
            routeTypeValue = 'points';
          }
          break;
        case 'simple_dt':
          route_type_options.push({ value: 'simple_dt', label: 'ДТ' });
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
    const { technicalOperationsList = [] } = this.state;

    this.setState({
      vector: false,
      route_types: technicalOperationsList.find(({ id }) => id === v).route_types,
    });
    this.handleChange('draw_object_list', []);
    if (!this.props.formState.copy) {
      this.setRouteTypeOptionsBasedOnTechnicalOperation(v);
    }
  }

  handleClickSelectFromODH() {
    this.setState({ vector: false });
    this.handleChange('draw_object_list', []);
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

  getDataByNormId = norm_id => this.handleChange('norm_id', norm_id);

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { ROUTE_TYPE_OPTIONS, technicalOperationsList: technicalOperationsListOr = [] } = this.state;
    const technicalOperationsList = technicalOperationsListOr.filter(({ is_new, norm_ids }) => !is_new || (is_new && !norm_ids.some(n => n === null)));

    let TECH_OPERATIONS = technicalOperationsList.map(({ id, name, is_new }) => ({ value: id, label: name, is_new }));
    if (!state.id) {
      TECH_OPERATIONS = TECH_OPERATIONS.filter(({ is_new }) => !!is_new);
    }
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

    const title = state.id ? 'Изменение маршрута' : 'Создание нового маршрута';
    const canSave = this.props.canSave && ((!!state.object_list && state.object_list.length) || (!!state.draw_object_list && state.draw_object_list.length));

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 2 : 3}>
              <Field type="string" label="Название маршрута" 
                     value={state.name} 
                     onChange={v => this.handleChange('name', v)} 
                     error={errors.name} />
            </Col>

            <Div hidden={this.props.forceTechnicalOperation}>
              <Col md={STRUCTURE_FIELD_VIEW ? 6 : 7}>
                <Col md={6} style={{ zIndex: 10001 }}>
                  <Field
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
                <Col md={6}>
                  <MunicipalFacility
                    id={'municipal_facility_id'}
                    errors={errors}
                    state={state}
                    disabled={this.props.fromMission || state.id}
                    handleChange={this.handleChange.bind(this)}
                    getDataByNormId={this.getDataByNormId}
                    clearable={false}
                    technicalOperationsList={technicalOperationsList}
                    getNormIdFromState={this.props.fromMission || state.id}
                  />
                </Col>
              </Col>
            </Div>
            <Div hidden={!STRUCTURE_FIELD_VIEW}>
              <Col md={2}>
                <Field
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
              <Col md={2}>
                <Field
                  type="select"
                  label="Тип объекта"
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
                    onClick={() => this.setState({ vector: true })}
                    className={this.state.vector && 'active'}
                  >
                    Вручную
                  </Button>
                  <Button
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
                  formErrors={errors}
                />
              </Col>
            </Div>
          </Row>

        </ModalBody>

        <Modal.Footer>
          {this.props.fromMission ?
            <div>
              <Button disabled={!canSave} onClick={this.handleSubmit.bind(this, 1)}>Сохранить как шаблон</Button>
              <Button disabled={!canSave} onClick={this.handleSubmit.bind(this, 0)}>{state.id ? 'Сохранить' : 'Создать'}</Button>
            </div>
            :
            <Button disabled={!canSave} onClick={this.handleSubmit.bind(this, 1)}>Сохранить как шаблон</Button>
          }
        </Modal.Footer>

      </Modal>
    );
  }
}
