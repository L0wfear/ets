import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import { connectToStores } from 'utils/decorators';
import ModalBody from 'components/ui/Modal';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import { AUTOBASE_REPAIR_STATUS } from 'constants/dictionary';
import Form from 'components/compositions/Form.jsx';

const STATUS_DISABLED_OPTIONS = Object.entries(AUTOBASE_REPAIR_STATUS).filter(([, value]) => value.disabled).map(([key, value]) => ({
  value: key,
  label: value.name,
  disabled: true,
}));

const STATUS_SELECT_OPTIONS = Object.entries(AUTOBASE_REPAIR_STATUS).filter(([, value]) => !value.disabled).map(([key, value]) => ({
  value: key,
  label: value.name,
}));

@loadingOverlay
@connectToStores(['autobase', 'objects'])
export default class BaseTechInspectionForm extends Form {
  componentWillMount() {
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    flux.getActions('objects').getCars();

    if (car_id >= 0) {
      this.handleChange('car_id', car_id);
    }
    this.handleChange('status', this.getStatus());
  }

  getStatus(inputData = {}) {
    const {
      plan_date_start = false,
      plan_date_end = false,
      fact_date_start = false,
      fact_date_end = false,
    } = this.props.formState;

    const date = {
      plan_date_start,
      plan_date_end,
      fact_date_start,
      fact_date_end,
      ...inputData,
    };

    if (date.plan_date_start && date.plan_date_end && !date.fact_date_start && !date.fact_date_end) {
      return 'planned';
    } else if (date.fact_date_start && !date.fact_date_end) {
      return 'in_progress';
    } else if (!date.plan_date_start || !date.plan_date_end || !date.fact_date_start || !date.fact_date_end) {
      return 'empty';
    }
    return '';
  }
  dateHandleChange = (nameDate, date) => {
    this.handleChange(nameDate, date);
    this.handleChange('status', this.getStatus({ [nameDate]: date }));
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
    const STATUS_OPTION = state.status && AUTOBASE_REPAIR_STATUS[state.status].disabled ? STATUS_DISABLED_OPTIONS : STATUS_SELECT_OPTIONS || [];

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
                onChange={this.dateHandleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.plan_date_end.type}
                label={fields.plan_date_end.displayName}
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.dateHandleChange}
                boundKeys={['plan_date_end']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.fact_date_start.type}
                label={fields.fact_date_start.displayName}
                date={state.fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.dateHandleChange}
                boundKeys={['fact_date_start']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.fact_date_end.type}
                label={fields.fact_date_end.displayName}
                date={state.fact_date_end}
                time={false}
                error={errors.fact_date_end}
                onChange={this.dateHandleChange}
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
              <FileField
                label="Файл"
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label={fields.status.displayName}
                value={state.status}
                error={errors.status}
                options={STATUS_OPTION}
                onChange={this.handleChange}
                boundKeys={['status']}
                disabled={!isPermitted || (AUTOBASE_REPAIR_STATUS[state.status] && AUTOBASE_REPAIR_STATUS[state.status].disabled)}
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
