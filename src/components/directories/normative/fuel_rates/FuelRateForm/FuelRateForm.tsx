import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';

import { ExtField } from 'components/ui/new/field/ExtField';

import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

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
import { ICreateFuel } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import FuelRatePermissions from 'components/directories/normative/fuel_rates/config-data/permissions';

import { getModelsListState } from 'redux-main/reducers/modules/some_uniq/modelList/selectors';
import { getSpecialModelList } from 'redux-main/reducers/modules/some_uniq/special_model/selectors';

class FuelRateForm extends React.PureComponent<PropsFuelRate, StateFuelRate> {

  handleHide = () => {
    this.props.handleHide(false);
  }

  componentDidMount() {
    const {
      formState: {
        car_special_model_id,
      }
    } = this.props;

    this.props.actionGetAndSetInStoreSpecialModel();
    this.props.getAndSetInStoreCompanyStructureLinear();
    this.props.actionGetAndSetInStoreModelList({ car_special_model_id });
    this.props.fuelOperationsGetAndSetInStore();

  }

  handleSpecialModelChange = (value) => {
    this.props.actionGetAndSetInStoreModelList({ car_special_model_id: value });
    if (!this.props.modelsList.find((model) => model.id === this.props.formState.car_model_id)) {
      this.props.handleChange('car_model_id', null);
    }
    this.props.handleChange('car_special_model_id', value);
  }

  makeOptionFromModelsList = (
    memoize(
      (modelsList) => modelsList.map((modalListItem) => ({ // Добавить типчики
        value: modalListItem.id,
        label: modalListItem.full_name,
        rowData: modalListItem,
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
        label: `${op.name}, ${op.measure_unit_name}${op.equipment ? ' [спецоборудование]' : ''}`, // добавить условие новое
        measure_unit_name: op.measure_unit_name,
        rowData: op,
      }))
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())), // change to custom
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      modelsList,
      fuelRateOperationsIsActiveList,
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

    const measure_unit_name = (OPERATIONS.find(({ value }) => value === state.operation_id) || { measure_unit_name: '-' }).measure_unit_name || '-'; // переписать без find

    return (
      <Modal id="modal-fuel-rate" show onHide={this.handleHide} backdrop="static">
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
                onChange={this.props.handleChange.bind(this, 'order_date')}
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
                options={OPERATIONS}
                clearable={false}
                value={state.operation_id}
                onChange={this.props.handleChange.bind(this, 'operation_id')}
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
                onChange={this.props.handleChange.bind(this, 'comment')}
              />

              <ExtField
                id="summer_rate"
                modalKey={page}
                label="Норма для летнего периода"
                type="number"
                error={errors.summer_rate}
                value={state.summer_rate}
                onChange={this.props.handleChange.bind(this, 'summer_rate')}
                disabled={!isPermitted}
              />

              <ExtField
                id="winter_rate"
                modalKey={page}
                label="Норма для зимнего периода"
                type="number"
                error={errors.winter_rate}
                value={state.winter_rate}
                boundKeys="winter_rate" // вместо bind
                onChange={this.props.handleChange}
                disabled={!isPermitted}
              />

              <ExtField
                id="car_special_model_id"
                modalKey={page}
                label="Модель ТС"
                error={errors.car_special_model_id}
                type="select"
                options={SPECIALMODELS}
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
                options={MODELS}
                value={state.car_model_id}
                onChange={this.props.handleChange.bind(this, 'car_model_id')}
                disabled={!isPermitted || !state.car_special_model_id}
              />
              <ExtField
                id="company_structure_id"
                modalKey={page}
                label="Подразделение"
                type="select"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                emptyValue={null}
                onChange={this.props.handleChange.bind(this, 'company_structure_id')}
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
          fuelRateCreate(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          fuelRateUpdate(
            formState,
            { page, path },
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
      fuelOperationsGetAndSetInStore: () => (
        dispatch(
          fuelOperationsGetAndSetInStore(
            {},
            {
              page,
              path,
            },
          ),
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
    permissions: FuelRatePermissions, // Lower case
  }),
)(FuelRateForm);
