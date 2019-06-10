import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnFuelOperationsProps,
  PropsFuelOperations,
  StatePropsFuelOperations,
  DispatchPropsFuelOperations,
  PropsFuelOperationsWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/@types/FuelOperationsForm';
import { DivNone } from 'global-styled/global-styled';
import fuelOperationsPermissions from '../_config-data/permissions';
import { fuelOperationsFormSchema } from './schema';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { getDefaultFuelOperationElement } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import useMeasureUnitOperationOptions from './use/useMeasureUnitOperationOptions';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionCreateFuelOperation, actionUpdateFuelOperation } from 'redux-main/reducers/modules/fuel_operations/actions_fuel_operations';

const FuelOperationsForm: React.FC<PropsFuelOperations> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    IS_CREATING,
    isPermitted,
  } = props;

  const title = !IS_CREATING ? 'Изменение операции для расчета топлива' : 'Добавление операции для расчета топлива';

  const {
    measureUnitOperationOptions,
  } = useMeasureUnitOperationOptions(
    props.actionLoadMeasureUnit,
    page, path,
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-fuel-operation" show onHide={props.hideWithoutChanges} backdrop="static">
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <ExtField
          type="string"
          label="Операция"
          value={state.name}
          error={errors.name}
          onChange={props.handleChange}
          boundKeys="name"
          disabled={!isPermitted}
        />
        <ExtField
          type="select"
          label="Единица измерения"
          value={state.measure_unit_id}
          error={errors.measure_unit_id}
          options={measureUnitOperationOptions}
          onChange={props.handleChange}
          boundKeys="measure_unit_id"
          disabled={!isPermitted}
        />
        <ExtField
          type="boolean"
          label="Без учета пробега"
          value={state.is_excluding_mileage}
          error={errors.is_excluding_mileage}
          onChange={props.handleChangeBoolean}
          boundKeys="is_excluding_mileage"
          disabled={!isPermitted}
          className="checkbox-input flex-reverse"
        />
        <ExtField
          type="boolean"
          label="Для спецоборудования"
          value={state.equipment}
          error={errors.equipment}
          onChange={props.handleChangeBoolean}
          boundKeys="equipment"
          disabled={!isPermitted}
          className="checkbox-input flex-reverse"
        />
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
          : (
            <DivNone />
          )
        }
        <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsFuelOperations, OwnFuelOperationsProps>(
  connect<StatePropsFuelOperations, DispatchPropsFuelOperations, OwnFuelOperationsProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadMeasureUnit: (...arg) => (
        dispatch(
          actionLoadMeasureUnit(...arg),
        )
      ),
    }),
  ),
  withForm<PropsFuelOperationsWithForm, FuelOperationActive>({
    uniqField: 'id',
    createAction: actionCreateFuelOperation,
    updateAction: actionUpdateFuelOperation,
    mergeElement: (props) => {
      return getDefaultFuelOperationElement(props.element);
    },
    schema: fuelOperationsFormSchema,
    permissions: fuelOperationsPermissions,
  }),
)(FuelOperationsForm);
