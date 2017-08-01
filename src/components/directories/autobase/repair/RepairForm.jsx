import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';

import { connectToStores } from 'utils/decorators';


@connectToStores(['autobase', 'objects'])
export default class BaseTechInspectionForm extends Form {
  componentWillMount() {
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    flux.getActions('objects').getCars();

    if (car_id >= 0) {
      this.handleChange('car_id', car_id);
    }
  }

  render() {
    const {
      isPermitted = false,
      cols = [],
      carsList = [],
      repairCompanyList = [],
      repairTypeList = [],
      car_id = -1,
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.name]: val }), {});
    const CAR_LIST_OPTION = carsList.map(el => ({ value: el.asuods_id, label: el.gov_number }));
    const REPARE_COMPANY_OPTION = repairCompanyList.map(defaultSelectListMapper);
    const REPARE_TYPE_OPTION = repairTypeList.map(defaultSelectListMapper);

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
                type="select"
                label={fields.repair_company_name.displayName}
                value={state.repair_company_id}
                error={errors.repair_company_id}
                options={REPARE_COMPANY_OPTION}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['repair_company_id']}
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label={fields.repair_type_name.displayName}
                value={state.repair_type_id}
                error={errors.repair_type_id}
                options={REPARE_TYPE_OPTION}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['repair_type_id']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.number.type}
                label={fields.number.displayName}
                value={state.number}
                error={errors.number}
                onChange={this.handleChange}
                boundKeys={['number']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.plan_date_start.type}
                label={fields.plan_date_start.displayName}
                date={state.plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.handleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.plan_date_end.type}
                label={fields.plan_date_end.displayName}
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.handleChange}
                boundKeys={['plan_date_end']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.fact_date_start.type}
                label={fields.fact_date_start.displayName}
                date={state.fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.handleChange}
                boundKeys={['fact_date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.fact_date_end.type}
                label={fields.fact_date_end.displayName}
                date={state.fact_date_end}
                time={false}
                error={errors.fact_date_end}
                onChange={this.handleChange}
                boundKeys={['fact_date_end']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.description.type}
                label={fields.description.displayName}
                value={state.description}
                error={errors.description}
                onChange={this.handleChange}
                boundKeys={['description']}
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
