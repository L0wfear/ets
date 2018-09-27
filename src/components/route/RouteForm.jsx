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

const makeName = ({ number, name, object_list, draw_odh_list }, { fromMission }) => {
  if (number === null) {
    return name;
  }

  const list = [];
  if (object_list) {
    list.push(...object_list);
  }

  if (draw_odh_list) {
    list.push(...draw_odh_list);
  }

  const [first, ...other] = list;
  const [last] = other.slice(-1);

  let generateName = `Маршрут №${number}`;

  if (fromMission) {
    generateName = `${generateName}-А`;
  }

  if (first && first.name) {
    if (last && last.name) {
      generateName = `${generateName} от ${first.name} до ${last.name}`;
    } else {
      generateName = `${generateName} до ${first.name}`;
    }
  }

  return generateName;
};

@connectToStores(['objects', 'geoObjects'])
@autobind
export default class RouteForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      ROUTE_TYPE_OPTIONS: [],
    };
    this.handleClickSelectFromODH = this.handleClickSelectFromODH.bind(this);
  }

  componentDidUpdate(prevProps) {
    const name = makeName(this.props.formState, this.props);

    // todo тригерить на изменения зависимых значений
    if (name !== prevProps.formState.name) {
      this.handleChange('name', name);
    }
  }

  handleTypeChange(type) {
    if (type !== this.props.formState.type) {
      this.setState({ vector: false });
      this.handleChange('type', type);
      this.props.updateFromStatePolys({ ...this.props.formState, type });
      this.props.resetState();
    }
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
      const type = route_type_options[0].value;
      this.handleChange('type', type);
      this.props.resetState();
      this.props.updateFromStatePolys({ ...this.props.formState, type }, false);
    } else {
      this.props.updateFromStatePolys({ ...this.props.formState }, true);
    }

    this.setState({ ...changeStateObj });
  }

  handleTechChange(v) {
    if (v !== this.props.formState.technical_operation_id) {
      this.handleChange('technical_operation_id', v);

      this.setState({ vector: false });
      this.handleChange('municipal_facility_id', null);
      this.handleChange('type', null);

      if (!this.props.formState.copy) {
        this.handleChange('input_lines', []);
        this.handleChange('draw_object_list', []);
      }
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

  toggleIsMain = () => this.handleChange('is_main', !this.props.formState.is_main);

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
              <div>
                <b>{'Название маршрута '}</b>{state.number !== null ? state.name.replace(/\{\{number\}\}/, '-') : state.name}
              </div>
            </Col>
          </Row>
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
                    id={'municipal_facility_id'}
                    label={'municipal_facility_name'}
                    errors={errors}
                    state={state}
                    disabled={!!this.props.fromMission || !!state.id}
                    handleChange={this.handleChange}
                    getDataByNormId={this.getDataByNormId}
                    clearable={false}
                    technicalOperationsList={technicalOperationsList}
                    getNormIdFromState={this.props.fromMission}
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
            <Col md={STRUCTURE_FIELD_VIEW ? 2 : 3}>
              <ExtField
                id="comment"
                type="string"
                label="Примечание"
                value={state.comment}
                onChange={this.handleChange}
                boundKeys={boundKeys.comment}
                />
            </Col>
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
