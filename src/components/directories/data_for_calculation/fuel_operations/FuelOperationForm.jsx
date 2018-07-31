import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

export default class FuelOperationForm extends Form {
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { isPermitted } = this.props;
    const MEASUREUNITS = this.props.measureUnitList.map(({ id, name }) => ({ value: id, label: name }));

    return (
      <Modal id="modal-fuel-operation" show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Добавление' : 'Изменение'} операции для расчета топлива</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Операция"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys={['name']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={12}>
              <ExtField
                type={'select'}
                label="Единица измерения"
                value={state.measure_unit_id}
                error={errors.measure_unit_id}
                options={MEASUREUNITS}
                onChange={this.handleChange}
                boundKeys={['measure_unit_id']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={12}>
              <label>Без учета пробега</label>
              <input
                type="checkbox"
                style={{ marginLeft: '10px' }}
                checked={!!state.is_excluding_mileage}
                onClick={this.handleChange.bind(this, 'is_excluding_mileage', !!!state.is_excluding_mileage)}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={12}>
              <label>Для спецоборудования</label>
              <input
                type="checkbox"
                style={{ marginLeft: '10px' }}
                checked={!!state.equipment}
                onClick={this.handleChange.bind(this, 'equipment', !!!state.equipment)}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || !isPermitted}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }

}
