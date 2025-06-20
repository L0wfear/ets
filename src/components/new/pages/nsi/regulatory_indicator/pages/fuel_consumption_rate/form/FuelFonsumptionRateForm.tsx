import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

import ExtField from 'components/@next/@ui/renderFields/Field';

import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import {
  fuelRateCreate,
  fuelRateUpdate,
  fuelOperationsGetAndSetInStore,
  resetFuelOperations,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';

import {
  OwnFuelRateProps,
  PropsFuelRate,
  StatePropsFuelRate,
  DispatchPropsFuelRate,
  PropsFuelRateWithForm,
} from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form/@types/FuelConsumptionRateFrom';

import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

import {
  getModelsListState,
  getModelsListOptions,
} from 'redux-main/reducers/modules/some_uniq/modelList/selectors';
import { getSomeUniqSpecialModelOptions } from 'redux-main/reducers/modules/some_uniq/special_model/selectors';
import { getCompanyStructureLinearOptions } from 'redux-main/reducers/modules/company_structure/selectors';
import { getFuelRateOperationsIsActiveOptions } from 'redux-main/reducers/modules/fuel_rates/selectors';
import { getDefaultFuelRateElement } from './utils';
import { fuelRateSchema } from './schema';
import fuelRatesPermissions from '../_config-data/permissions';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { autobaseGetSetCar } from 'redux-main/reducers/modules/autobase/car/actions';
import UseEngineKindsList from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/useEngineKindsList';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';
import { ELECTRICAL_ENGINE_TYPE_ID } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';

const FuelRateForm: React.FC<PropsFuelRate> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    specialModelOptions,
    fuelRateOperationsIsActiveOptions,
    STRUCTURES,
    modelsListOptions,
    page,
    path,
  } = props;

  const engineKindsOptions = UseEngineKindsList(false, {page, path});
  const [carListOptions, setCarListOptions] = React.useState([]);
  const isElectricalKind = React.useMemo(() => {
    return fuelRateOperationsIsActiveOptions
      ?.find((el) => el.value === state.operation_id)
      ?.rowData?.engine_kind_ids.includes(ELECTRICAL_ENGINE_TYPE_ID);
  }, [state.operation_id, fuelRateOperationsIsActiveOptions]);
  const filteredEngineKindsOptions = React.useMemo(
    () =>
      isElectricalKind
        ? engineKindsOptions
        : engineKindsOptions.filter((el) => el.value !== ELECTRICAL_ENGINE_TYPE_ID),
    [isElectricalKind, engineKindsOptions]
  );

  React.useEffect(() => {
    props.actionGetAndSetInStoreSpecialModel({}, { page, path });
    props.fuelOperationsGetAndSetInStore({ is_active: true }, { page, path });

    return () => {
      props.actionResetModelList();
      props.resetFuelOperations();
      props.actionResetSpecialModel();
    };
  }, []);

  React.useEffect(() => {
    props.actionGetAndSetInStoreModelList(
      { car_special_model_id: state.car_special_model_id },
      { page, path },
    );
  }, [state.car_special_model_id]);

  React.useEffect(
    () => {
      props.dispatch(autobaseGetSetCar({}, { page, path })).then(
        ({ data }) => (
          setCarListOptions(
            data.map(
              (rowData) => ({
                objChange: {
                  car_special_model_id: rowData.special_model_id,
                  car_model_id: rowData.model_id,
                  car_id: rowData.asuods_id,
                },
                value: rowData.asuods_id,
                label: carActualOptionLabelGarage(rowData),
              }),
            ),
          )
        ),
      );
    },
    [],
  );

  React.useEffect(() => {
    if (isElectricalKind && state.engine_kind_id !== ELECTRICAL_ENGINE_TYPE_ID) {
      props.handleChange({ engine_kind_id: ELECTRICAL_ENGINE_TYPE_ID });
    } else if (!isElectricalKind && state.engine_kind_id === ELECTRICAL_ENGINE_TYPE_ID) {
      props.handleChange({ engine_kind_id: null });
    }
  }, [
    state.operation_id,
    isElectricalKind,
    state.engine_kind_id,
    props.handleChange,
  ]);

  const handleSpecialModelChange = React.useCallback(
    (value) => {
      const objChange: Partial<FuelRate> = {
        car_special_model_id: value,
      };

      if (!props.modelsList.find((model) => model.id === state.car_model_id)) {
        objChange.car_model_id = null;
      }
      props.handleChange(objChange);
    },
    [props.modelsList, state.car_model_id,],
  );

  const handleGovNumberChange = React.useCallback(
    (_, __, changeFields) => { 
      const clearFieldsObject = {
        car_special_model_id: null,
        car_model_id: null,
        car_id: null,
      };
      const objChange = changeFields ? changeFields.objChange : clearFieldsObject;
      Object.entries(objChange).forEach(([key, value]) => {
        props.handleChange({[key]: value});
      });
    },
    [props.handleChange,],
  );

  const IS_CREATING = !state.id;
  const isPermitted = !IS_CREATING
    ? props.isPermittedToUpdate
    : props.isPermittedToCreate;

  const masureUnitItem = fuelRateOperationsIsActiveOptions.find(
    ({ value }) => value === state.operation_id,
  );
  const measure_unit_name = get(
    masureUnitItem,
    'rowData.measure_unit_name',
    '-',
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-fuel-rate"
      show
      onHide={props.hideWithoutChanges}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>
          {!state.id ? 'Добавление' : 'Изменение'} нормы расхода топлива
        </EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>

      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              id="order_date"
              modalKey={page}
              label="Дата приказа"
              type="date"
              date={state.order_date}
              onChange={props.handleChange}
              boundKeys="order_date"
              time={false}
              error={errors.order_date}
              disabled={!isPermitted}
            />

            <ExtField
              id="order_number"
              modalKey={page}
              label="Номер приказа"
              type="string"
              value={state.order_number}
              onChange={props.handleChange}
              boundKeys="order_number"
              error={errors.order_number}
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
              onChange={props.handleChange}
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
              onChange={props.handleChange}
              boundKeys="comment"
            />

            <ExtField
              id="summer_rate"
              modalKey={page}
              label="Норма для летнего периода"
              type="number"
              error={errors.summer_rate}
              value={state.summer_rate}
              onChange={props.handleChange}
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
              onChange={props.handleChange}
              disabled={!isPermitted}
            />

            <ExtField
              id="car_id"
              modalKey={page}
              label="Рег. номер ТС"
              error={errors.car_id}
              type="select"
              options={carListOptions}
              clearable={true}
              value={state.car_id}
              onChange={handleGovNumberChange}
              boundKeys="car_id"
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
              onChange={handleSpecialModelChange}
              disabled={!isPermitted || Boolean(state.car_id)}
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
              onChange={props.handleChange}
              boundKeys="car_model_id"
              disabled={!isPermitted || !state.car_special_model_id || Boolean(state.car_id)}
            />
            <ExtField
              id="engine_kind_id"
              modalKey={page}
              label="Тип двигателя"
              error={errors.engine_kind_id}
              type="select"
              options={filteredEngineKindsOptions}
              value={state.engine_kind_id}
              onChange={props.handleChange}
              boundKeys="engine_kind_id"
              disabled={!isPermitted || isElectricalKind}
            />
            <ExtField
              id="company_structure_id"
              modalKey={page}
              label="Подразделение"
              type="select"
              options={STRUCTURES}
              value={state.company_structure_id}
              emptyValue={null}
              onChange={props.handleChange}
              boundKeys="company_structure_id"
              disabled={!isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button
          disabled={!props.canSave || !isPermitted}
          onClick={props.defaultSubmit}>
          Сохранить
        </EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsFuelRate, OwnFuelRateProps>(
  connect<StatePropsFuelRate, DispatchPropsFuelRate, OwnFuelRateProps, ReduxState>(
    (state) => ({
      STRUCTURES: getSessionStructuresOptions(state),
      modelsList: getModelsListState(state),
      specialModelOptions: getSomeUniqSpecialModelOptions(state),
      companyStructureLinearOptions: getCompanyStructureLinearOptions(state),
      modelsListOptions: getModelsListOptions(state),
      fuelRateOperationsIsActiveOptions: getFuelRateOperationsIsActiveOptions(
        state,
      ),
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreSpecialModel: (...arg) => (
        dispatch(someUniqActions.actionGetAndSetInStoreSpecialModel(...arg))
      ),
      actionGetAndSetInStoreModelList: (...arg) => (
        dispatch(someUniqActions.actionGetAndSetInStoreModelList(...arg))
      ),
      fuelOperationsGetAndSetInStore: (...arg) => (
        dispatch(fuelOperationsGetAndSetInStore(...arg))
      ),
      actionResetModelList: () => (
        dispatch(someUniqActions.actionResetModelList())
      ),
      actionResetSpecialModel: () => (
        dispatch(someUniqActions.actionResetSpecialModel())
      ),
      resetFuelOperations: () => (
        dispatch(resetFuelOperations())
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
    permissions: fuelRatesPermissions,
  }),
)(FuelRateForm);
