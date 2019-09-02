import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import fountainsPermissions from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { fountainsFormSchema } from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/schema';

import { getDefaultFountainsFormElement } from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsFountainsForm,
  PropsFountainsForm,
  PropsFountainsFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/@types/FountainsForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import SimpleEmailA from 'components/new/ui/simple_a/email/index';
import SimplePhoneA from 'components/new/ui/simple_a/phone';
import SimpleLinkA from 'components/new/ui/simple_a/link';
import FountainWorkingHours from 'components/new/ui/render_some_s/fountain_working_hours';
import { actionsFountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/actions';

const FountainsForm: React.FC<PropsFountainsForm> = React.memo(
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
        id="modal-fountains"
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
              <ExtField
                type="string"
                value={state.departmental_affiliation}
                label="Ведомственная принадлежность:"
                readOnly
              />
              <ExtField
                type="string"
                value={<FountainWorkingHours data={state.working_hours} />}
                label="График работы:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.balance_holder_name}
                label="Балансодержатель:"
                readOnly
              />
              <ExtField
                type="string"
                value={<SimplePhoneA phone={state.balance_holder_phone} />}
                label="Телефон балансодержателя:"
                readOnly
              />
              <ExtField
                type="string"
                value={<SimpleEmailA email={state.balance_holder_email} />}
                label="Электронная почта балансодержателя:"
                readOnly
              />
              <ExtField
                type="string"
                value={
                  <SimpleLinkA
                    href={`//${state.balance_holder_web_site}`}
                    title={state.balance_holder_web_site}
                  />
                }
                label="Сайт балансодержателя:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.operation_organization_name}
                label="Эксплуатирующая организация:"
                readOnly
              />
              <ExtField
                type="string"
                value={
                  <SimplePhoneA phone={state.operation_organization_phone} />
                }
                label="Телефон эксплуатирующей организации:"
                readOnly
              />
              <ExtField
                type="string"
                value={
                  <SimpleEmailA email={state.operation_organization_email} />
                }
                label="Электронная почта эксплуатирующей организации:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap geoobjectData={state} entity={'fountains'} />
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

export default compose<PropsFountainsForm, OwnPropsFountainsForm>(
  withForm<PropsFountainsFormWithForm, Fountains>({
    uniqField: 'id',
    createAction: actionsFountains.post,
    updateAction: actionsFountains.put,
    mergeElement: (props) => {
      return getDefaultFountainsFormElement(props.element);
    },
    schema: fountainsFormSchema,
    permissions: fountainsPermissions,
  }),
)(FountainsForm);
