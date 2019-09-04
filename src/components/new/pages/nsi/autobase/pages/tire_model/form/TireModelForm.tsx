import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTireModelProps,
  PropsTireModel,
  StatePropsTireModel,
  PropsTireModelWithForm,
} from 'components/new/pages/nsi/autobase/pages/tire_model/form/@types/TireModelForm';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { getDefaultTireModelElement } from './utils';
import { tireModelFormSchema } from './schema';
import tireModelPermissions from '../_config-data/permissions';
import { tireManufacturerGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_manufacturer/actions';
import { autobaseCreateTireModel, autobaseUpdateTireModel } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/actions';

const TireModelForm: React.FC<PropsTireModel> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    tireManufacturerList,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

  React.useEffect(
    () => {
      props.dispatch(
        tireManufacturerGetAndSetInStore(
          {},
          props,
        ),
      );
    },
    [],
  );

  const tireManufacturerOptions = React.useMemo(
    () => (
      tireManufacturerList.map(defaultSelectListMapper)
    ),
    [tireManufacturerList],
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-tire_model" show onHide={props.hideWithoutChanges}>
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="name"
              type="string"
              label="Модель шины"
              value={state.name}
              error={errors.name}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="name"
              modalKey={path}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="tire_manufacturer_id"
              type="select"
              label="Производитель шины"
              options={tireManufacturerOptions}
              value={state.tire_manufacturer_id}
              error={errors.tire_manufacturer_id}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="tire_manufacturer_id"
              clearable={false}
              modalKey={path}
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

export default compose<PropsTireModel, OwnTireModelProps>(
  connect<StatePropsTireModel, {}, OwnTireModelProps, ReduxState>(
    (state) => ({
      tireManufacturerList: getAutobaseState(state).tireManufacturerList,
    }),
  ),
  withForm<PropsTireModelWithForm, TireModel>({
    uniqField: 'id',
    createAction: autobaseCreateTireModel,
    updateAction: autobaseUpdateTireModel,
    mergeElement: (props) => {
      return getDefaultTireModelElement(props.element);
    },
    schema: tireModelFormSchema,
    permissions: tireModelPermissions,
  }),
)(TireModelForm);
