import * as React from 'react';
import { compose } from 'recompose';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';
import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';

import carpoolPermissions from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { carpoolSchema } from 'components/new/pages/nsi/geoobjects/pages/carpool/form/schema';

import { getDefaultCarpoolElement } from 'components/new/pages/nsi/geoobjects/pages/carpool/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsCarpoolForm,
  PropsCarpoolForm,
  PropsCarpoolFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/carpool/form/@types/CarpoolForm.h';

import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { actionsCarpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/actions';

const CarpoolForm: React.FC<PropsCarpoolForm> = React.memo(
  (props) => {
    const {
      formState: state,
      page,
      path,
      IS_CREATING,
    } = props;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';

    return (
      <EtsBootstrap.ModalContainer id="modal-carpool" show onHide={props.hideWithoutChanges} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <FlexContainer isWrap>
            <Flex grow={1} shrink={1} basis={200}>
              {
                props.userData.isKgh || props.userData.isOkrug
                  ? (
                    <ExtField
                      type="string"
                      value={state.company_name || '-'}
                      label={props.userData.isKgh ? 'Наименование ГБУ:' : 'Учреждение:'}
                      readOnly
                    />
                  )
                  : (
                    <DivNone />
                  )
              }
              <ExtField
                type="string"
                value={state.name}
                label="Полное наименование:"
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
              <MapGeoobjectWrap
                geoobjectData={state}
                entity="carpool"
              />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsCarpoolForm, OwnPropsCarpoolForm>(
  withForm<PropsCarpoolFormWithForm, Carpool>({
    uniqField: 'id',
    createAction: actionsCarpool.post,
    updateAction: actionsCarpool.put,
    mergeElement: (props) => {
      return getDefaultCarpoolElement(props.element);
    },
    schema: carpoolSchema,
    permissions: carpoolPermissions,
  }),
)(CarpoolForm);
