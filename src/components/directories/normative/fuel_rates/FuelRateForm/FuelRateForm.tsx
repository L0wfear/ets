import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';

import { ExtField } from 'components/ui/new/field/ExtField';

import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  fuelRateCreate,
  fuelRateUpdate,
  fuelOperationsGetAndSetInStore,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';

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
import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import fuelRatePermissions from 'components/directories/normative/fuel_rates/config-data/permissions';

import {
  getModelsListState,
  getModelsListOptions
} from 'redux-main/reducers/modules/some_uniq/modelList/selectors';
import {
  getSomeUniqSpecialModelOptions,
} from 'redux-main/reducers/modules/some_uniq/special_model/selectors';
import { getCompanyStructureLinearOptions } from 'redux-main/reducers/modules/company_structure/selectors';
import { getFuelRateOperationsIsActiveOptions } from 'redux-main/reducers/modules/fuel_rates/selectors';
import { get } from 'lodash';

class FuelRateForm extends React.PureComponent<PropsFuelRate, StateFuelRate> {
  componentDidMount() {
    const {
      formState: {
        car_special_model_id,
      },
      page,
      path,
    } = this.props;

    this.props.actionGetAndSetInStoreSpecialModel(
      {},
      { page, path },
    );
    this.props.getAndSetInStoreCompanyStructureLinear(
      {},
      { page, path },
    );
    this.props.actionGetAndSetInStoreModelList(
      { car_special_model_id },
      { page, path },
    );
    this.props.fuelOperationsGetAndSetInStore(
      {},
      { page, path },
    );
  }
//unmount
  handleSpecialModelChange = (value) => {
    const {
      page,
      path,
    } = this.props;

    this.props.actionGetAndSetInStoreModelList(
      { car_special_model_id: value },
      { page, path },
    );
    if (!this.props.modelsList.find((model) => model.id === this.props.formState.car_model_id)) {
      this.props.handleChange('car_model_id', null);
    }
    this.props.handleChange('car_special_model_id', value);
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      specialModelOptions,
      companyStructureLinearOptions,
      modelsListOptions,
      fuelRateOperationsIsActiveOptions,
    } = this.props;

    const IS_CREATING = !state.id;
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const masureUnitItem = fuelRateOperationsIsActiveOptions.find(
      ({ value }) => (value === state.operation_id),
    );
    const measure_unit_name = get(masureUnitItem, 'rowData.measure_unit_name', '-' );

    return (
      <Modal id="modal-fuel-rate" show onHide={this.props.hideWithoutChanges} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива</Modal.Title>
        </Modal.Header>

        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                id="order_date"
                modalKey={page}
                label="Дата приказа"
                type="date"
                date={state.order_date}
                onChange={this.props.handleChange}
                boundKeys="order_date"
                time={false}
                error={errors.order_date}
                disabled={!isPermitted}
              />

              <ExtField
                id="operation_id"
                modalKey={page}
                label="Операция"
                error={errors.operation_id}
                type="select"
                options={fuelRateOperationsIsActiveOptions}
                clearable={false}
                value={state.operation_id}
                onChange={this.props.handleChange}
                boundKeys="operation_id"
                disabled={!isPermitted}
              />

              <ExtField
                id="measure_unit_name"
                modalKey={page}
                type="string"
                label="Единица измерения"
                value={measure_unit_name}
                disabled
              />

              <ExtField
                id="comment"
                modalKey={page}
                label="Примечание"
                type="string"
                value={state.comment}
                onChange={this.props.handleChange}
                boundKeys="comment"
              />

              <ExtField
                id="summer_rate"
                modalKey={page}
                label="Норма для летнего периода"
                type="number"
                error={errors.summer_rate}
                value={state.summer_rate}
                onChange={this.props.handleChange}
                boundKeys="summer_rate"
                disabled={!isPermitted}
              />

              <ExtField
                id="winter_rate"
                modalKey={page}
                label="Норма для зимнего периода"
                type="number"
                error={errors.winter_rate}
                value={state.winter_rate}
                boundKeys="winter_rate" // bind вместо
                onChange={this.props.handleChange}
                disabled={!isPermitted}
              />

              <ExtField
                id="car_special_model_id"
                modalKey={page}
                label="Модель ТС"
                error={errors.car_special_model_id}
                type="select"
                options={specialModelOptions}
                clearable={false}
                value={state.car_special_model_id}
                onChange={this.handleSpecialModelChange}
                disabled={!isPermitted}
              />

              <ExtField
                id="car_model_id"
                modalKey={page}
                label="Марка шасси"
                error={errors.car_model_id}
                type="select"
                className="white-space-pre-wrap"
                options={modelsListOptions}
                value={state.car_model_id}
                onChange={this.props.handleChange}
                boundKeys="car_model_id"
                disabled={!isPermitted || !state.car_special_model_id}
              />
              <ExtField
                id="company_structure_id"
                modalKey={page}
                label="Подразделение"
                type="select"
                options={companyStructureLinearOptions}
                value={state.company_structure_id}
                emptyValue={null}
                onChange={this.props.handleChange}
                boundKeys="company_structure_id"
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
      modelsList: getModelsListState(state),
      specialModelOptions: getSomeUniqSpecialModelOptions(state),
      companyStructureLinearOptions: getCompanyStructureLinearOptions(state),
      modelsListOptions: getModelsListOptions(state),
      fuelRateOperationsIsActiveOptions: getFuelRateOperationsIsActiveOptions(state),
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreModelList: (...arg) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreModelList(...arg),
        )
      ),
      actionGetAndSetInStoreSpecialModel: (...arg) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreSpecialModel(...arg),
        )
      ),
      getAndSetInStoreCompanyStructureLinear: (...arg) => (
        dispatch(
          companyStructureActions.getAndSetInStoreCompanyStructureLinear(...arg),
        )
      ),
      fuelOperationsGetAndSetInStore: (...arg) => (
        dispatch(
          fuelOperationsGetAndSetInStore(...arg),
        )
      ),
    }),
  ),
  withForm<PropsFuelRateWithForm, FuelRate>({
    uniqField: 'id',
    createAction: fuelRateCreate,
    updateAction: fuelRateUpdate,
    mergeElement: (props) => {
      return getDefaultFuelRateElement(props.element);
    },
    schema: fuelRateSchema,
    permissions: fuelRatePermissions,
  }),
)(FuelRateForm);
