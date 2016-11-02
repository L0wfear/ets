import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['fuelRates', 'objects'])
export default class FuelRateForm extends Form {

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations();
    flux.getActions('objects').getModels();
    flux.getActions('objects').getSpecialModels();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { modelsList = [], operations = [], specialModelsList = [], isPermitted = false } = this.props;
    const MODELS = modelsList.map(m => ({ value: m.id, label: m.title }));
    const SPECIALMODELS = specialModelsList.map(m => ({ value: m.id, label: m.name }));
    const OPERATIONS = operations
      .map(op => ({ value: op.id, label: `${op.name}${op.equipment ? ' [спецоборудование]' : ''}` }))
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row>

            <Col md={6}>

              <Field
                label="Дата приказа"
                type="date"
                date={state.order_date}
                onChange={this.handleChange.bind(this, 'order_date')}
                time={false}
                error={errors.order_date}
                disabled={!isPermitted}
              />

              <Field
                label="Операция"
                error={errors.operation_id}
                type="select"
                options={OPERATIONS}
                clearable={false}
                value={state.operation_id}
                onChange={this.handleChange.bind(this, 'operation_id')}
                disabled={!isPermitted}
              />

              <Field
                label="Норма для летнего периода"
                type="number"
                error={errors.summer_rate}
                value={state.summer_rate}
                onChange={this.handleChange.bind(this, 'summer_rate')}
                disabled={!isPermitted}
              />

              <Field
                label="Норма для зимнего периода"
                type="number"
                error={errors.winter_rate}
                value={state.winter_rate}
                onChange={this.handleChange.bind(this, 'winter_rate')}
                disabled={!isPermitted}
              />

              <Field
                label="Модель ТС"
                error={errors.car_special_model_id}
                type="select"
                options={SPECIALMODELS}
                clearable={false}
                value={state.car_special_model_id}
                onChange={this.handleChange.bind(this, 'car_special_model_id')}
                disabled={!isPermitted}
              />

              <Field
                label="Марка шасси"
                error={errors.car_model_id}
                type="select"
                className="white-space-pre-wrap"
                options={MODELS}
                value={state.car_model_id}
                onChange={this.handleChange.bind(this, 'car_model_id')}
                disabled={!isPermitted}
              />

            </Col>

          </Row>

        </Modal.Body>

        <Modal.Footer>
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}
