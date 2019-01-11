import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';

import { ExtField } from 'components/ui/new/field/ExtField';
import Field from 'components/ui/Field';

import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  FuelRateCreate,
  FuelRateUpdate,
  FuelOperationsIsActiveGet,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';
// import { DivNone } from 'global-styled/global-styled';
import {
  FUEL_RATES_SET_DATA
} from 'redux-main/reducers/modules/fuel_rates/fuelRates';
import {
  OwnFuelRateProps,
  PropsFuelRate,
  StateFuelRate,
  StatePropsFuelRate,
  DispatchPropsFuelRate,
  PropsFuelRateWithForm,
} from 'components/directories/normative/fuel_rates/FuelRateForm/@types/FuelRate.h';

import { getDefaultFuelRateElement } from 'components/directories/normative/fuel_rates/FuelRateForm/utils';
import { fuelRateSchema } from 'components/directories/normative/fuel_rates/FuelRateForm/fuelRateSchema';
import { FuelRateUpd } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import FuelRatePermissions from 'components/directories/normative/fuel_rates/config-data/permissions';

import { getModelsListState } from 'redux-main/reducers/modules/some_uniq/modelList/selectors';
import { getSpecialModelList } from 'redux-main/reducers/modules/some_uniq/special_model/selectors';

class FuelRateForm extends React.PureComponent<PropsFuelRate, StateFuelRate> {

  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }
  handleChangeBoolean = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'checked']),
    });
  }

  componentDidMount() {
    const {
      car_special_model_id,
    } = this.props.formState;

    try {
      this.props.actionGetAndSetInStoreSpecialModel();
      this.props.getAndSetInStoreCompanyStructureLinear();
      this.props.actionGetAndSetInStoreModelList({ car_special_model_id });
      this.props.FuelOperationsIsActiveGet();
    } catch (e) {
      // eslint-disable-next-line no-console
      // tslint:disable-next-line:no-console
      console.error(e);
    }

  }

  handleSpecialModelChange = (value) => {
    this.props.actionGetAndSetInStoreModelList({ car_special_model_id: value });
    if (!this.props.modelsList.find((model) => model.id === this.props.formState.car_model_id)) {
      this.handleChange('car_model_id', null);
    }
    this.handleChange('car_special_model_id', value);
  }

  makeOptionFromModelsList = (
    memoize(
      (modelsList) => modelsList.map((m) => ({
        value: m.id,
        label: m.full_name,
      })), // change to custom
    )
  );

  makeOptionFromSpecialModelsList = (
    memoize(
      (specialModelList) => specialModelList.map(defaultSelectListMapper),
    )
  );

  makeOptionFromCompanyStructureLinearList = (
    memoize(
      (companyStructureLinearList) => companyStructureLinearList.map(defaultSelectListMapper),
    )
  );

  makeOptionFromFuelRateOperations = (
    memoize(
      (fuelRateOperationsList) => fuelRateOperationsList.map((op) => ({
        value: op.id,
        label: `${op.name}, ${op.measure_unit_name}${op.equipment ? ' [спецоборудование]' : ''}`,
        measure_unit_name: op.measure_unit_name,
      }))
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())), // change to custom
    )
  );

  render() {
    const {
      page,
      path,
      formState: state,
      formErrors: errors,
      modelsList = [],
      fuelRateOperationsIsActiveList = [],
      specialModelList,
      companyStructureLinearList,
    } = this.props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;
    const COMPANY_ELEMENTS = this.makeOptionFromCompanyStructureLinearList(
      companyStructureLinearList,
    );
    const SPECIALMODELS = this.makeOptionFromSpecialModelsList(
      specialModelList,
    );
    const MODELS = this.makeOptionFromModelsList(
      modelsList,
    );
    const OPERATIONS = this.makeOptionFromFuelRateOperations(
      fuelRateOperationsIsActiveList,
    );

    const measure_unit_name = (OPERATIONS.find(({ value }) => value === state.operation_id) || { measure_unit_name: '-' }).measure_unit_name || '-';

    return (
      <Modal id="modal-fuel-rate" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
        </Modal.Header>

        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
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
        </ModalBodyPreloader>
        <Modal.Footer>
          <Button disabled={!this.props.canSave || !isPermitted} onClick={this.props.defaultSubmit}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsFuelRate, OwnFuelRateProps>(
  connect<StatePropsFuelRate, DispatchPropsFuelRate, OwnFuelRateProps, ReduxState>(
    (state) => ({
      specialModelList: getSpecialModelList(state),
      companyStructureLinearList: getCompanyStructureState(state).companyStructureLinearList,
      modelsList: getModelsListState(state),
      fuelRateOperationsIsActiveList: state.fuelRates.fuelRateOperationsIsActiveList,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          FuelRateCreate(
            FUEL_RATES_SET_DATA,
            { ...formState, page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          FuelRateUpdate(
            FUEL_RATES_SET_DATA,
            { ...formState, page, path },
          ),
        )
      ),
      actionGetAndSetInStoreModelList: (payload) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreModelList(
            {},
            { ...payload, page, path },
          ),
        )
      ),
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
      FuelOperationsIsActiveGet: () => (
        dispatch(
          FuelOperationsIsActiveGet(FUEL_RATES_SET_DATA),
        )
      ),
    }),
  ),
  withForm<PropsFuelRateWithForm, ICreateFuel>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultFuelRateElement(props.element);
    },
    schema: fuelRateSchema,
    permissions: FuelRatePermissions,
  }),
)(FuelRateForm);