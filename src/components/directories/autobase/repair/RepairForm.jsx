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
      repairCompanyList = [],
      repairTypeList = [],
      car_id = -1,
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const {
      carsList = [],
     } = this.state;

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});
    const CAR_LIST_OPTION = carsList.map(el => ({ value: el.asuods_id, label: el.gov_number }));
    const REPARE_COMPANY_OPTION = repairCompanyList.map(el => ({ value: el.id, label: el.name }));
    const REPARE_TYPE_OPTION = repairTypeList.map(el => ({ value: el.id, label: el.name }));

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
                type="select"
                label={fields.repair_company_id.displayName}
                value={state.repair_company_id}
                error={errors.repair_company_id}
                options={REPARE_COMPANY_OPTION}
                emptyValue={null}
                onChange={this.onChageWrap('repair_company_id')}
                disabled={!isPermitted}
              />
              <Field
                type="select"
                label={fields.repair_type_id.displayName}
                value={state.repair_type_id}
                error={errors.repair_type_id}
                options={REPARE_TYPE_OPTION}
                emptyValue={null}
                onChange={this.onChageWrap('repair_type_id')}
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
                type={fields.plan_date_start.type}
                label={fields.plan_date_start.displayName}
                date={state.plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.onChageWrap('plan_date_start')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.plan_date_end.type}
                label={fields.plan_date_end.displayName}
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.onChageWrap('plan_date_end')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.fact_date_start.type}
                label={fields.fact_date_start.displayName}
                date={state.fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.onChageWrap('fact_date_start')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.fact_date_end.type}
                label={fields.fact_date_end.displayName}
                date={state.fact_date_end}
                time={false}
                error={errors.fact_date_end}
                onChange={this.onChageWrap('fact_date_end')}
                disabled={!isPermitted}
              />
              <Field
                type={fields.description.type}
                label={fields.description.displayName}
                value={state.description}
                error={errors.description}
                onChange={this.onChageWrap('description')}
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
