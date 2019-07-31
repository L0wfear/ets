import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import SnowStoragePermissions from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { SnowStorageFormSchema } from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/schema';

import { getDefaultSnowStorageFormElement } from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsSnowStorageForm,
  PropsSnowStorageForm,
  StateSnowStorageForm,
  StatePropsSnowStorageForm,
  DispatchPropsSnowStorageForm,
  PropsSnowStorageFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/@types/SnowStorageForm.h';

import { DivNone } from 'global-styled/global-styled';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';

class SnowStorageForm extends React.PureComponent<
  PropsSnowStorageForm,
  StateSnowStorageForm
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
        id="modal-SnowStorage"
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

export default compose<PropsSnowStorageForm, OwnPropsSnowStorageForm>(
  connect<
    StatePropsSnowStorageForm,
    DispatchPropsSnowStorageForm,
    OwnPropsSnowStorageForm,
    ReduxState
  >((state) => ({
    userData: getSessionState(state).userData,
  })),
  withForm<PropsSnowStorageFormWithForm, SnowStorage>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreateSnowStorage,
    updateAction: geoobjectActions.actionUpdateSnowStorage,
    mergeElement: (props) => {
      return getDefaultSnowStorageFormElement(props.element);
    },
    schema: SnowStorageFormSchema,
    permissions: SnowStoragePermissions,
  }),
)(SnowStorageForm);
