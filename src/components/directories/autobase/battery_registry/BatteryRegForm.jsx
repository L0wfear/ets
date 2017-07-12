import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';


// TODO переделать DITETS-633

@connectToStores(['objects'])
export default class BaseBatteryForm extends Form {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { flux } = this.context;

    const batteryBrand = await flux.getActions('autobase').getAutobaseListByType('batteryBrand');
    const orgName = Array(4).fill(1).map((d, i) => d = `-- демо Организация ${i}`);

    const batteryBrandList = batteryBrand.data.result.rows;

    this.setState({ batteryBrandList, orgName });
  }

  onChageWrap = name => (...arg) => this.handleChange(name, ...arg);



  getNameOrg(value, label, error, ORG_NAME_OPTION) {
    return {
      label,
      value,
      error,
      type: 'select',
      options: ORG_NAME_OPTION,
      emptyValue: null,
      onChange: this.onChageWrap('name_org'),
    };
  }

  getBatteryBrand(value, label, error, BATTERY_BRAND_OPTION) {
    return {
      label,
      value,
      error,
      type: 'select',
      options: BATTERY_BRAND_OPTION,
      emptyValue: null,
      onChange: (...arg) => {
        const [battery_brand__name_id, second_arg] = arg;
        const { manufacturer_id, label } = second_arg[0].manufacturer_id;

        this.handleChange('battery_brand__name_id', battery_brand__name_id);
        this.handleChange('battery_brand__name', label);
        this.handleChange('battery__brand_id', manufacturer_id);
      },
    };
  }

  getBatteryManifactoryName(value, label) {
    return {
      label,
      value,
      type: 'string',
      emptyValue: null,
      disabled: true,
    };
  }

  getData(state, fields, errors) {
    const demo = ['battery__serial_number', 'battery__lifetime_months'].map(el => (
      {
        type: fields[el].type,
        label: fields[el].displayName,
        value: state[el],
        error: errors[el],
        onChange: this.onChageWrap(el),
      }
    ));
    return demo;
  }

  getDate(state, fields, errors, el) {
    return {
      type: fields[el].type,
      label: fields[el].displayName,
      date: state[el],
      time: false,
      error: errors[el],
      onChange: this.onChageWrap(el),
    };
  }


  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    console.log(errors, state)
    const fields = this.props.cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});

    const { orgName = [], batteryBrandList = [] } = this.state;

    const ORG_NAME_OPTION = orgName.map((el, i) => ({ value: i, label: el }));
    const BATTERY_BRAND_OPTION = batteryBrandList.map(el => ({ value: el.id, label: el.name, manufacturer_id: el.manufacturer_id }));
    const BATTERY_BRAND_MANUFACTURER_OPTION = batteryBrandList.reduce((obj, el) => Object.assign(obj, { [el.manufacturer_id]: el.manufacturer_name }), {});

    const nameOrg = this.getNameOrg(state.name_org, fields.name_org.displayName, errors.name_org, ORG_NAME_OPTION);
    const batteryBrand = this.getBatteryBrand(state.battery_brand__name, fields.battery_brand__name.displayName, errors.battery_brand__name, BATTERY_BRAND_OPTION);
    const batteryManifactoryName = this.getBatteryManifactoryName(BATTERY_BRAND_MANUFACTURER_OPTION[state.battery__brand_id], fields.battery_manufacturer__name.displayName);
    const dataForForm = this.getData(state, fields, errors);
    const dateRelase = this.getDate(state, fields, errors, 'battery__released_at');

    // TODO исправить Количество месяцев наработки
    const countMonthWork = {
      type: 'string',
      label: 'Количество месяцев наработки',
      value: '---',
      disabled: true,
    };

    const IS_CREATING = !!!state.id;

    let title = 'Изменение существующего аккумулятора';
    if (IS_CREATING) title = 'Добавление нового аккумулятора';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <Field
              {...nameOrg}
              />
            </Col>
          </Row>
          <Row >
            <Col md={12}>
              <Field
              {...batteryBrand}
              />
            </Col>
          </Row>
          <Row >
            <Col md={12}>
              <Field
              {...batteryManifactoryName}
              />
            </Col>
          </Row>
          {dataForForm.map((el, i) => (
            <Row key={i}>
              <Col md={12}>
                <Field
                  {...el}
                />
              </Col>
            </Row>
          ))}
          <Row >
            <Col md={12}>
              <Field
              {...dateRelase}
              />
            </Col>
          </Row>
          <Row >
            <Col md={12}>
              <Field
                {...countMonthWork}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={true} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
