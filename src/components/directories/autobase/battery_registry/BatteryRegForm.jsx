import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';


// TODO переделать DITETS-633
const org = Array(4).fill(1).map((d, i) => d = `-- демо Организация ${i}`);

@connectToStores(['objects'])
export default class BaseBatteryForm extends Form {

  constructor(props) {
    super(props);
  }

  // wtf - Количество месяцев наработки
  // https://gost-jira.atlassian.net/wiki/pages/viewpage.action?pageId=91324941

  getData(state) {
    const whatShow = ['battery_brand__name', 'battery_manufacturer__name', 'battery__serial_number', 'battery__lifetime_months', 'battery__released_at'];
    const errors = this.props.formErrors;

    const wh = (this.props.cols.reduce((obj, oneVal) => {
      if (whatShow.includes(oneVal.name)) {
        obj.push({
          type : oneVal.type,
          label: oneVal.displayName,
          value: state[oneVal.name],
          error: errors[oneVal.name],
          onChange: this.handleChange.bind(this, oneVal.name),
        });
      }
      return obj;
    }, [], this));
    return wh;
  };

  getNameOrg(state, fields) {
    return {
      label: fields.name_org.displayName,
      value: state.name_org,
      type: 'select',
      options: org.map((el, i) => ({ value: i, label: el })),
      emptyValue: null,
      onChange: (...arg) => this.handleChange(fields.name_org.name, ...arg),
    }
  }

  render() {
    const state = this.props.formState;
    const fields = this.props.cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});

    const title = !!!state.battery__id ? 'Добавление нового аккумулятора' : 'Изменение существующего аккумулятора';
    const dataForForm = this.getData(state);
    const getNameOrg = this.getNameOrg(state, fields);

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row key={-1}>
            <Col md={12}>
              <Field
              {...getNameOrg}
              />
            </Col>
          </Row>
          {dataForForm.map((d, i) => {
            switch (d.type) {
              case 'date':
                return (
                  <Row key={i}>
                    <Col md={12}>
                      <Field
                        type={d.type}
                        label={d.label}
                        date={d.value}
                        error={d.error}
                        onChange={d.onChange}
                        time={false}
                      />
                    </Col>
                  </Row>
                );
              default:
                return (
                  <Row key={i}>
                    <Col md={12}>
                      <Field
                        type={d.type}
                        label={d.label}
                        value={d.value}
                        error={d.error}
                        date={d.value}
                        onChange={d.onChange}
                      />
                    </Col>
                  </Row>
                );
            }
          })}
          { !!state.battery__id && <Row>
            <Col md={12}>
              <Field
                type={'string'}
                label={'Количество месяцев наработки'}
                value={'--'}
                readOnly={true}
              />
            </Col>
          </Row> }
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={true} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
