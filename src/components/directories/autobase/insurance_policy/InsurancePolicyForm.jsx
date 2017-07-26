import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';


@connectToStores(['autobase'])
export default class BaseBatteryForm extends Form {

  onChageWrap = name => (...arg) => this.handleChange(name, ...arg);

  render() {
    const {
      insuranceTypeList = [],
      isPermitted = false,
      cols = [],
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});

    const INSURANCE_TYPE_OPTION = insuranceTypeList.map(el => ({ value: el.id, label: el.name }));

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
                type={fields.insurer.type}
                label={fields.insurer.displayName}
                value={state.insurer}
                error={errors.insurer}
                onChange={this.onChageWrap('insurer')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.insurance_name.type}
                label={fields.insurance_name.displayName}
                value={state.insurance_name}
                error={errors.insurance_name}
                onChange={this.onChageWrap('insurance_name')}
                disabled={!isPermitted}
              />
              <Field
                type={'select'}
                label={fields.insurance_type_id.displayName}
                value={state.insurance_type_id}
                error={errors.insurance_type_id}
                options={INSURANCE_TYPE_OPTION}
                emptyValue={null}
                onChange={this.onChageWrap('insurance_type_id')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.seria.type}
                label={fields.seria.displayName}
                value={state.seria}
                error={errors.seria}
                onChange={this.onChageWrap('seria')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.number.type}
                label={fields.number.displayName}
                value={state.number}
                error={errors.number}
                onChange={this.onChageWrap('number')}
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
                type={fields.date_end.type}
                label={fields.date_end.displayName}
                date={state.date_end}
                time={false}
                error={errors.date_end}
                onChange={this.onChageWrap('date_end')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.lifetime_months.type}
                label={fields.lifetime_months.displayName}
                value={state.lifetime_months}
                error={errors.lifetime_months}
                onChange={this.onChageWrap('lifetime_months')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.price.type}
                label={fields.price.displayName}
                value={state.price}
                error={errors.price}
                onChange={this.onChageWrap('price')}
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
