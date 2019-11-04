import * as React from 'react';
import { compose } from 'recompose';
import { isNumber } from 'util';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import sspPermissions from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { sspFormSchema } from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/schema';

import { getDefaultSspFormElement } from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsSspForm,
  PropsSspForm,
  PropsSspFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/@types/SspForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import { actionsSsp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/actions';

const SspForm: React.FC<PropsSspForm> = React.memo(
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
        id="modal-ssp"
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
              <ExtField
                type="string"
                value={get(
                  YES_NO_SELECT_OPTIONS_INT.find(
                    ({ value }) => value === state.is_mobile,
                  ),
                  'label',
                  '-',
                )}
                label="Мобильность:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity="ssp" />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            (isPermitted && false) && (
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

export default compose<PropsSspForm, OwnPropsSspForm>(
  withForm<PropsSspFormWithForm, Ssp>({
    uniqField: 'id',
    createAction: actionsSsp.post,
    updateAction: actionsSsp.put,
    mergeElement: (props) => {
      return getDefaultSspFormElement(props.element);
    },
    schema: sspFormSchema,
    permissions: sspPermissions,
  }),
)(SspForm);
