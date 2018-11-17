import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import { ExtField } from 'components/ui/new/field/ExtField';
import Div from 'components/ui/Div';
import Form from 'components/compositions/Form';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';

const seasonsList = [{ id: 1, name: 'Лето' }, { id: 2, name: 'Зима' }, { id: 3, name: 'Всесезон' }];
const boundKeysObj = {
  check_types: ['check_types'],
};

@connectToStores(['objects', 'employees', 'missions', 'routes'])
export default class TechnicalOperationForm extends Form {

  handleCarFuncTypesChange = (v) => {
    const data = v.map((d) => Number(d));

    const { typesList = [] } = this.props;

    const types = data.map((d) => typesList.find(({ asuods_id }) => d === asuods_id)).map((d) => ({
      ...d,
      id: d.asuods_id,
    }));
    this.props.handleFormChange('car_func_types', types);
  }

  handleObjectsChange(arrayOfObjects) {
    const objects = this.props.technicalOperationsObjectsList.filter(obj => arrayOfObjects.includes(obj.id));
    this.props.handleFormChange('objects', objects);
  }
  handleChangeSensorTypeIds = (sensor_type_ids) => {
    this.props.handleFormChange('sensor_type_ids', sensor_type_ids || []);
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getWorkKinds();
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('technicalOperation').getTechnicalOperationsTypes();
    flux.getActions('objects').getSensorTypes();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const title = 'Тех. операция';
    const {
      typesList = [],
      technicalOperationsObjectsList = [],
      technicalOperationsTypesList = [],
    } = this.props;
    const isPermittedOuter = true;
    const isPermitted = false;

    const SEASONS = seasonsList.map(defaultSelectListMapper);
    const CAR_TYPES = typesList.map(({ asuods_id, full_name }) => ({ value: asuods_id, label: full_name }));
    const TECHNICAL_OPERATION_OBJECTS = technicalOperationsObjectsList
                                        .map(({ id, full_name }) => ({ value: id, label: full_name }));
    const TECHNICAL_OPERATION_TYPES = technicalOperationsTypesList.map(({ name, key }) => ({ value: key, label: name }));
    const CONDITIONS = state.period_interval_name ? `${state.norm_period} в ${state.period_interval_name}` : state.norm_period;
    const SENSORS_TYPE_OPTIONS = this.props.sensorTypesList.map(defaultSelectListMapper);

    return (
      <Modal id="modal-technical-operation" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>

            <Col md={3}>
              <ExtField
                type="string"
                label="Наименование"
                value={state.name}
                onChange={this.handleChange}
                boundKeys={['name']}
                disabled={!isPermitted}
                error={errors.name}
              />
            </Col>

            <Col md={3}>
              <ExtField
                type="string"
                label="Элемент"
                value={state.elements_text}
                onChange={this.handleChange}
                boundKeys={['elements_text']}
                error={errors.elements_text}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <ExtField
                type="select"
                label="Сезон"
                value={state.season_id}
                options={SEASONS}
                onChange={this.handleChange}
                boundKeys={['season_id']}
                error={errors.season_id}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="string"
                label="Способ выполнения"
                value={state.kind_task_names}
                onChange={this.handleChange}
                boundKeys={['kind_task_names']}
                error={errors.kind_task_names}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <ExtField
                type="string"
                label="Способ уборки"
                value={state.work_type_name}
                onChange={this.handleChange}
                boundKeys={['work_type_name']}
                error={errors.work_type_name}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <ExtField
                type="string"
                label="Условия"
                value={state.conditions}
                onChange={this.handleChange}
                boundKeys={['conditions']}
                error={errors.conditions}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <ExtField
                type="string"
                label="Число операций в сутки (норматив)"
                value={CONDITIONS}
                onChange={this.handleChange}
                boundKeys={['norm_period']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                label="Тип проверки"
                type="select"
                multi
                options={TECHNICAL_OPERATION_TYPES}
                value={state.check_types}
                onChange={this.handleChange}
                boundKeys={boundKeysObj.check_types}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="select"
                label="Объект"
                multi
                value={state.objects.map(cft => cft.id)}
                options={TECHNICAL_OPERATION_OBJECTS}
                onChange={this.handleObjectsChange}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <ExtField
                type="boolean"
                label="Учёт в отчетах"
                checked={!!state.use_in_reports}
                onChange={this.handleChange}
                boundKeys={['use_in_reports', !state.use_in_reports]}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3} className="vehicle-types-container">
              <ExtField
                type="select"
                label="Типы ТС"
                multi
                value={_.uniq(state.car_func_types.map(cft => cft.asuods_id)).join(',')}
                options={CAR_TYPES}
                onChange={this.handleCarFuncTypesChange}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3} className="vehicle-types-container">
              <ExtField
                type="select"
                label="Типы навесного оборудования"
                multi
                value={state.sensor_type_ids}
                options={SENSORS_TYPE_OPTIONS}
                onChange={this.handleChangeSensorTypeIds}
                disabled={!isPermittedOuter}
              />
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button disabled={!isPermittedOuter} onClick={this.handleSubmit}>Сохранить</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
