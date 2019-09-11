import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import PgmStorePermissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PgmStoreFormSchema } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/schema';

import { getDefaultPgmStoreFormElement } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsPgmStoreForm,
  PropsPgmStoreForm,
  PropsPgmStoreFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/@types/PgmStoreForm.h';

import { DivNone } from 'global-styled/global-styled';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { actionsPgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/actions';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';

const PgmStoreForm: React.FC<PropsPgmStoreForm> = React.memo(
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
        id="modal-PgmStore"
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
              <ExtField
                type="string"
                value={state.liquid_pgm_volume}
                label="Объем жидких ПГМ:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.solid_pgm_volume}
                label="Объем твердых ПГМ:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.pgm_stores_type_name}
                label="Тип ПГМ:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity="pgmStore" />
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

export default compose<PropsPgmStoreForm, OwnPropsPgmStoreForm>(
  withForm<PropsPgmStoreFormWithForm, PgmStore>({
    uniqField: 'id',
    createAction: actionsPgmStore.post,
    updateAction: actionsPgmStore.put,
    mergeElement: (props) => {
      return getDefaultPgmStoreFormElement(props.element);
    },
    schema: PgmStoreFormSchema,
    permissions: PgmStorePermissions,
  }),
)(PgmStoreForm);
