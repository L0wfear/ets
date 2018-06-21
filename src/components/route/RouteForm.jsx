import React from 'react';
import {
  find,
  union,
} from 'lodash';
import { autobind } from 'core-decorators';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import { connectToStores } from 'utils/decorators';
import RouteCreating from './RouteCreating.jsx';
import Form from '../compositions/Form.jsx';

import MunicipalFacility from './inside_fields/MunicipalFacility';

const OBJECTS_BY_TYPE = {
  points: 3,
  simple_dt: 2,
};

const getObjectIdByType = type => OBJECTS_BY_TYPE[type] || 1;

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

  handleTypeChange(type) {
    this.setState({ vector: false });
    this.handleChange('type', type);
    this.props.resetState();
  }

  changeRouteTypesAvailable(route_types_out) {
    let route_types = union([...route_types_out]);
    const route_type_options = [];

    // C текущего момента это спорный вопрос
    // Здесь тоже появилась проверка на доступные типы объектов
    // Нужно чекнуть надо ли это
    if (!!this.props.fromMission && !!this.props.notTemplate) {
      route_types = route_types.filter(name => this.props.available_route_types.includes(name));
    }

    const { formState: { type: routeTypeValue } } = this.props;
    let routeTypeValue_new = routeTypeValue;

    route_types.forEach((obj) => {
      switch (obj) {
        case 'mixed':
          route_type_options.push({ value: 'mixed', label: 'ОДХ' });
          if (!routeTypeValue_new) {
            routeTypeValue_new = 'mixed';
          }
          break;
        case 'points':
          route_type_options.push({ value: 'points', label: 'Пункты назначения' });
          if (!routeTypeValue_new && routeTypeValue !== 'mixed') {
            routeTypeValue_new = 'points';
          }
          break;
        case 'simple_dt':
          route_type_options.push({ value: 'simple_dt', label: 'ДТ' });
          if (!routeTypeValue_new && routeTypeValue_new !== 'mixed') {
            routeTypeValue_new = 'simple_dt';
          }
          break;
        default:
          break;
      }
    });

    let type;
    if (route_type_options.find(({ value }) => value === routeTypeValue_new)) {
      type = routeTypeValue_new;
    }
    if (route_type_options[0]) {
      type = route_type_options[0].value;
    }

    this.setState({ ROUTE_TYPE_OPTIONS: route_type_options, routeTypeDisabled: !routeTypeValue_new, vector: false });
    this.handleChange('type', type);

    if (type !== routeTypeValue) {
      this.props.resetState();
    }
  }

  handleTechChange(v) {
    this.handleChange('technical_operation_id', v);

    this.setState({ vector: false });
    this.handleChange('municipal_facility_id', null);

    if (!this.props.formState.copy) {
      this.handleChange('input_lines', []);
      this.handleChange('draw_object_list', []);
    }
  }

  handleClickSelectFromODH() {
    this.setState({ vector: false });
    this.handleChange('input_lines', []);
  }

  async componentDidMount() {
    const { formState } = this.props;

    this.context.flux.getActions('technicalOperation').getTechnicalOperations()
      .then(({ result: technicalOperationsList }) => {
        const changesState = { technicalOperationsList };

        if (formState.copy) {
          changesState.technicalOperationsList = changesState.technicalOperationsList.filter(to => to.objects.find(o => o.id === getObjectIdByType(formState.type)));
        }

        this.setState(changesState);
      });
  }

  handleSubmit(isTemplate) {
    this.props.onSubmit(isTemplate);
  }

  handleSaveAsTemplate = () => this.handleSubmit(1);
  handleSubmitForMission = () => this.handleSubmit(0);

  getDataByNormId = (data) => {
    if (!data) {
      this.handleChange('norm_id', data);
      return;
    }
    this.handleChange('norm_id', data.norm_id);

    this.changeRouteTypesAvailable(data.route_types);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { ROUTE_TYPE_OPTIONS, technicalOperationsList = [] } = this.state;

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
    const canSave = this.props.canSave && ((!!state.object_list && state.object_list.length) || (!!state.input_lines && state.input_lines.length));

    const boundKeys = {
      name: ['name'],
      structure_id: ['structure_id'],
    };
    return (
      <Modal id="modal-route" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 2 : 3}>
              <ExtField
                id="route-name"
                type="string"
                label="Название маршрута"
                value={state.name}
                onChange={this.handleChange}
                boundKeys={boundKeys.name}
                error={errors.name}
              />
            </Col>

            <Div hidden={this.props.forceTechnicalOperation}>
              <Col md={STRUCTURE_FIELD_VIEW ? 6 : 7}>
                <Col md={6} style={{ zIndex: 10001 }}>
                  <ExtField
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
                <Col md={6}>
                  <MunicipalFacility
                    id={'municipal_facility_id'}
                    label={'municipal_facility_name'}
                    errors={errors}
                    state={state}
                    disabled={this.props.fromMission || state.id}
                    handleChange={this.handleChange}
                    getDataByNormId={this.getDataByNormId}
                    clearable={false}
                    technicalOperationsList={technicalOperationsList}
                    getNormIdFromState={this.props.fromMission}
                  />
                </Col>
              </Col>
            </Div>
            <Div hidden={!STRUCTURE_FIELD_VIEW}>
              <Col md={2}>
                <ExtField
                  id="route-structure-id"
                  type="select"
                  label="Подразделение"
                  error={errors.structure_id}
                  disabled={STRUCTURE_FIELD_READONLY || (this.props.fromMission && this.props.structureId)}
                  clearable={STRUCTURE_FIELD_DELETABLE}
                  options={STRUCTURES}
                  emptyValue={null}
                  value={state.structure_id}
                  onChange={this.handleChange}
                  boundKeys={boundKeys.structure_id}
                />
              </Col>
            </Div>
            <Div hidden={this.props.forceRouteType}>
              <Col md={2}>
                <ExtField
                  id="type"
                  type="select"
                  label="Тип объекта"
                  options={ROUTE_TYPE_OPTIONS}
                  value={state.type !== 'mixed' ? state.type : 'mixed'}
                  clearable={false}
                  disabled={this.state.routeTypeDisabled || !state.municipal_facility_id || state.copy}
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
                  formErrors={errors}
                />
              </Col>
            </Div>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <div>
            <Button id="route-submit-tempalte" disabled={!canSave} onClick={this.handleSaveAsTemplate}>Сохранить как шаблон</Button>
            {this.props.fromMission && <Button id="route-submit" disabled={!canSave} onClick={this.handleSubmitForMission}>{state.id ? 'Сохранить' : 'Создать'}</Button>}
          </div>
        </Modal.Footer>

      </Modal>
    );
  }
}
