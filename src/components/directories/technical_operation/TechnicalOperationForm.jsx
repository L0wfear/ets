import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import _ from 'lodash';

const seasonsList = [{ id: 1, name: 'Лето' }, { id: 2, name: 'Зима' }, { id: 3, name: 'Всесезон' }];

@connectToStores(['objects', 'employees', 'missions', 'routes'])
export default class TechnicalOperationForm extends Form {

  handleCarFuncTypesChange = (v) => {
    const data = v.split(',').map(d => +d);

    const { typesList = [] } = this.props;

    // не спрашивайте почему нельзя было сразу прислать поле asuods_id, не id а
    // я не знаю
    const types = data.map(d => typesList.find(({ asuods_id }) => d === asuods_id)).map(d => ({
      ...d,
      id: d.asuods_id,
    }));
    this.props.handleFormChange('car_func_types', types);
  }

  handleObjectsChange(v) {
    const data = v.split(',');
    const objects = this.props.technicalOperationsObjectsList.filter((obj) => data.includes(obj.id.toString()));
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
      workKindsList = [],
      typesList = [],
      technicalOperationsObjectsList = [],
      technicalOperationsTypesList = [],
    } = this.props;
    const isPermitted = false;

    const WORK_KINDS = workKindsList.map(({ id, name }) => ({ value: id, label: name }));
    const SEASONS = seasonsList.map(({ id, name }) => ({ value: id, label: name }));
    const CAR_TYPES = typesList.map(({ asuods_id, full_name }) => ({ value: asuods_id, label: full_name }));
    const TECHNICAL_OPERATION_OBJECTS = technicalOperationsObjectsList.map(({ id, full_name }) => ({ value: id, label: full_name }));
    const NEEDS_BRIGADE_OPTIONS = [{ value: 1, label: 'Да' }, { value: 0, label: 'Нет' }];
    const TECHNICAL_OPERATION_TYPES = technicalOperationsTypesList.map(({ name, key }) => ({ value: key, label: name }));

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={6}>
              <Field type="string" label="Наименование"
                value={state.name}
                onChange={this.handleChange.bind(this, 'name')}
                disabled={!isPermitted}
                error={errors[name]}
              />
            </Col>

            <Col md={3}>
              <Field type="select" label="Объект"
                multi
                value={state.objects.map(cft => cft.id).join(',')}
                options={TECHNICAL_OPERATION_OBJECTS}
                onChange={this.handleObjectsChange.bind(this)}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <Field
                type="select"
                label="Сезон"
                value={state.season_id}
                options={SEASONS}
                onChange={this.handleChange.bind(this, 'season_id')}
                error={errors[name]}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Field type="select" label="Вид работ"
                options={WORK_KINDS}
                value={state.work_kind_id}
                onChange={this.handleChange.bind(this, 'work_kind_id')}
                error={errors[name]}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={2}>
              <Field type="select" label="C участием РКУ"
                options={NEEDS_BRIGADE_OPTIONS}
                value={+state.needs_brigade}
                onChange={this.handleChange.bind(this, 'needs_brigade')}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={2}>
              <Field type="number" label="Максимальная скорость"
                value={state.max_speed}
                onChange={this.handleChange.bind(this, 'max_speed')}
                error={errors[name]}
                disabled={!isPermitted}
              />
            </Col>

            <Col md={3}>
              <Field type="select" label="Тип проверки"
                options={TECHNICAL_OPERATION_TYPES}
                value={state.check_type}
                clearable={false}
                onChange={this.handleChange.bind(this, 'check_type')}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={2}>
              <Field type="select" label="Учитывать в отчетах"
                options={NEEDS_BRIGADE_OPTIONS}
                value={+state.use_in_reports}
                onChange={this.handleChange.bind(this, 'use_in_reports')}
                disabled={!isPermitted}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3} className="vehicle-types-container">
              <Field type="select" label="Типы ТС"
                multi
                value={_.uniq(state.car_func_types.map(cft => cft.id)).join(',')}
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
