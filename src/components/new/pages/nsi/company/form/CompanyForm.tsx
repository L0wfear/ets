import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import companyPermissions from 'components/new/pages/nsi/company/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { companySchema } from 'components/new/pages/nsi/company/form/shema';
import companyActions from 'redux-main/reducers/modules/company/actions';

import { getDefaultCompanyElement } from 'components/new/pages/nsi/company/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnCompanyProps,
  PropsCompany,
  StateCompany,
  StatePropsCompany,
  DispatchPropsCompany,
  PropsCompanyWithForm,
} from 'components/new/pages/nsi/company/form/@types/CompanyList.h';
import { Company } from 'redux-main/reducers/modules/company/@types';
import { DivNone } from 'global-styled/global-styled';

class CompanyForm extends React.PureComponent<PropsCompany, StateCompany> {
  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.company_id;

    const title = !IS_CREATING ? 'Карточка организации' : 'Карточка организации';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-companies" show onHide={this.props.hideWithoutChanges} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                id="short_name"
                modalKey={page}
                type="string"
                label="Наименование"
                value={state.short_name}
                error={errors.short_name}
                onChange={this.props.handleChange}
                boundKeys="short_name"
                disabled
              />
            </Col>
            <Col md={12}>
              <ExtField
                id="has_remote_checkup"
                modalKey={page}
                type="boolean"
                label="Наличие дистанционного мед. осмотра"
                value={state.has_remote_checkup}
                error={errors.has_remote_checkup}
                onChange={this.props.handleChangeBoolean}
                boundKeys="has_remote_checkup"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsCompany, OwnCompanyProps>(
  connect<StatePropsCompany, DispatchPropsCompany, OwnCompanyProps, ReduxState>(
    null,
  ),
  withForm<PropsCompanyWithForm, Company>({
    uniqField: 'company_id',
    createAction: companyActions.actionCreateCompany,
    updateAction: companyActions.actionUpdateCompany,
    mergeElement: (props) => {
      return getDefaultCompanyElement(props.element);
    },
    schema: companySchema,
    permissions: companyPermissions,
  }),
)(CompanyForm);
