import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
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
      <EtsBootstrap.ModalContainer id="modal-companies" show onHide={this.props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
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
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
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
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <EtsBootstrap.Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
          : (
            <DivNone />
          )
        }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
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
