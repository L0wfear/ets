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
  componentDidMount() {
    const { flux } = this.context;

    flux.getActions('autobase').getAutobaseListByType('batteryManufacturer', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
  }

  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const [
      state,
      errors,
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];

    const {
      AutobaseOptions: {
        batteryManufacturerOptions = [],
      },
      isPermitted = false,
    } = this.props;

    const IS_CREATING = !state.id;

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
                options={batteryManufacturerOptions}
                value={state.manufacturer_id}
                error={errors.manufacturer_id}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys={['manufacturer_id']}
                clearable={false}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
