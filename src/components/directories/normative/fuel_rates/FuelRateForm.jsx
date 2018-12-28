import React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import { ExtField } from 'components/ui/new/field/ExtField';
import Form from 'components/compositions/Form';
import { connectToStores } from 'utils/decorators';
import { connect } from 'react-redux';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

@connectToStores(['fuelRates', 'objects', 'companyStructure'])
class FuelRateForm extends Form {
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations({ is_active: true });
    this.props.actionGetAndSetInStoreSpecialModel();
    this.context.flux.getActions('objects').getModels(this.props.formState.car_special_model_id);
  }

  handleSpecialModelChange = async (value) => {
    await this.context.flux.getActions('objects').getModels(value);
    if (!this.props.modelsList.find(model => model.id === this.props.formState.car_model_id)) {
      this.handleChange('car_model_id', null);
    }
    this.handleChange('car_special_model_id', value);
  }

  makeOptionFromSpecialModelsList = (
    memoize(
      specialModelList => specialModelList.map(defaultSelectListMapper),
    )
  );

  render() {
    const [
      state = {},
      errors = {},
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];

    const {
      companyStructureList = [],
      modelsList = [],
      operations = [],
      specialModelList,
      isPermitted = false,
    } = this.props;

    const COMPANY_ELEMENTS = companyStructureList.map((el) => ({ value: el.id, label: el.name }));
    const MODELS = modelsList.map(m => ({ value: m.id, label: m.full_name }));
    const SPECIALMODELS = this.makeOptionFromSpecialModelsList(specialModelList);
    const OPERATIONS = operations
      .map(op => ({ value: op.id, label: `${op.name}${op.equipment ? ' [спецоборудование]' : ''}`, measure_unit_name: op.measure_unit_name }))
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

    const measure_unit_name = (OPERATIONS.find(({ value }) => value === state.operation_id) || { measure_unit_name: '-' }).measure_unit_name || '-';

    return (
      <Modal id="modal-fuel-rate" show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={12}>

              <Field
                label="Дата приказа"
                type="date"
                date={state.order_date}
                onChange={this.handleChange.bind(this, 'order_date')}
                time={false}
                error={errors.order_date}
                disabled={!isPermitted}
              />

              <Field
                label="Операция"
                error={errors.operation_id}
                type="select"
                options={OPERATIONS}
                clearable={false}
                value={state.operation_id}
                onChange={this.handleChange.bind(this, 'operation_id')}
                disabled={!isPermitted}
              />

              <ExtField
                type="string"
                label="Единица измерения"
                value={measure_unit_name}
                disabled
              />

              <Field
                label="Примечание"
                type="string"
                value={state.comment}
                onChange={this.handleChange.bind(this, 'comment')}
              />

              <Field
                label="Норма для летнего периода"
                type="number"
                error={errors.summer_rate}
                value={state.summer_rate}
                onChange={this.handleChange.bind(this, 'summer_rate')}
                disabled={!isPermitted}
              />

              <Field
                label="Норма для зимнего периода"
                type="number"
                error={errors.winter_rate}
                value={state.winter_rate}
                onChange={this.handleChange.bind(this, 'winter_rate')}
                disabled={!isPermitted}
              />

              <Field
                label="Модель ТС"
                error={errors.car_special_model_id}
                type="select"
                options={SPECIALMODELS}
                clearable={false}
                value={state.car_special_model_id}
                onChange={this.handleSpecialModelChange}
                disabled={!isPermitted}
              />

              <Field
                label="Марка шасси"
                error={errors.car_model_id}
                type="select"
                className="white-space-pre-wrap"
                options={MODELS}
                value={state.car_model_id}
                onChange={this.handleChange.bind(this, 'car_model_id')}
                disabled={!isPermitted || !state.car_special_model_id}
              />
              <Field
                label="Подразделение"
                type="select"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                emptyValue={null}
                onChange={this.handleChange.bind(this, 'company_structure_id')}
                disabled={!isPermitted}
              />

            </Col>

          </Row>

        </ModalBody>

        <Modal.Footer>
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connect(
  state => ({
    specialModelList: getSomeUniqState(state).specialModelList,
  }),
  (dispatch, { page, path }) => ({
    actionGetAndSetInStoreSpecialModel: () => (
      dispatch(
        someUniqActions.actionGetAndSetInStoreSpecialModel(
          {},
          { page, path },
        ),
      )
    ),
  }),
)(FuelRateForm);