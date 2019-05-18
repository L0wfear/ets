import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import mspPermissions from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { mspFormSchema } from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/schema';

import { getDefaultMspFormElement } from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsMspForm,
  PropsMspForm,
  StateMspForm,
  StatePropsMspForm,
  DispatchPropsMspForm,
  PropsMspFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/@types/MspForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { isNumber } from 'util';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';

class MspForm extends React.PureComponent<PropsMspForm, StateMspForm> {
  render() {
    const { formState: state, page, path } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Просмотр объекта' : 'Просмотр объекта';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-msp"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
        backdrop="static">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FlexContainer isWrap>
            <Flex grow={1} shrink={1} basis={200}>
              {this.props.userData.isKgh || this.props.userData.isOkrug ? (
                <ExtField
                  type="string"
                  value={state.company_name || '-'}
                  label={
                    this.props.userData.isKgh
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
          {isPermitted && false ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsMspForm, OwnPropsMspForm>(
  connect<StatePropsMspForm, DispatchPropsMspForm, OwnPropsMspForm, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
  ),
  withForm<PropsMspFormWithForm, Msp>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreateMsp,
    updateAction: geoobjectActions.actionUpdateMsp,
    mergeElement: (props) => {
      return getDefaultMspFormElement(props.element);
    },
    schema: mspFormSchema,
    permissions: mspPermissions,
  }),
)(MspForm);
