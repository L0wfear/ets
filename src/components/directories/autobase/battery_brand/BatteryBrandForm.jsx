import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

@connectToStores(['autobase'])
export default class BatteryBrandForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { batteryManufacturerList = [], isPermitted = false } = this.props;
    const BATTERY_MANUFACTURER = batteryManufacturerList.map(defaultSelectListMapper);

    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Марка аккумулятора"
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
                label="Производитель аккумулятора"
                options={BATTERY_MANUFACTURER}
                value={state.manufacturer_id}
                error={errors.manufacturer_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['manufacturer_id']}
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
