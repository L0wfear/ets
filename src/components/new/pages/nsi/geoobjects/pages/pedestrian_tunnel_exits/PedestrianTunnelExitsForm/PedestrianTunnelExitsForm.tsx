import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import PedestrianTunnelExitsPermissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelExitsFormSchema } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/schema';

import { getDefaultPedestrianTunnelExitsFormElement } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsPedestrianTunnelExitsForm,
  PropsPedestrianTunnelExitsForm,
  StatePedestrianTunnelExitsForm,
  StatePropsPedestrianTunnelExitsForm,
  PropsPedestrianTunnelExitsFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/@types/PedestrianTunnelExitsForm.h';

import { DivNone } from 'global-styled/global-styled';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';
import { actionCreatePedestrianTunnelExits, actionUpdatePedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/actions';

class PedestrianTunnelExitsForm extends React.PureComponent<
  PropsPedestrianTunnelExitsForm,
  StatePedestrianTunnelExitsForm
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
        id="modal-PedestrianTunnelExits"
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
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={state}
                entity="pedestrianTunnelExits"
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
  PropsPedestrianTunnelExitsForm,
  OwnPropsPedestrianTunnelExitsForm
>(
  connect<
    StatePropsPedestrianTunnelExitsForm,
    {},
    OwnPropsPedestrianTunnelExitsForm,
    ReduxState
  >((state) => ({
    userData: getSessionState(state).userData,
  })),
  withForm<PropsPedestrianTunnelExitsFormWithForm, PedestrianTunnelExits>({
    uniqField: 'id',
    createAction: actionCreatePedestrianTunnelExits,
    updateAction: actionUpdatePedestrianTunnelExits,
    mergeElement: (props) => {
      return getDefaultPedestrianTunnelExitsFormElement(props.element);
    },
    schema: PedestrianTunnelExitsFormSchema,
    permissions: PedestrianTunnelExitsPermissions,
  }),
)(PedestrianTunnelExitsForm);
