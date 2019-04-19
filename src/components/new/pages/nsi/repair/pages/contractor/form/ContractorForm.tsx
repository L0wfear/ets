import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
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
import { Row, Col } from 'react-bootstrap';
import { Contractor } from 'redux-main/reducers/modules/repair/cleaning_rate/@types/contractor';
import { actionCreateContractor, actionUpdateContractor } from 'redux-main/reducers/modules/repair/cleaning_rate/actions_contractor';

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
    <Modal id="modal-contractor" show onHide={props.hideWithoutChanges} backdrop="static" bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={6}>
            <ExtField
              type="string"
              label="Наименование"
              error={errors.name}
              value={state.name}
              onChange={props.handleChange}
              boundKeys="name"
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <ExtField
              type="string"
              label="ИНН"
              error={errors.inn}
              value={state.inn}
              onChange={props.handleChange}
              boundKeys="inn"
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="string"
              label="КПП"
              error={errors.kpp}
              value={state.kpp}
              onChange={props.handleChange}
              boundKeys="kpp"
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="string"
              label="ОГРН"
              error={errors.ogrn}
              value={state.ogrn}
              onChange={props.handleChange}
              boundKeys="ogrn"
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="string"
              label="ОКПО"
              error={errors.okpo}
              value={state.okpo}
              onChange={props.handleChange}
              boundKeys="okpo"
            />
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <ExtField
              type="string"
              label="Почтовый адрес"
              error={errors.postal_address}
              value={state.postal_address}
              onChange={props.handleChange}
              boundKeys="postal_address"
            />
          </Col>
          <Col md={4}>
            <ExtField
              type="string"
              label="Электронный адрес"
              error={errors.email}
              value={state.email}
              onChange={props.handleChange}
              boundKeys="email"
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ExtField
              type="string"
              label="Телефон"
              error={errors.phone}
              value={state.phone}
              onChange={props.handleChange}
              boundKeys="phone"
            />
          </Col>
          <Col md={4}>
            <ExtField
              type="string"
              label="Факс"
              error={errors.fax}
              value={state.fax}
              onChange={props.handleChange}
              boundKeys="fax"
            />
          </Col>
          <Col md={4}>
            <ExtField
              type="string"
              label="БИК"
              error={errors.bik}
              value={state.bik}
              onChange={props.handleChange}
              boundKeys="bik"
            />
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        <div>
          {
            isPermitted // либо обновление, либо создание
            ? (
              <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
            )
            : (
              <DivNone />
            )
          }
          <Button onClick={props.hideWithoutChanges}>Отменить</Button>
        </div>
      </Modal.Footer>
    </Modal>
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
