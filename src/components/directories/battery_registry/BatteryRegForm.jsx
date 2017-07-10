import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from '../../compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';

@connectToStores(['objects'])
export default class BaseBatteryForm extends Form {

  constructor(props) {
    super(props);
  }

  // wtf - Количество месяцев наработки
  // https://gost-jira.atlassian.net/wiki/pages/viewpage.action?pageId=91324941

  getData(state) {
    const whatShow = ['battery_brand__name', 'battery_manufacturer__name', 'battery__serial_number', 'battery__lifetime_months', 'battery__released_at'];

    const wh = this.props.cols.reduce( (obj,oneVal) => {
      if (whatShow.includes(oneVal.name)) {
        obj.push({
          type : oneVal.type,
          label: oneVal.displayName,
          value: state[oneVal.name],
          onChange: this.handleChange.bind(this, oneVal.name),
        });
      }
      return obj;
    }, [], this);
    return wh;
  }


  render() {
    const state = this.props.formState;

    const title = !!!state.battery__id ? 'Добавление нового аккумулятора' : 'Изменение существующего аккумулятора';
    const dataForForm = this.getData(state);

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          {dataForForm.map((d,i) => {
            switch (d.type) {
              case 'date':
                return (
                  <Row key={i}>
                    <Col md={6}>
                      <Field
                        type={d.type}
                        label={d.label}
                        date={d.value}
                        onChange={d.onChange}
                        time={false}
                      />
                    </Col>
                  </Row>
                );
              default:
                return (
                  <Row key={i}>
                    <Col md={6}>
                      <Field
                        type={d.type}
                        label={d.label}
                        value={d.value}
                        date={d.value}
                        onChange={d.onChange}
                      />
                    </Col>
                  </Row>
                );
            }
          })}
          
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
