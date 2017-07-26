import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import Field, { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

import { connectToStores } from 'utils/decorators';


@connectToStores(['autobase', 'objects'])
export default class BaseTechInspectionForm extends Form {
  async componentWillMount() {
    const { flux } = this.context;
    const carsList = await flux.getActions('objects').getCars();

    const { car_id = -1 } = this.props;

    if (car_id >= 0) {
      this.handleChange('car_id', car_id);
    }

    this.setState({ carsList: carsList.result });
  }

  onChageWrap = name => (...arg) => this.handleChange(name, ...arg);

  render() {
    const {
      isPermitted = false,
      cols = [],
      car_id = -1,
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const { carsList = [] } = this.state;

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
                <Field
                  type="select"
                  label="Номер транспортного средства"
                  value={state.car_id}
                  error={errors.car_id}
                  options={CAR_LIST_OPTION}
                  emptyValue={null}
                  onChange={this.onChageWrap('car_id')}
                  disabled={!isPermitted}
                />
              }
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
              <ExtField
                type={'boolean'}
                label={fields.is_allowed.displayName}
                value={state.is_allowed}
                error={errors.is_allowed}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['is_allowed', !state.is_allowed]}
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
