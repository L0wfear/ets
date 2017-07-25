import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
export default class TechInspectionForm extends Form {

  handleChangeWrap = name => (...arg) => this.handleChange(name, ...arg);
  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { cols = [],
            isPermitted = false,
           } = this.props;

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});
    const IS_ALLOWED_OPTION = [{ id: true, value: 'Да' }, { id: false, value: 'Нет' }];

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
            <Col md={12}>
              <Field
                type={fields.reg_number.type}
                label={fields.reg_number.displayName}
                value={state.reg_number}
                error={errors.reg_number}
                onChange={this.onChageWrap('reg_number')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.date_end.type}
                label={fields.date_end.displayName}
                date={state.date_end}
                time={false}
                error={errors.date_end}
                onChange={this.onChageWrap('date_end')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.tech_operator.type}
                label={fields.tech_operator.displayName}
                value={state.tech_operator}
                error={errors.tech_operator}
                onChange={this.onChageWrap('tech_operator')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.date_start.type}
                label={fields.date_start.displayName}
                value={state.date_start}
                error={errors.date_start}
                onChange={this.onChageWrap('date_start')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.is_allowed.type}
                label={fields.is_allowed.displayName}
                value={state.is_allowed}
                error={errors.is_allowed}
                options={IS_ALLOWED_OPTION}
                emptyValue={null}
                onChange={this.onChageWrap('is_allowed')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.note.type}
                label={fields.note.displayName}
                value={state.note}
                error={errors.note}
                onChange={this.onChageWrap('note')}
                disabled={!isPermitted}
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
