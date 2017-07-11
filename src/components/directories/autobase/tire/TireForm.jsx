import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
export default class TireForm extends Form {

  async componentDidMount() {
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('tireSize');
    flux.getActions('autobase').getAutobaseListByType('tireModel');
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { tireModelList = [], tireSizeList = [], isPermitted = false } = this.props;
    const TIRE_MODEL = tireModelList.map(({ id, name }) => ({ value: id, label: name }));
    const TIRE_SIZE = tireSizeList.map(({ id, name }) => ({ value: id, label: name }));

    const IS_CREATING = !!!state.id;

    let title = 'Редактирование карточки шины';
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
                type="select"
                label="Модель шины"
                options={TIRE_MODEL}
                value={state.tire_model_id}
                error={errors.tire_model_id}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'tire_model_id')}
              />
            </Col>
            <Col md={6}>
              <Field
                type="select"
                label="Размер"
                options={TIRE_SIZE}
                value={state.tire_size_id}
                error={errors.tire_size_id}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'tire_size_id')}
              />
            </Col>
            {!IS_CREATING &&
              <Col sm={6} md={6}>
                <label htmlFor=" ">Пробег, км:</label>
                <span style={{ marginLeft: 10 }}>{state.odometr_diff}</span>
              </Col>
            }
            {!IS_CREATING &&
              <Col sm={6} md={6}>
                <label htmlFor=" ">Наработка, мч:</label>
                <span style={{ marginLeft: 10 }}>{state.motohours_diff}</span>
              </Col>
            }
            <Col md={12}>
              <Field
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={this.handleChange.bind(this, 'comment')}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={true || !this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
