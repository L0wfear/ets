import * as React from 'react';
import { isNumber } from 'util';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import DangerZonePermissions from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DangerZoneFormSchema } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/schema';

import { getDefaultDangerZoneFormElement } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsDangerZoneForm,
  PropsDangerZoneForm,
  PropsDangerZoneFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/@types/DangerZoneForm.h';

import { DivNone } from 'global-styled/global-styled';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { actionsDangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/actions';

const DangerZoneForm: React.FC<PropsDangerZoneForm> = React.memo(
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
        id="modal-DangerZone"
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
                label="Наименование ОДХ:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.address_comm}
                label="Адресная привязка:"
                readOnly
              />
              <ExtField
                type="string"
                value={
                  isNumber(state.roadway_area)
                    ? parseFloat(state.roadway_area.toString()).toFixed(2)
                    : ''
                }
                label="Площадь на проезжей части, м²:"
                readOnly
              />
              <ExtField
                type="string"
                value={
                  isNumber(state.sidewalk_area)
                    ? parseFloat(state.sidewalk_area.toString()).toFixed(2)
                    : ''
                }
                label="Площадь на тротуаре, м²:"
                readOnly
              />
              <ExtField
                type="string"
                value={
                  isNumber(state.sidelines_area)
                    ? parseFloat(state.sidelines_area.toString()).toFixed(2)
                    : ''
                }
                label="Площадь на обочинах, м²:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity="dangerZone" />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted && false ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!props.canSave}
              onClick={props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsDangerZoneForm, OwnPropsDangerZoneForm>(
  withForm<PropsDangerZoneFormWithForm, DangerZone>({
    uniqField: 'id',
    createAction: actionsDangerZone.post,
    updateAction: actionsDangerZone.put,
    mergeElement: (props) => {
      return getDefaultDangerZoneFormElement(props.element);
    },
    schema: DangerZoneFormSchema,
    permissions: DangerZonePermissions,
  }),
)(DangerZoneForm);
