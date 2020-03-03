import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsTireModel,
  PropsTireModelWithForm,
} from 'components/new/pages/nsi/autobase/pages/tire_model/form/@types/TireModelForm';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { getDefaultTireModelElement } from './utils';
import { tireModelFormSchema } from './schema';
import tireModelPermissions from '../_config-data/permissions';
import { tireManufacturerGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_manufacturer/actions';
import { autobaseCreateTireModel, autobaseUpdateTireModel } from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/actions';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const TireModelForm: React.FC<PropsTireModel> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      IS_CREATING,
      isPermitted,
    } = props;

    const dispatch = etsUseDispatch();
    const tireManufacturerList = etsUseSelector((stateRedux) => getAutobaseState(stateRedux).tireManufacturerList);

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';

    React.useEffect(
      () => {
        dispatch(
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
            isPermitted && (
              <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
            )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsTireModel, PropsTireModelWithForm>(
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
