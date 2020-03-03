import * as React from 'react';
import { isNumber } from 'util';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import mspPermissions from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { mspFormSchema } from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/schema';

import { getDefaultMspFormElement } from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsMspForm,
  PropsMspFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/@types/MspForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { actionsMsp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/actions';

const MspForm: React.FC<PropsMspForm> = React.memo(
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
        id="modal-msp"
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
                label="Полное наименование:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.shortname}
                label="Краткое наименование:"
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
                value={
                  isNumber(state.productivity)
                    ? parseFloat(state.productivity.toString()).toFixed(2)
                    : ''
                }
                label="Производительность (куб. м в сутки):"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity={'msp'} />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            (isPermitted && false) && ( // либо обновление, либо создание
              <EtsBootstrap.Button
                disabled={!props.canSave}
                onClick={props.defaultSubmit}>
                Сохранить
              </EtsBootstrap.Button>
            )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsMspForm, PropsMspFormWithForm>(
  withForm<PropsMspFormWithForm, Msp>({
    uniqField: 'id',
    createAction: actionsMsp.post,
    updateAction: actionsMsp.put,
    mergeElement: (props) => {
      return getDefaultMspFormElement(props.element);
    },
    schema: mspFormSchema,
    permissions: mspPermissions,
  }),
)(MspForm);
