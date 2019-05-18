import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import PgmStorePermissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { PgmStoreFormSchema } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/schema';

import { getDefaultPgmStoreFormElement } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsPgmStoreForm,
  PropsPgmStoreForm,
  StatePgmStoreForm,
  StatePropsPgmStoreForm,
  DispatchPropsPgmStoreForm,
  PropsPgmStoreFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/@types/PgmStoreForm.h';

import { DivNone } from 'global-styled/global-styled';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';

class PgmStoreForm extends React.PureComponent<
  PropsPgmStoreForm,
  StatePgmStoreForm
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
        id="modal-PgmStore"
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

export default compose<PropsPgmStoreForm, OwnPropsPgmStoreForm>(
  connect<
    StatePropsPgmStoreForm,
    DispatchPropsPgmStoreForm,
    OwnPropsPgmStoreForm,
    ReduxState
  >((state) => ({
    userData: getSessionState(state).userData,
  })),
  withForm<PropsPgmStoreFormWithForm, PgmStore>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreatePgmStore,
    updateAction: geoobjectActions.actionUpdatePgmStore,
    mergeElement: (props) => {
      return getDefaultPgmStoreFormElement(props.element);
    },
    schema: PgmStoreFormSchema,
    permissions: PgmStorePermissions,
  }),
)(PgmStoreForm);
