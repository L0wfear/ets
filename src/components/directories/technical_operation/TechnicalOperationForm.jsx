import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field, { ExtField } from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';

const seasonsList = [{ id: 1, name: 'Лето' }, { id: 2, name: 'Зима' }, { id: 3, name: 'Всесезон' }];

@connectToStores(['objects', 'employees', 'missions', 'routes'])
export default class TechnicalOperationForm extends Form {

  handleCarFuncTypesChange = (v) => {
    const data = v.map(d => +d);

    const { typesList = [] } = this.props;

    // не спрашивайте почему нельзя было сразу прислать поле asuods_id, не id а
    // я не знаю
    const types = data.map(d => typesList.find(({ asuods_id }) => d === asuods_id)).map(d => ({
      ...d,
      id: d.asuods_id,
    }));
    this.props.handleFormChange('car_func_types', types);
  }

  handleObjectsChange(arrayOfObjects) {
    const objects = this.props.technicalOperationsObjectsList.filter((obj) => arrayOfObjects.includes(obj.id));
    this.props.handleFormChange('objects', objects);
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getWorkKinds();
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('technicalOperation').getTechnicalOperationsTypes();
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
    const isPermitted = false;

    const SEASONS = seasonsList.map(defaultSelectListMapper);
    const ELEMENTS = state.elements.map(defaultSelectListMapper);
    const CAR_TYPES = typesList.map(({ asuods_id, full_name }) => ({ value: asuods_id, label: full_name }));
    const TECHNICAL_OPERATION_OBJECTS = technicalOperationsObjectsList
                                        .map(({ id, full_name }) => ({ value: id, label: full_name }));
    const TECHNICAL_OPERATION_TYPES = technicalOperationsTypesList.map(({ name, key }) => ({ value: key, label: name }));
    const CONDITIONS = state.period_interval_name ? `${state.norm_period} в ${state.period_interval_name}` : state.norm_period;

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
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
                type="select"
                label="Элемент"
                options={ELEMENTS}
                value={state.elements_text}
                onChange={this.handleChange}
                boundKeys={['elements_text']}
                error={errors.elements_text}
                disabled={!isPermitted}
                clearable={true}
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
                label="Способ уборки"
                value={state.work_type_name}
                onChange={this.handleChange}
                boundKeys={['work_type_name']}
                error={errors.work_type_name}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>

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
                hidden
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="number"
                label="Максимальная скорость"
                value={state.max_speed}
                onChange={this.handleChange}
                boundKeys={['max_speed']}
                error={errors.max_speed}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="select"
                label="Тип проверки"
                options={TECHNICAL_OPERATION_TYPES}
                value={state.check_type}
                onChange={this.handleChange}
                boundKeys={['check_type']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Field
                type="select"
                label="Объект"
                multi
                value={state.objects.map(cft => cft.id)}
                options={TECHNICAL_OPERATION_OBJECTS}
                onChange={this.handleObjectsChange.bind(this)}
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
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button disabled={!isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
