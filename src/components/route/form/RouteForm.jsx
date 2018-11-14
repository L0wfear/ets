import React from 'react';
import {
  find,
  union,
} from 'lodash';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/new/field/ExtField';
import Div from 'components/ui/Div';
import { connectToStores } from 'utils/decorators';
import RouteCreating from 'components/route/form/RouteCreating';
import Form from 'components/compositions/Form';

import MunicipalFacility from 'components/route/form/inside_fields/MunicipalFacility';

const initial_ROUTE_TYPES_OPTIONS = [
  { value: 'mixed', label: 'Выбор из ОДХ' },
  { value: 'simple_dt', label: 'Выбор из ДТ' },
  { value: 'points', label: 'Выбор пунктов назначения' },
];

const boundKeys = {
  name: ['name'],
  structure_id: ['structure_id'],
  comment: ['comment'],
};

@connectToStores(['objects', 'geoObjects'])
export default class RouteForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      ROUTE_TYPE_OPTIONS: [],
    };
    this.handleClickSelectFromODH = this.handleClickSelectFromODH.bind(this);
  }

  handleTypeChange = (type) => {
    if (type && type !== this.props.formState.type) {
      this.setState({ vector: false });
      this.handleChange('type', type);
      this.props.updateFromStatePolys({ ...this.props.formState, type });
      this.props.resetState();
    }
  }

  changeRouteTypesAvailable = (route_types_out) => {
    if (this.props.formState.copy) {
      if (route_types_out.length) {
        this.props.updateFromStatePolys(this.props.formState, true);
      }
      return;
    }
    let route_types = union([...route_types_out]);
    const route_type_options = [];

    // C текущего момента это спорный вопрос
    // Здесь тоже появилась проверка на доступные типы объектов
    // Нужно чекнуть надо ли это
    if (!!this.props.fromMission && !!this.props.notTemplate) {
      route_types = route_types.filter(name => this.props.available_route_types.includes(name));
    }

    const { formState: { type: routeTypeValue } } = this.props;
    let hasOldTypeInNew = false;

    route_types.forEach((obj) => {
      switch (obj) {
        case 'mixed':
          route_type_options.push({ value: 'mixed', label: 'ОДХ' });
          hasOldTypeInNew = hasOldTypeInNew || routeTypeValue === 'mixed';
          break;
        case 'points':
          route_type_options.push({ value: 'points', label: 'Пункты назначения' });
          hasOldTypeInNew = hasOldTypeInNew || routeTypeValue === 'points';
          break;
        case 'simple_dt':
          route_type_options.push({ value: 'simple_dt', label: 'ДТ' });
          hasOldTypeInNew = hasOldTypeInNew || routeTypeValue === 'simple_dt';
          break;
        default:
          break;
      }
    });

    const changeStateObj = {
      ROUTE_TYPE_OPTIONS: route_type_options,
    };

    if (!hasOldTypeInNew) {
      changeStateObj.vector = false;
      const type = route_type_options[0] ? route_type_options[0].value : null;
      this.handleChange('type', type);
      this.props.resetState();
      this.props.updateFromStatePolys({ ...this.props.formState, type }, false);
    } else {
      this.props.updateFromStatePolys({ ...this.props.formState }, true);
    }

    this.setState({ ...changeStateObj });
  }

  handleTechChange = (v) => {
    if (v && v !== this.props.formState.technical_operation_id) {
      this.handleChange('technical_operation_id', v);

      this.setState({ vector: false });
    }
  }

  handleClickSelectFromODH = () => {
    this.setState({ vector: false });
  }

  componentDidMount() {
    const { formState } = this.props;

    this.context.flux.getActions('technicalOperation').getTechnicalOperations()
      .then(({ result: technicalOperationsList }) => {
        const changesState = { technicalOperationsList };

        if (formState.copy) {
          console.log('here', changesState.technicalOperationsList)
          changesState.technicalOperationsList = changesState.technicalOperationsList
            .filter(to => (
              to.route_types.some(type => (
                type === formState.type
              ))
            ));
        }

        this.setState(changesState);
      });
  }

  handleSubmit = (isTemplate) => {
    this.props.onSubmit(isTemplate);
  }

  handleSaveAsTemplate = () => this.handleSubmit(1);
  handleSubmitForMission = () => this.handleSubmit(0);

  toggleIsMain = () => this.handleChange('is_main', !this.props.formState.is_main);

  getDataBySelectedMunicipalFacility = ({ route_types }) => {
    this.changeRouteTypesAvailable(route_types);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { ROUTE_TYPE_OPTIONS: [...ROUTE_TYPE_OPTIONS], technicalOperationsList = [] } = this.state;

    let TECH_OPERATIONS = technicalOperationsList.map(({ id, name, is_new }) => ({ value: id, label: name, is_new }));
    if (!state.id) {
      TECH_OPERATIONS = TECH_OPERATIONS.filter(({ is_new }) => !!is_new);
    }
    if (state.type && !ROUTE_TYPE_OPTIONS.find(({ value }) => value === state.type)) {
      ROUTE_TYPE_OPTIONS.push({
        value: state.type,
        label: (initial_ROUTE_TYPES_OPTIONS.find(({ value }) => value === state.type) || { label: 'Не найден тип' }).label,
        disabled: true,
      });
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

    return (
      <Modal id="modal-route" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={12}>
              <ExtField
                type="boolean"
                label="Основной маршрут"
                value={state.is_main}
                onChange={this.toggleIsMain}
                className="flex-reverse"
              />
            </Col>
          </Row>
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
                <Row>
                  <Col md={6} style={{ zIndex: 10001 }}>
                    <ExtField
                      id="route-technical-operation-id"
                      type="select"
                      label="Технологическая операция"
                      options={TECH_OPERATIONS}
                      value={state.technical_operation_id}
                      onChange={this.handleTechChange}
                      disabled={this.props.fromMission || !!state.id}
                      clearable={false}
                      error={errors.technical_operation_id}
                    />
                  </Col>
                  <Col md={6}>
                    <MunicipalFacility
                      id="municipal_facility_id"
                      error={errors.municipal_facility_id}
                      value={state.municipal_facility_id}
                      name={state.municipal_facility_name}
                      technical_operation_id={state.technical_operation_id}
                      type={state.type}
                      copy={state.copy}
                      disabled={!!this.props.fromMission || !!state.id}
                      handleChange={this.handleChange}
                      getDataBySelectedMunicipalFacility={this.getDataBySelectedMunicipalFacility}
                      clearable={false}
                      technicalOperationsList={technicalOperationsList}
                      getCleaningMunicipalFacilityList={this.context.flux.getActions('missions').getCleaningMunicipalFacilityList}
                    />
                  </Col>
                </Row>
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
            <Col md={2}>
              <ExtField
                id="type"
                type="select"
                label="Тип объекта"
                options={ROUTE_TYPE_OPTIONS}
                value={state.type}
                clearable={false}
                disabled={!state.municipal_facility_id || state.copy}
                onChange={this.handleTypeChange}
              />
            </Col>
          </Row>

          <Row className={'routes-form-map-wrapper'}>
            <Div hidden={!state.type || !state.municipal_facility_id}>
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
                  checkRoute={this.props.checkRoute}
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
