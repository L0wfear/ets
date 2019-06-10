import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import PedestrianTunnelsPermissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelsFormSchema } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/schema';

import { getDefaultPedestrianTunnelsFormElement } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsPedestrianTunnelsForm,
  PropsPedestrianTunnelsForm,
  StatePedestrianTunnelsForm,
  StatePropsPedestrianTunnelsForm,
  DispatchPropsPedestrianTunnelsForm,
  PropsPedestrianTunnelsFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/@types/PedestrianTunnelsForm.h';

import { DivNone } from 'global-styled/global-styled';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';

class PedestrianTunnelsForm extends React.PureComponent<
  PropsPedestrianTunnelsForm,
  StatePedestrianTunnelsForm
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
        id="modal-PedestrianTunnels"
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
                value={state.adm_area}
                label="Административный округ:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.district}
                label="Район:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.location}
                label="Адресный ориентир:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={state}
                entity="pedestrianTunnels"
              />
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

export default compose<
  PropsPedestrianTunnelsForm,
  OwnPropsPedestrianTunnelsForm
>(
  connect<
    StatePropsPedestrianTunnelsForm,
    DispatchPropsPedestrianTunnelsForm,
    OwnPropsPedestrianTunnelsForm,
    ReduxState
  >((state) => ({
    userData: getSessionState(state).userData,
  })),
  withForm<PropsPedestrianTunnelsFormWithForm, PedestrianTunnels>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreatePedestrianTunnels,
    updateAction: geoobjectActions.actionUpdatePedestrianTunnels,
    mergeElement: (props) => {
      return getDefaultPedestrianTunnelsFormElement(props.element);
    },
    schema: PedestrianTunnelsFormSchema,
    permissions: PedestrianTunnelsPermissions,
  }),
)(PedestrianTunnelsForm);
