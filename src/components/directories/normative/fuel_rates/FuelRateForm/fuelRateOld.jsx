import React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import { ExtField } from 'components/ui/new/field/ExtField';
import Form from 'components/compositions/Form';
import { connectToStores } from 'utils/decorators';
import { connect } from 'react-redux';
import { getSomeUniqState, getCompanyStructureState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

@connectToStores(['fuelRates', 'objects'])
class FuelRateForm extends Form {
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations({ is_active: true });

    this.props.actionGetAndSetInStoreSpecialModel();
    this.props.getAndSetInStoreCompanyStructureLinear();

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

  makeOptionFromCompanyStructureLinearList = (
    memoize(
      companyStructureLinearList => companyStructureLinearList.map(defaultSelectListMapper),
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      modelsList = [],
      operations = [],
      specialModelList,
      companyStructureLinearList,
      isPermitted = false,
    } = this.props;

    const COMPANY_ELEMENTS = this.makeOptionFromCompanyStructureLinearList(
      companyStructureLinearList,
    );
    const SPECIALMODELS = this.makeOptionFromSpecialModelsList(
      specialModelList,
    );

    const MODELS = modelsList.map(m => ({ value: m.id, label: m.full_name }));
    const OPERATIONS = operations
      .map(op => ({ value: op.id, label: `${op.name}, ${op.measure_unit_name}${op.equipment ? ' [СЃРїРµС†РѕР±РѕСЂСѓРґРѕРІР°РЅРёРµ]' : ''}`, measure_unit_name: op.measure_unit_name }))
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

    const measure_unit_name = (OPERATIONS.find(({ value }) => value === state.operation_id) || { measure_unit_name: '-' }).measure_unit_name || '-';

    return (
      <Modal id="modal-fuel-rate" show={this.props.show} onHide={this.props.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Р”РѕР±Р°РІР»РµРЅРёРµ' : 'РР·РјРµРЅРµРЅРёРµ'} РЅРѕСЂРјС‹ СЂР°СЃС…РѕРґР° С‚РѕРїР»РёРІР°</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={12}>

              <Field
                label="Р”Р°С‚Р° РїСЂРёРєР°Р·Р°"
                type="date"
                date={state.order_date}
                onChange={this.handleChange.bind(this, 'order_date')}
                time={false}
                error={errors.order_date}
                disabled={!isPermitted}
              />

              <Field
                label="РћРїРµСЂР°С†РёСЏ"
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
                label="Р•РґРёРЅРёС†Р° РёР·РјРµСЂРµРЅРёСЏ"
                value={measure_unit_name}
                disabled
              />

              <Field
                label="РџСЂРёРјРµС‡Р°РЅРёРµ"
                type="string"
                value={state.comment}
                onChange={this.handleChange.bind(this, 'comment')}
              />

              <Field
                label="РќРѕСЂРјР° РґР»СЏ Р»РµС‚РЅРµРіРѕ РїРµСЂРёРѕРґР°"
                type="number"
                error={errors.summer_rate}
                value={state.summer_rate}
                onChange={this.handleChange.bind(this, 'summer_rate')}
                disabled={!isPermitted}
              />

              <Field
                label="РќРѕСЂРјР° РґР»СЏ Р·РёРјРЅРµРіРѕ РїРµСЂРёРѕРґР°"
                type="number"
                error={errors.winter_rate}
                value={state.winter_rate}
                onChange={this.handleChange.bind(this, 'winter_rate')}
                disabled={!isPermitted}
              />

              <Field
                label="РњРѕРґРµР»СЊ РўРЎ"
                error={errors.car_special_model_id}
                type="select"
                options={SPECIALMODELS}
                clearable={false}
                value={state.car_special_model_id}
                onChange={this.handleSpecialModelChange}
                disabled={!isPermitted}
              />

              <Field
                label="РњР°СЂРєР° С€Р°СЃСЃРё"
                error={errors.car_model_id}
                type="select"
                className="white-space-pre-wrap"
                options={MODELS}
                value={state.car_model_id}
                onChange={this.handleChange.bind(this, 'car_model_id')}
                disabled={!isPermitted || !state.car_special_model_id}
              />
              <Field
                label="РџРѕРґСЂР°Р·РґРµР»РµРЅРёРµ"
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
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.handleSubmit.bind(this)}>РЎРѕС…СЂР°РЅРёС‚СЊ</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connect(
  state => ({
    specialModelList: getSomeUniqState(state).specialModelList,
    companyStructureLinearList: getCompanyStructureState(state).companyStructureLinearList,
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
    getAndSetInStoreCompanyStructureLinear: () => (
      dispatch(
        companyStructureActions.getAndSetInStoreCompanyStructureLinear(
          {},
          { page, path },
        ),
      )
    ),
  }),
)(FuelRateForm);