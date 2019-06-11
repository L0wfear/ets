import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnRepairCompanyProps,
  PropsRepairCompany,
  StateRepairCompany,
  StatePropsRepairCompany,
  DispatchPropsRepairCompany,
  PropsRepairCompanyWithForm,
} from 'components/new/pages/nsi/autobase/pages/repair_company/form/@types/RepairCompanyForm';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { getDefaultRepairCompanyElement } from './utils';
import { repairCompanyFormSchema } from './schema';
import repairCompanyPermissions from '../_config-data/permissions';

class RepairCompanyForm extends React.PureComponent<PropsRepairCompany, StateRepairCompany> {
  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <EtsBootstrap.ModalContainer id="modal-repair-company" show onHide={this.props.hideWithoutChanges}>
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
                onChange={this.props.handleChange}
                boundKeys="name"
                modalKey={path}
              />
              <ExtField
                id="comment"
                type="string"
                label="Примечание"
                value={state.comment}
                error={errors.comment}
                onChange={this.props.handleChange}
                boundKeys="comment"
                modalKey={path}
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

export default compose<PropsRepairCompany, OwnRepairCompanyProps>(
  connect<StatePropsRepairCompany, DispatchPropsRepairCompany, OwnRepairCompanyProps, ReduxState>(
    null,
  ),
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
