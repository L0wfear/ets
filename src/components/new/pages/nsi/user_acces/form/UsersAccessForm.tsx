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
      isPermitted,
      handleChange,
    } = props;
    const dispatch = etsUseDispatch();
    const companies = etsUseSelector((state) => getCompanyState(state).companyList);
    const okrugs = etsUseSelector((state) => getSomeUniqState(state).okrugsList);
    const okrugsOptions: Array<Options<Okrug>> = React.useMemo(() => 
      okrugs.map((el) => ({
        value: el.okrug_id, 
        label: el.okrug_name, rowData: el
      })), [okrugs]);
    const companiesOptions: Array<Options<Company>> = React.useMemo(() => 
      companies.map((el) => ({
        value: el.company_id, 
        label: el.short_name, rowData: el
      })), [companies]);

    const onSubmit = React.useCallback(() => {
      const access_okrugs = okrugs.reduce((acc, curr) => {
        if(state.access_okrugs_ids.includes(curr.okrug_id)) {
          acc.push({id: curr.okrug_id, name: curr.okrug_name});
        }
        return acc;
      }, []);
      const access_companies = companies.reduce((acc, curr) => {
        if(state.access_companies_ids.includes(curr.company_id)) {
          acc.push({id: curr.company_id, name: curr.company_name});
        }
        return acc;
      }, []);
      const objChange: Partial<User> = {
        access_okrugs,
        access_companies, 
      };

      handleChange(objChange);
      setTimeout(() => {
        props.defaultSubmit();
      }, 0);

    }, [state.access_companies_ids, state.access_okrugs_ids, okrugs, companies]);

    React.useEffect(() => {
      dispatch(actionGetAndSetInStoreOkrugs({all: true}, {page, path}));
    }, []);

    React.useEffect(() => {
      if (okrugs.length && state.access_okrugs_ids.length) {
        const okrugs_ids = state.access_okrugs_ids.join(',');
        dispatch(actionGetAndSetInStoreCompany({all: true, okrugs_ids}, {page, path}));
      }
      if (!state.access_okrugs_ids.length && companies.length) {
        dispatch(actionResetSetCompany());
      }
    }, [okrugs, state.access_okrugs_ids]);

    React.useEffect(() => {
      if (state.access_companies_ids.some((el) => !~companies.findIndex((elem) => elem.company_id === el))) {
        const access_companies_ids = state.access_companies_ids.filter((el) => !!companies.find((elem) => elem.company_id === el));
        handleChange('access_companies_ids', access_companies_ids);
      }
    }, [state.access_okrugs_ids, companies]);

    const title = 'Карточка настройки доступа';
    return (
      <EtsBootstrap.ModalContainer id="modal-users_access" show onHide={props.hideWithoutChanges} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="full_name"
                modalKey={page}
                type="string"
                label="Фамилия Имя Отчество"
                value={state.full_name}
                error={errors.full_name}
                onChange={handleChange}
                boundKeys="full_name"
                disabled
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="personnel_number"
                modalKey={page}
                type="string"
                label="Табельный номер"
                value={state.personnel_number}
                error={errors.personnel_number}
                onChange={handleChange}
                boundKeys="personnel_number"
                disabled
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="position_name"
                modalKey={page}
                type="string"
                label="Должность"
                value={state.position_name}
                error={errors.position_name}
                onChange={handleChange}
                boundKeys="position_name"
                disabled
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="status"
                modalKey={page}
                type="string"
                label="Статус"
                value={state.status}
                error={errors.status}
                onChange={handleChange}
                boundKeys="status"
                disabled
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="access_okrugs_ids"
                modalKey={page}
                type="select"
                label="Доступ к округу, по которому должна быть выполнена проверка"
                value={state.access_okrugs_ids}
                error={errors.access_okrugs_ids}
                onChange={handleChange}
                boundKeys="access_okrugs_ids"
                options={okrugsOptions}
                multi
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="access_companies_ids"
                modalKey={page}
                type="select"
                label="Доступ к организации, по которой должна быть выполнена проверка"
                value={state.access_companies_ids}
                error={errors.access_companies_ids}
                onChange={handleChange}
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
              <EtsBootstrap.Button disabled={!props.canSave} onClick={onSubmit}>Сохранить</EtsBootstrap.Button>
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
