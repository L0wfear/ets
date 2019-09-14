import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import FuelingWaterPermissions from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { FuelingWaterFormSchema } from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/schema';

import { getDefaultFuelingWaterFormElement } from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsFuelingWaterForm,
  PropsFuelingWaterFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/@types/FuelingWaterForm.h';

import { DivNone } from 'global-styled/global-styled';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import ExtField from 'components/@next/@ui/renderFields/Field';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { actionsFuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/actions';

const FuelingWaterForm: React.FC<PropsFuelingWaterForm> = React.memo(
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
        id="modal-FuelingWater"
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
              <MapGeoobjectWrap geoobjectData={state} entity="fuelingWater" />
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

export default compose<PropsFuelingWaterForm, PropsFuelingWaterFormWithForm>(
  withForm<PropsFuelingWaterFormWithForm, FuelingWater>({
    uniqField: 'id',
    createAction: actionsFuelingWater.post,
    updateAction: actionsFuelingWater.put,
    mergeElement: (props) => {
      return getDefaultFuelingWaterFormElement(props.element);
    },
    schema: FuelingWaterFormSchema,
    permissions: FuelingWaterPermissions,
  }),
)(FuelingWaterForm);
