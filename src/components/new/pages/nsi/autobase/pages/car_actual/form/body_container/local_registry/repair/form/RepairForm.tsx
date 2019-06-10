import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { repairFormSchema } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultRepairElement } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnRepairProps,
  PropsRepair,
  StateRepair,
  StatePropsRepair,
  DispatchPropsRepair,
  PropsRepairWithForm,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/@types/RepairForm';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { isNullOrUndefined } from 'util';
import { FileField } from 'components/ui/input/fields';
import { getSessionState } from 'redux-main/reducers/selectors';

import { AUTOBASE_REPAIR_STATUS } from 'redux-main/reducers/modules/autobase/actions_by_type/repair/status';
import repairPermissions from '../_config-data/permissions';

const statusOptions = Object.entries(AUTOBASE_REPAIR_STATUS)
.filter(([, value]) => !value.disabled)
.map(([key, value]) => ({
  value: key,
  label: value.name,
  rowData: null,
}));

class RepairForm extends React.PureComponent<PropsRepair, StateRepair> {
  state = {
    repairCompanyOptions: [],
    repairTypeOptions: [],
  };

  componentDidMount() {
    this.loadRepairCompany();
    this.loadRepairType();
  }
  async loadRepairCompany() {
    const {
      payload: { data },
    } = await this.props.autobaseGetRepairCompany();

    this.setState({ repairCompanyOptions: data.map(defaultSelectListMapper) });
  }
  async loadRepairType() {
    const {
      payload: { data },
    } = await this.props.autobaseGetRepairType();

    this.setState({ repairTypeOptions: data.map(defaultSelectListMapper) });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,

      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const ownIsPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    const isPermitted =
      ownIsPermitted &&
      (isNullOrUndefined(state.company_id) ||
        state.can_edit ||
        state.company_id === this.props.userCompanyId);

    return (
      <EtsBootstrap.ModalContainer
        id="modal-repair"
        show
        onHide={this.props.hideWithoutChanges}
       >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="repair_company_id"
                type="select"
                label="Исполнитель ремонта"
                value={state.repair_company_id}
                error={errors.repair_company_id}
                options={this.state.repairCompanyOptions}
                emptyValue={null}
                onChange={this.props.handleChange}
                boundKeys="repair_company_id"
                clearable={false}
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="repair_type_id"
                type="select"
                label="Вид ремонта"
                value={state.repair_type_id}
                error={errors.repair_type_id}
                options={this.state.repairTypeOptions}
                emptyValue={null}
                onChange={this.props.handleChange}
                boundKeys="repair_type_id"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="number"
                type="string"
                label="Номер документа"
                value={state.number}
                error={errors.number}
                onChange={this.props.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="plan_date_start"
                type="date"
                label="Плановая дата начала ремонта"
                date={state.plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.props.handleChange}
                boundKeys="plan_date_start"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="plan_date_end"
                type="date"
                label="Плановая дата окончания ремонта"
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.props.handleChange}
                boundKeys="plan_date_end"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="fact_date_start"
                type="date"
                label="Фактическая дата начала ремонта"
                date={state.fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.props.handleChange}
                boundKeys="fact_date_start"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="fact_date_end"
                type="date"
                label="Фактическая дата окончания ремонта"
                date={state.fact_date_end}
                time={false}
                error={errors.fact_date_end}
                onChange={this.props.handleChange}
                boundKeys="fact_date_end"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="description"
                type="string"
                label="Описание неисправности"
                value={state.description}
                error={errors.description}
                onChange={this.props.handleChange}
                boundKeys="description"
                disabled={!isPermitted}
                modalKey={path}
              />
              <ExtField
                id="note"
                type="string"
                label="Примечание"
                value={state.note}
                error={errors.note}
                onChange={this.props.handleChange}
                boundKeys="note"
                disabled={!isPermitted}
                modalKey={path}
              />
              <FileField
                id="file"
                label="Файл"
                value={state.files}
                error={errors.files}
                onChange={this.props.handleChange}
                boundKeys="files"
                disabled={!isPermitted}
                modalKey={path}
              />
              {state.fact_date_start && state.fact_date_end && (
                <ExtField
                  id="status"
                  type="select"
                  label="Итог проведенного ремонта"
                  value={state.status}
                  error={errors.status}
                  options={statusOptions}
                  emptyValue={null}
                  onChange={this.props.handleChange}
                  boundKeys="status"
                  disabled={!isPermitted}
                  modalKey={path}
                />
              )}
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsRepair, OwnRepairProps>(
  connect<StatePropsRepair, DispatchPropsRepair, OwnRepairProps, ReduxState>(
    (state) => ({
      userCompanyId: getSessionState(state).userData.company_id,
    }),
    (dispatch: any, { page, path }) => ({
      autobaseGetRepairCompany: () => (
        dispatch(
          autobaseActions.autobaseGetSetRepairCompany({}, { page, path }),
        )
      ),
      autobaseGetRepairType: () => (
        dispatch(autobaseActions.autobaseGetSetRepairType({}, { page, path }))
      ),
    }),
  ),
  withForm<PropsRepairWithForm, Repair>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateRepair,
    updateAction: autobaseActions.autobaseUpdateRepair,
    mergeElement: (props) => {
      return getDefaultRepairElement(props.element);
    },
    schema: repairFormSchema,
    permissions: repairPermissions,
  }),
)(RepairForm);
