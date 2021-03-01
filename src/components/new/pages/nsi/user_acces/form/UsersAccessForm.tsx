import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import usersAccessPermissions from 'components/new/pages/nsi/user_acces/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { usersAccessSchema } from 'components/new/pages/nsi/user_acces/form/shema';
import { actionCreateUsersAccess, actionUpdateUsersAccess} from 'redux-main/reducers/modules/some_uniq/users_access/actions';

import { getDefaultUsersAccessElement } from 'components/new/pages/nsi/user_acces/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsUsersAccess,
  PropsUsersAccessWithForm,
} from 'components/new/pages/nsi/user_acces/form/@types/UsersAccessList.h';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';
import { actionGetAndSetInStoreCompany, actionResetSetCompany } from 'redux-main/reducers/modules/company/actions';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  getCompanyState, getSomeUniqState,
} from 'redux-main/reducers/selectors';
import { actionGetAndSetInStoreOkrugs } from 'redux-main/reducers/modules/some_uniq/okrugs/actions';
import { Okrug } from 'redux-main/reducers/modules/some_uniq/okrugs/@types';
import { Company } from 'redux-main/reducers/modules/company/@types';

type Options<T> = {
  value: number;
  label: string;
  rowData: T;
};

const UserAccessForm: React.FC<PropsUsersAccess> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      IS_CREATING,
      isPermitted,
      handleChange,
    } = props;
    const dispatch = etsUseDispatch();
    const companies = etsUseSelector((state) => getCompanyState(state).companyList);
    const okrugs = etsUseSelector((state) => getSomeUniqState(state).okrugsList);
    const okrugsOptions: Array<Options<Okrug>> = React.useMemo(() => okrugs.map((el) => ({value: el.okrug_id, label: el.okrug_name, rowData: el})), [okrugs]);
    const companiesOptions: Array<Options<Company>> = React.useMemo(() => companies.map((el) => ({value: el.company_id, label: el.company_name, rowData: el})), [companies]);

    const handleChangeOkrugs = React.useCallback((key, value, rowData) => {
      handleChange({
        [key]: value,
        access_okrugs: rowData.map((el) => ({id: el.value, name: el.label}))
      });
    }, []);

    const handleChangeCompanies = React.useCallback((key, value, rowData) => {
      handleChange({
        [key]: value,
        access_companies: rowData.map((el) => ({id: el.value, name: el.label}))
      });
    }, []);

    React.useEffect(() => {
      if (!okrugs.length) {
        dispatch(actionGetAndSetInStoreOkrugs({all: true}, {page, path}));
      }
    }, [okrugs]);

    React.useEffect(() => {
      if (okrugs.length && state.access_okrugs_ids.length) {
        const okrugs_ids = state.access_okrugs_ids.join(',');
        dispatch(actionGetAndSetInStoreCompany({all: true, okrugs_ids}, {page, path}));
      }
      if (!state.access_okrugs_ids.length && companies.length) {
        dispatch(actionResetSetCompany());
      }
    }, [okrugs, state.access_okrugs_ids]);

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    console.info(state);
    return (
      <EtsBootstrap.ModalContainer id="modal-users_access" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="access_okrugs_ids"
                modalKey={page}
                type="select"
                label="Округ"
                value={state.access_okrugs_ids}
                error={errors.access_okrugs_ids}
                onChange={handleChangeOkrugs}
                boundKeys="access_okrugs_ids"
                options={okrugsOptions}
                multi
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="access_companies_ids"
                modalKey={page}
                type="select"
                label="Компания"
                value={state.access_companies_ids}
                error={errors.access_companies_ids}
                onChange={handleChangeCompanies}
                boundKeys="access_companies_ids"
                options={companiesOptions}
                multi
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

export default compose<PropsUsersAccess, PropsUsersAccessWithForm>(
  withForm<PropsUsersAccessWithForm, User>({
    uniqField: 'id',
    createAction: actionCreateUsersAccess,
    updateAction: actionUpdateUsersAccess,
    mergeElement: (props) => {
      return getDefaultUsersAccessElement(props.element);
    },
    schema: usersAccessSchema,
    permissions: usersAccessPermissions,
  }),
)(UserAccessForm);
