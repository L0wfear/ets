import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import PedestrianTunnelsPermissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelsFormSchema } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/schema';

import { getDefaultPedestrianTunnelsFormElement } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsPedestrianTunnelsForm,
  PropsPedestrianTunnelsFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/@types/PedestrianTunnelsForm.h';

import { DivNone } from 'global-styled/global-styled';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { actionsPedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/actions';

const PedestrianTunnelsForm: React.FC<PropsPedestrianTunnelsForm> = React.memo(
  (props) => {
    const {
      formState: state,
      page,
      path,
      IS_CREATING,
      isPermitted,
    } = props;

    const title = !IS_CREATING ? 'Просмотр объекта' : 'Просмотр объекта';

    return (
      <EtsBootstrap.ModalContainer
        id="modal-PedestrianTunnels"
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

export default compose<PropsPedestrianTunnelsForm, PropsPedestrianTunnelsFormWithForm>(
  withForm<PropsPedestrianTunnelsFormWithForm, PedestrianTunnels>({
    uniqField: 'id',
    createAction: actionsPedestrianTunnels.post,
    updateAction: actionsPedestrianTunnels.put,
    mergeElement: (props) => {
      return getDefaultPedestrianTunnelsFormElement(props.element);
    },
    schema: PedestrianTunnelsFormSchema,
    permissions: PedestrianTunnelsPermissions,
  }),
)(PedestrianTunnelsForm);
