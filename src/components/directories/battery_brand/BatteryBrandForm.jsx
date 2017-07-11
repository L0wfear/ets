import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';

@connectToStores(['autobase'])
export default class BatteryBrandForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { batteryManufacturerList = [], isPermitted = false } = this.props;
    const BATTERY_MANUFACTURER = batteryManufacturerList.map(({ id, name }) => ({ value: id, label: name }));

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
              <Field
                type="string"
                label="Марка аккумулятора"
                value={state.name}
                error={errors.name}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'name')}
              />
            </Col>
            <Col md={6}>
              <Field
                type="select"
                label="Производитель аккумулятора"
                options={BATTERY_MANUFACTURER}
                value={state.manufacturer_id}
                error={errors.manufacturer_id}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'manufacturer_id')}
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
