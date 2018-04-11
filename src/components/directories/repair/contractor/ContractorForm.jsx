import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

export default class SparePartForm extends Form {
  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];

    const IS_CREATING = !state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Наименование"
                error={errors.name}
                value={state.name}
                onChange={this.handleChange}
                boundKeys={['name']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <ExtField
                type="string"
                label="ИНН"
                error={errors.inn}
                value={state.inn}
                onChange={this.handleChange}
                boundKeys={['inn']}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="string"
                label="КПП"
                error={errors.kpp}
                value={state.kpp}
                onChange={this.handleChange}
                boundKeys={['kpp']}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="string"
                label="ОГРН"
                error={errors.ogrn}
                value={state.ogrn}
                onChange={this.handleChange}
                boundKeys={['ogrn']}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="string"
                label="ОКПО"
                error={errors.okpo}
                value={state.okpo}
                onChange={this.handleChange}
                boundKeys={['okpo']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <ExtField
                type="string"
                label="Почтовый адрес"
                error={errors.postal_address}
                value={state.postal_address}
                onChange={this.handleChange}
                boundKeys={['postal_address']}
              />
            </Col>
            <Col md={4}>
              <ExtField
                type="string"
                label="Электронный адрес"
                error={errors.email}
                value={state.email}
                onChange={this.handleChange}
                boundKeys={['email']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <ExtField
                type="string"
                label="Телефон"
                error={errors.phone}
                value={state.phone}
                onChange={this.handleChange}
                boundKeys={['phone']}
              />
            </Col>
            <Col md={4}>
              <ExtField
                type="string"
                label="Факс"
                error={errors.fax}
                value={state.fax}
                onChange={this.handleChange}
                boundKeys={['fax']}
              />
            </Col>
            <Col md={4}>
              <ExtField
                type="string"
                label="БИК"
                error={errors.bik}
                value={state.bik}
                onChange={this.handleChange}
                boundKeys={['bik']}
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
