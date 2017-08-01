import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { get } from 'lodash';

import { onChangeWithKeys } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import BatteryToVehicleBlockComponent from './vehicle-block/BatteryToVehicleBlock';

const BatteryVehicleBlock = onChangeWithKeys(BatteryToVehicleBlockComponent);

@connectToStores(['autobase'])
export default class BaseBatteryForm extends Form {
  state = {
    canSave: true,
  };

  handleBatteryToCarValidity = ({ isValidInput }) => this.setState({ canSave: isValidInput })

  render() {
    const {
      batteryBrandList = [],
      isPermitted = false,
      cols = [],
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});

    const BATTERY_BRAND_OPTION = batteryBrandList.map(el => ({ value: el.id, label: el.name, manufacturer_id: el.manufacturer_id }));

    const IS_CREATING = !state.id;

    let title = 'Изменение существующего аккумулятора';
    if (IS_CREATING) title = 'Добавление нового аккумулятора';

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type={'select'}
                label={fields.brand_id.displayName}
                value={state.brand_id}
                error={errors.brand_id}
                options={BATTERY_BRAND_OPTION}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['brand_id']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'string'}
                label={fields.manufacturer_id.displayName}
                value={get(batteryBrandList.find(s => s.id === state.brand_id), 'manufacturer_name', '')}
                emptyValue={null}
                disabled
              />
              <ExtField
                type={fields.serial_number.type}
                label={fields.serial_number.displayName}
                value={state.serial_number}
                error={errors.serial_number}
                onChange={this.handleChange}
                boundKeys={['serial_number']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.lifetime_months.type}
                label={`${fields.lifetime_months.displayName}, мес.`}
                value={state.lifetime_months}
                error={errors.lifetime_months}
                onChange={this.handleChange}
                boundKeys={['lifetime_months']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.released_at.type}
                label={fields.released_at.displayName}
                date={state.released_at}
                time={false}
                error={errors.released_at}
                onChange={this.handleChange}
                boundKeys={['released_at']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'string'}
                label={'Количество месяцев наработки'}
                value={state.worked_months}
                disabled
              />
              {!IS_CREATING &&
                <ExtDiv hidden={IS_CREATING}>
                  <Col md={12}>
                    <h4>Транспортное средство, на котором установлен аккумулятор</h4>
                    <BatteryVehicleBlock
                      onChange={this.handleChange}
                      boundKeys={['battery_to_car']}
                      inputList={state.battery_to_car || []}
                      onValidation={this.handleBatteryToCarValidity}
                      batteryId={state.id}
                    />
                  </Col>
                </ExtDiv>
              }
            </Col>
          </Row>
        </ExtDiv>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave || !this.state.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
