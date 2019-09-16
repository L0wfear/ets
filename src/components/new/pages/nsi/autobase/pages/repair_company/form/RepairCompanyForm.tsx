import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsRepairCompany,
  PropsRepairCompanyWithForm,
} from 'components/new/pages/nsi/autobase/pages/repair_company/form/@types/RepairCompanyForm';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getDefaultRepairCompanyElement } from './utils';
import { repairCompanyFormSchema } from './schema';
import repairCompanyPermissions from '../_config-data/permissions';

const RepairCompanyForm: React.FC<PropsRepairCompany> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      IS_CREATING,
      isPermitted,
    } = props;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';

    return (
      <EtsBootstrap.ModalContainer id="modal-repair-company" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="name"
                type="string"
                label="Наименование ремонтной организации"
                value={state.name}
                error={errors.name}
                onChange={props.handleChange}
                boundKeys="name"
                modalKey={path}
              />
              <ExtField
                id="comment"
                type="string"
                label="Примечание"
                value={state.comment}
                error={errors.comment}
                onChange={props.handleChange}
                boundKeys="comment"
                modalKey={path}
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

export default compose<PropsRepairCompany, PropsRepairCompanyWithForm>(
  withForm<PropsRepairCompanyWithForm, RepairCompany>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateRepairCompany,
    updateAction: autobaseActions.autobaseUpdateRepairCompany,
    mergeElement: (props) => {
      return getDefaultRepairCompanyElement(props.element);
    },
    schema: repairCompanyFormSchema,
    permissions: repairCompanyPermissions,
  }),
)(RepairCompanyForm);
