import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';


@connectToStores(['autobase'])
export default class BaseTechInspectionForm extends Form {

  onChageWrap = name => (...arg) => this.handleChange(name, ...arg);

  render() {
    const {
      isPermitted = false,
      cols = [],
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});
    const IS_ALLOWED_OPTION = [{ value: true, label: 'Да' }, { value: false, label: 'Нет' }];

    const IS_CREATING = !state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Добавление записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
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
                date={state.date_start}
                time={false}
                error={errors.date_start}
                onChange={this.onChageWrap('date_start')}
                disabled={!isPermitted}
              />
              <Field
                type={'select'}
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
        </ExtDiv>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
