import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsFuelOperations,
  PropsFuelOperationsWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/@types/FuelOperationsForm';
import fuelOperationsPermissions from '../_config-data/permissions';
import { fuelOperationsFormSchema } from './schema';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { getDefaultFuelOperationElement } from './utils';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { actionCreateFuelOperation, actionUpdateFuelOperation } from 'redux-main/reducers/modules/fuel_operations/actions_fuel_operations';
import useMeasureUnitOperationOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOperationOptions';

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

  const measureUnitOperationOptions = useMeasureUnitOperationOptions(
    props,
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-fuel-operation" show onHide={props.hideWithoutChanges}>
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
          options={measureUnitOperationOptions.options}
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
          isPermitted && (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
        }
        <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsFuelOperations, PropsFuelOperationsWithForm>(
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
