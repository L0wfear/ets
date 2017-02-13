import React, { Component } from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

export default class FuelOperationForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {isPermitted} = this.props;

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{!state.id ? 'Добавление' : 'Изменение'} операции для расчета топлива</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={6}>
              <Field
                type="string"
                label="Операция"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange.bind(this, 'name')}
                disabled={!isPermitted}
              />

              <label>Для спецоборудования</label>
              <input type="checkbox"
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
