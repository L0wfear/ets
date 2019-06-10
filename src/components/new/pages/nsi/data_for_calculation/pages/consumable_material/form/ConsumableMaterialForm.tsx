import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnConsumableMaterialProps,
  PropsConsumableMaterial,
  StatePropsConsumableMaterial,
  DispatchPropsConsumableMaterial,
  PropsConsumableMaterialWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/@types/ConsumableMaterialForm';
import { DivNone } from 'global-styled/global-styled';
import consumableMaterialPermissions from '../_config-data/permissions';
import { consumableMaterialFormSchema } from './schema';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { getDefaultConsumableMaterialElement } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import useMeasureUnitOperationOptions from './use/useMeasureUnitOptions';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionCreateConsumableMaterial, actionUpdateConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/actions_consumable_material';

const ConsumableMaterialForm: React.FC<PropsConsumableMaterial> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    IS_CREATING,
    isPermitted,
  } = props;

  const title = (
    !IS_CREATING
      ? 'Изменение расходного материала'
      : 'Добавление расходного материала'
  );

  const {
    measureUnitOptions,
  } = useMeasureUnitOperationOptions(
    props.actionLoadMeasureUnit,
    page, path,
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-consumable_material" show onHide={props.hideWithoutChanges}>
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <ExtField
          type="string"
          label="Наименование"
          value={state.name}
          error={errors.name}
          onChange={props.handleChange}
          boundKeys="name"
          disabled={!isPermitted}
        />
        <ExtField
          type="select"
          label="Единица измерения"
          options={measureUnitOptions}
          value={state.measure_unit_id}
          error={errors.measure_unit_id}
          onChange={props.handleChange}
          boundKeys="measure_unit_id"
          disabled={!isPermitted}
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

export default compose<PropsConsumableMaterial, OwnConsumableMaterialProps>(
  connect<StatePropsConsumableMaterial, DispatchPropsConsumableMaterial, OwnConsumableMaterialProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadMeasureUnit: (...arg) => (
        dispatch(
          actionLoadMeasureUnit(...arg),
        )
      ),
    }),
  ),
  withForm<PropsConsumableMaterialWithForm, ConsumableMaterial>({
    uniqField: 'id',
    createAction: actionCreateConsumableMaterial,
    updateAction: actionUpdateConsumableMaterial,
    mergeElement: (props) => {
      return getDefaultConsumableMaterialElement(props.element);
    },
    schema: consumableMaterialFormSchema,
    permissions: consumableMaterialPermissions,
  }),
)(ConsumableMaterialForm);
