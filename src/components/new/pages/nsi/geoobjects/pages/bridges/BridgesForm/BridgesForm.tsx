import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import bridgesPermissions from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { bridgesFormSchema } from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/schema';

import { getDefaultBridgesFormElement } from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsBridgesForm,
  PropsBridgesForm,
  StateBridgesForm,
  StatePropsBridgesForm,
  PropsBridgesFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/@types/BridgesForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';
import { actionsBridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/actions';

class BridgesForm extends React.PureComponent<
  PropsBridgesForm,
  StateBridgesForm
> {
  render() {
    const { formState: state, page, path } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Просмотр объекта' : 'Просмотр объекта';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-bridges"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
       >
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
                label="Наименование:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.district_text}
                label="Район:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.location}
                label="Местоположение объекта:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.crossing}
                label="Пересечение:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.year_of_commissioning}
                label="Год ввода в эксплуатацию:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.global_id}
                label="Идентификатор моста:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity="bridges" />
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

export default compose<PropsBridgesForm, OwnPropsBridgesForm>(
  connect<StatePropsBridgesForm, {}, OwnPropsBridgesForm, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
  ),
  withForm<PropsBridgesFormWithForm, Bridges>({
    uniqField: 'id',
    createAction: actionsBridges.post,
    updateAction: actionsBridges.put,
    mergeElement: (props) => {
      return getDefaultBridgesFormElement(props.element);
    },
    schema: bridgesFormSchema,
    permissions: bridgesPermissions,
  }),
)(BridgesForm);
