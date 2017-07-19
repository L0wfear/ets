import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import { onChangeWithKeys } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import BatteryToVehicleBlockComponent from './vehicle-block/BatteryToVehicleBlock';

const BatteryVehicleBlock = onChangeWithKeys(BatteryToVehicleBlockComponent);

@connectToStores(['objects'])
export default class BaseBatteryForm extends Form {
  state = {
    canSave: true,
  };

  async componentDidMount() {
    const { flux } = this.context;

    const batteryBrand = await flux.getActions('autobase').getAutobaseListByType('batteryBrand');
    const batteryBrandList = batteryBrand.data.result.rows;

    this.setState({ batteryBrandList });
  }

  handleBatteryToCarValidity = ({ isValidInput }) => {
    this.setState({
      canSave: isValidInput,
    });
  }

  onChageWrap = name => (...arg) => this.handleChange(name, ...arg);

  getDataForOption(value, label, error, OPTION, name) {
    return {
      label,
      value,
      error,
      type: 'select',
      options: OPTION,
      emptyValue: null,
      onChange: this.onChageWrap(name),
    };
  }

  getDataForDisabledData(value, label) {
    return {
      label,
      value,
      type: 'string',
      emptyValue: null,
      disabled: true,
    };
  }

  getDataOrigin(state, fields, errors, whatLook) {
    return whatLook.map(el => (
      {
        type: fields[el].type,
        label: fields[el].displayName,
        value: state[el],
        error: errors[el],
        onChange: this.onChageWrap(el),
      }
    ));
  }

  getDataForDate(state, fields, errors, whatLook) {
    return whatLook.map(el => ({
      type: fields[el].type,
      label: fields[el].displayName,
      date: state[el],
      time: false,
      error: errors[el],
      onChange: this.onChageWrap(el),
    }));
  }

  render() {
    const { batteryBrandList = [] } = this.state;
    const { organizations = [] } = this.props;
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const fields = this.props.cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});

    const BATTERY_BRAND_OPTION = batteryBrandList.map(el => ({ value: el.id, label: el.name, manufacturer_id: el.manufacturer_id }));
    if (BATTERY_BRAND_OPTION.length === 0) {
      BATTERY_BRAND_OPTION.push({ value: state.brand_id, label: '', manufacturer_id: '' });
    }
    const BATTERY_BRAND_MANUFACTURER_OPTION = batteryBrandList.reduce((obj, el) => Object.assign(obj, { [el.id]: el.manufacturer_name }), {});
    const ORGANIZATIONS_OPTION = organizations.map(el => ({ value: el.company_id, label: el.company_name }));

    const companies = this.getDataForOption(state.company_id, 'Организация', errors.company_id, ORGANIZATIONS_OPTION, 'company_id');
    const batteryBrand = this.getDataForOption(state.brand_id, fields.brand_name.displayName, errors.brand_id, BATTERY_BRAND_OPTION, 'brand_id');
    const batteryManifactoryName = this.getDataForDisabledData(BATTERY_BRAND_MANUFACTURER_OPTION[state.brand_id], fields.manufacturer_name.displayName);
    const dataForForm = this.getDataOrigin(state, fields, errors, ['serial_number', 'lifetime_months']);
    const dateRelase = this.getDataForDate(state, fields, errors, ['released_at']);

    // TODO исправить Количество месяцев наработки
    const countMonthWork = this.getDataForDisabledData('----', 'Количество месяцев наработки');

    const show = [
      companies,
      batteryBrand,
      batteryManifactoryName,
      ...dataForForm,
      ...dateRelase,
      countMonthWork,
    ];

    const IS_CREATING = !!!state.id;

    let title = 'Изменение существующего аккумулятора';
    if (IS_CREATING) title = 'Добавление нового аккумулятора';
    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
          <Row>
            {
              show.map((oneRow, i) => (
                <Col key={i} md={12}>
                  <Field
                    {...oneRow}
                  />
                </Col>
              ))
            }
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
