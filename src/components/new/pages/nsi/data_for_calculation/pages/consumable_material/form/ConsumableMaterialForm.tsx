import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsConsumableMaterial,
  PropsConsumableMaterialWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/@types/ConsumableMaterialForm';
import { DivNone } from 'global-styled/global-styled';
import consumableMaterialPermissions from '../_config-data/permissions';
import { consumableMaterialFormSchema } from './schema';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { getDefaultConsumableMaterialElement } from './utils';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useMeasureUnitOptions from './use/useMeasureUnitOptions';
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
  } = useMeasureUnitOptions(
    props,
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

export default compose<PropsConsumableMaterial, PropsConsumableMaterialWithForm>(
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
