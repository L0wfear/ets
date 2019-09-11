import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import SnowStoragePermissions from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { SnowStorageFormSchema } from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/schema';

import { getDefaultSnowStorageFormElement } from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsSnowStorageForm,
  PropsSnowStorageForm,
  PropsSnowStorageFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/@types/SnowStorageForm.h';

import { DivNone } from 'global-styled/global-styled';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { actionsSnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/actions';

const SnowStorageForm: React.FC<PropsSnowStorageForm> = React.memo(
  (props) => {
    const {
      formState: state,
      page, path,
      IS_CREATING,
      isPermitted,
    } = props;

    const title = !IS_CREATING ? 'Просмотр объекта' : 'Просмотр объекта';

    return (
      <EtsBootstrap.ModalContainer
        id="modal-SnowStorage"
        show
        onHide={props.hideWithoutChanges}
        bsSize="large"
       >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FlexContainer isWrap>
            <Flex grow={1} shrink={1} basis={200}>
              {props.userData.isKgh || props.userData.isOkrug ? (
                <ExtField
                  type="string"
                  value={state.company_name || '-'}
                  label={
                    props.userData.isKgh
                      ? 'Наименование ГБУ:'
                      : 'Учреждение:'
                  }
                  readOnly
                />
              ) : (
                <DivNone />
              )}
              <ExtField
                type="string"
                value={state.name}
                label="Наименование:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.address}
                label="Адрес:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity="snowStorage" />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted && false ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!props.canSave}
              onClick={props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsSnowStorageForm, OwnPropsSnowStorageForm>(
  withForm<PropsSnowStorageFormWithForm, SnowStorage>({
    uniqField: 'id',
    createAction: actionsSnowStorage.post,
    updateAction: actionsSnowStorage.put,
    mergeElement: (props) => {
      return getDefaultSnowStorageFormElement(props.element);
    },
    schema: SnowStorageFormSchema,
    permissions: SnowStoragePermissions,
  }),
)(SnowStorageForm);
