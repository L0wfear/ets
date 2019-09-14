import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import companyPermissions from 'components/new/pages/nsi/company/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { companySchema } from 'components/new/pages/nsi/company/form/shema';
import companyActions from 'redux-main/reducers/modules/company/actions';

import { getDefaultCompanyElement } from 'components/new/pages/nsi/company/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsCompany,
  PropsCompanyWithForm,
} from 'components/new/pages/nsi/company/form/@types/CompanyList.h';
import { Company } from 'redux-main/reducers/modules/company/@types';

const CompanyForm: React.FC<PropsCompany> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      IS_CREATING,
      isPermitted,
    } = props;

    const title = !IS_CREATING ? 'Карточка организации' : 'Карточка организации';

    return (
      <EtsBootstrap.ModalContainer id="modal-companies" show onHide={props.hideWithoutChanges}>
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
                onChange={props.handleChange}
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
                onChange={props.handleChangeBoolean}
                boundKeys="has_remote_checkup"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
        {
          isPermitted && (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
        }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsCompany, PropsCompanyWithForm>(
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
