import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryBrandProps,
  PropsBatteryBrand,
  StatePropsBatteryBrand,
  DispatchPropsBatteryBrand,
  PropsBatteryBrandWithForm,
} from 'components/new/pages/nsi/autobase/pages/battery_brand/form/@types/BatteryBrandForm';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { batteryBrandFormSchema } from './schema';
import batteryBrandPermissions from '../_config-data/permissions';
import { getDefaultBatteryBrandElement } from './utils';

const BatteryBrandForm: React.FC<PropsBatteryBrand> = (props) => {
  const [batteryManufacturerOptions, setBatteryManufacturerOptions] = React.useState([]);
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

  React.useEffect(
    () => {
      props.autobaseGetSetBatteryManufacturer().then(
        ({ payload: { data } }) => (
          setBatteryManufacturerOptions(
            data.map(defaultSelectListMapper),
          )
        ),
      );
    },
    [],
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-battery_brand" show onHide={props.hideWithoutChanges}>
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="name"
              type="string"
              label="Марка аккумулятора"
              value={state.name}
              error={errors.name}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="name"
              modalKey={page}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="manufacturer_id"
              type="select"
              label="Производитель аккумулятора"
              options={batteryManufacturerOptions}
              value={state.manufacturer_id}
              error={errors.manufacturer_id}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="manufacturer_id"
              clearable={false}
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

export default compose<PropsBatteryBrand, OwnBatteryBrandProps>(
  connect<StatePropsBatteryBrand, DispatchPropsBatteryBrand, OwnBatteryBrandProps, ReduxState>(
    null,
    (dispatch, { page, path }) => ({
      autobaseGetSetBatteryManufacturer: () => (
        dispatch(
          autobaseActions.autobaseGetSetBatteryManufacturer(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsBatteryBrandWithForm, BatteryBrand>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateBatteryBrand,
    updateAction: autobaseActions.autobaseUpdateBatteryBrand,
    mergeElement: (props) => {
      return getDefaultBatteryBrandElement(props.element);
    },
    schema: batteryBrandFormSchema,
    permissions: batteryBrandPermissions,
  }),
)(BatteryBrandForm);
