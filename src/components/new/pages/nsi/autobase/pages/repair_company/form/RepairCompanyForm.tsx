import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
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
      <Modal id="modal-repair-company" show onHide={this.props.hideWithoutChanges} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
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
