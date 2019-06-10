import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnContractorProps,
  PropsContractor,
  StatePropsContractor,
  DispatchPropsContractor,
  PropsContractorWithForm,
} from 'components/new/pages/nsi/repair/pages/contractor/form/@types/ContractorForm';
import { DivNone } from 'global-styled/global-styled';
import contractorPermissions from '../_config-data/permissions';
import { contractorFormSchema } from './schema';
import { getDefaultContractorElement } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';
import { actionCreateContractor, actionUpdateContractor } from 'redux-main/reducers/modules/repair/contractor/actions_contractor';

const ContractorForm: React.FC<PropsContractor> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    IS_CREATING,
    isPermitted,
  } = props;

  const title = (
    !IS_CREATING
      ? 'Изменение записи'
      : 'Создание записи'
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-contractor" show onHide={props.hideWithoutChanges} backdrop="static" bsSize="large">
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Наименование"
              error={errors.name}
              value={state.name}
              onChange={props.handleChange}
              boundKeys="name"
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={3}>
            <ExtField
              type="string"
              label="ИНН"
              error={errors.inn}
              value={state.inn}
              onChange={props.handleChange}
              boundKeys="inn"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
            <ExtField
              type="string"
              label="КПП"
              error={errors.kpp}
              value={state.kpp}
              onChange={props.handleChange}
              boundKeys="kpp"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
            <ExtField
              type="string"
              label="ОГРН"
              error={errors.ogrn}
              value={state.ogrn}
              onChange={props.handleChange}
              boundKeys="ogrn"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
            <ExtField
              type="string"
              label="ОКПО"
              error={errors.okpo}
              value={state.okpo}
              onChange={props.handleChange}
              boundKeys="okpo"
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={8}>
            <ExtField
              type="string"
              label="Почтовый адрес"
              error={errors.postal_address}
              value={state.postal_address}
              onChange={props.handleChange}
              boundKeys="postal_address"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="string"
              label="Электронный адрес"
              error={errors.email}
              value={state.email}
              onChange={props.handleChange}
              boundKeys="email"
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="string"
              label="Телефон"
              error={errors.phone}
              value={state.phone}
              onChange={props.handleChange}
              boundKeys="phone"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="string"
              label="Факс"
              error={errors.fax}
              value={state.fax}
              onChange={props.handleChange}
              boundKeys="fax"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="string"
              label="БИК"
              error={errors.bik}
              value={state.bik}
              onChange={props.handleChange}
              boundKeys="bik"
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
          : (
            <DivNone />
          )
        }
        <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsContractor, OwnContractorProps>(
  connect<StatePropsContractor, DispatchPropsContractor, OwnContractorProps, ReduxState>(
    null,
  ),
  withForm<PropsContractorWithForm, Contractor>({
    uniqField: 'id',
    createAction: actionCreateContractor,
    updateAction: actionUpdateContractor,
    mergeElement: (props) => {
      return getDefaultContractorElement(props.element);
    },
    schema: contractorFormSchema,
    permissions: contractorPermissions,
  }),
)(ContractorForm);
