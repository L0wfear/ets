import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

import { connectToStores } from 'utils/decorators';

@loadingOverlay
@connectToStores(['autobase', 'objects'])
export default class BaseTechInspectionForm extends Form {
  componentWillMount() {
    const { flux } = this.context;
    const { formState, car_id = -1 } = this.props;
    const { is_allowed = false } = formState;

    if (car_id >= 0) {
      this.handleChange('car_id', car_id);
    }
    this.handleChange('is_allowed', is_allowed);
  }

  render() {
    const {
      isPermitted = false,
      cols = [],
      carsList = [],
      car_id = -1,
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});
    const CAR_LIST_OPTION = carsList.map(el => ({ value: el.asuods_id, label: el.gov_number }));
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
              {IS_CREATING && car_id === -1 && 
                <ExtField
                  type="select"
                  label="Номер транспортного средства"
                  value={state.car_id}
                  error={errors.car_id}
                  options={CAR_LIST_OPTION}
                  emptyValue={null}
                  onChange={this.handleChange}
                  boundKeys={['car_id']}
                  disabled={!isPermitted}
                />
              }
              <ExtField
                type={'string'}
                label={fields.reg_number.displayName}
                value={state.reg_number}
                error={errors.reg_number}
                onChange={this.handleChange}
                boundKeys={['reg_number']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.date_end.type}
                label={fields.date_end.displayName}
                date={state.date_end}
                time={false}
                error={errors.date_end}
                onChange={this.handleChange}
                boundKeys={['date_end']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'string'}
                label={fields.tech_operator.displayName}
                value={state.tech_operator}
                error={errors.tech_operator}
                onChange={this.handleChange}
                boundKeys={['tech_operator']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.date_start.type}
                label={fields.date_start.displayName}
                date={state.date_start}
                time={false}
                error={errors.date_start}
                onChange={this.handleChange}
                boundKeys={['date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type="boolean"
                label="Заключение о возможности эксплуатации ТС"
                value={state.is_allowed === true}
                error={errors.is_allowed}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['is_allowed', true]}
                disabled={!isPermitted}
              />
              <ExtField
                type="boolean"
                label="Заключение о невозможности эксплуатации ТС"
                value={state.is_allowed === false}
                error={errors.is_allowed}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['is_allowed', false]}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.note.type}
                label={fields.note.displayName}
                value={state.note}
                error={errors.note}
                onChange={this.handleChange}
                boundKeys={['note']}
                disabled={!isPermitted}
              />
              <FileField
                label="Файл"
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
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
