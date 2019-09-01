import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryManufacturerProps,
  PropsBatteryManufacturer,
  StatePropsBatteryManufacturer,
  DispatchPropsBatteryManufacturer,
  PropsBatteryManufacturerWithForm,
} from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/form/@types/BatteryManufacturerForm';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { getDefaultBatteryManufacturerElement } from './utils';
import { batteryManufacturerFormSchema } from './schema';
import batteryManufacturerPermissions from '../_config-data/permissions';
import { autobaseCreateBatteryManufacturer, autobaseUpdateBatteryManufacturer } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/actions';

const BatteryManufacturerForm: React.FC<PropsBatteryManufacturer> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

  return (
    <EtsBootstrap.ModalContainer id="modal-battery-manufacturer" show onHide={props.hideWithoutChanges}>
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              id={name}
              type="string"
              label="Производитель аккумулятора"
              value={state.name}
              error={errors.name}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="name"
              modalKey={page}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
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
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsBatteryManufacturer, OwnBatteryManufacturerProps>(
  connect<StatePropsBatteryManufacturer, DispatchPropsBatteryManufacturer, OwnBatteryManufacturerProps, ReduxState>(
    null,
  ),
  withForm<PropsBatteryManufacturerWithForm, BatteryManufacturer>({
    uniqField: 'id',
    createAction: autobaseCreateBatteryManufacturer,
    updateAction: autobaseUpdateBatteryManufacturer,
    mergeElement: (props) => {
      return getDefaultBatteryManufacturerElement(props.element);
    },
    schema: batteryManufacturerFormSchema,
    permissions: batteryManufacturerPermissions,
  }),
)(BatteryManufacturerForm);
