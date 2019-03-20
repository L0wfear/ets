import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import PedestrianTunnelExitsPermissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelExitsFormSchema } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/schema';

import { getDefaultPedestrianTunnelExitsFormElement } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsPedestrianTunnelExitsForm,
  PropsPedestrianTunnelExitsForm,
  StatePedestrianTunnelExitsForm,
  StatePropsPedestrianTunnelExitsForm,
  DispatchPropsPedestrianTunnelExitsForm,
  PropsPedestrianTunnelExitsFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/@types/PedestrianTunnelExitsForm.h';

import { DivNone } from 'global-styled/global-styled';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';

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
      <Modal
        id="modal-PedestrianTunnelExits"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
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
        <Modal.Footer>
          {isPermitted && false ? ( // либо обновление, либо создание
            <Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </Button>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<
  PropsPedestrianTunnelExitsForm,
  OwnPropsPedestrianTunnelExitsForm
>(
  connect<
    StatePropsPedestrianTunnelExitsForm,
    DispatchPropsPedestrianTunnelExitsForm,
    OwnPropsPedestrianTunnelExitsForm,
    ReduxState
  >((state) => ({
    userData: getSessionState(state).userData,
  })),
  withForm<PropsPedestrianTunnelExitsFormWithForm, PedestrianTunnelExits>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreatePedestrianTunnelExits,
    updateAction: geoobjectActions.actionUpdatePedestrianTunnelExits,
    mergeElement: (props) => {
      return getDefaultPedestrianTunnelExitsFormElement(props.element);
    },
    schema: PedestrianTunnelExitsFormSchema,
    permissions: PedestrianTunnelExitsPermissions,
  }),
)(PedestrianTunnelExitsForm);
