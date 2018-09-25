import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import Form from 'components/compositions/Form';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

@connectToStores(['autobase'])
export default class TireModelForm extends Form {
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { tireManufacturerList = [], isPermitted = false } = this.props;
    const TIRE_MANUFACTURER = tireManufacturerList.map(defaultSelectListMapper);
    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal id="modal-tire-model" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Марка шины"
                value={state.name}
                error={errors.name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['name']}
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="select"
                label="Производитель шины"
                options={TIRE_MANUFACTURER}
                value={state.tire_manufacturer_id}
                error={errors.tire_manufacturer_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['tire_manufacturer_id']}
                clearable={false}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
