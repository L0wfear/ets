import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import repairPermissions from 'components/directories/autobase/repair/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { repairFormSchema } from 'components/directories/autobase/repair/RepairForm/repairFrom_schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultRepairElement } from 'components/directories/autobase/repair/RepairForm/utils';
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
} from 'components/directories/autobase/repair/RepairForm/@types/Repair.h';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { isNullOrUndefined } from 'util';
import { FileField } from 'components/ui/input/fields';
import { AUTOBASE_REPAIR_STATUS } from 'components/directories/autobase/repair/RepairForm/constant';
import { getSessionState } from 'redux-main/reducers/selectors';

class RepairForm extends React.PureComponent<PropsRepair, StateRepair> {
  state = {
    carListOptions: [],
    repairCompanyOptions: [],
    repairTypeOptions: [],
    statusOptions: Object.entries(AUTOBASE_REPAIR_STATUS).filter(([, value]) => !value.disabled).map(([key, value]) => ({
      value: key,
      label: value.name,
      rowData: null,
    })),
  };

  componentDidMount() {
    this.loadRepairCompany();
    this.loadRepairType();
    // this.loadInsuranceType();

    const IS_CREATING = !this.props.formState.id;

    if (IS_CREATING && !this.props.car_id) {
      this.loadCars();
    }
  }
  async loadRepairCompany() {
    const { payload: { data } } = await this.props.autobaseGetRepairCompany();

    this.setState({ repairCompanyOptions: data.map(defaultSelectListMapper) });
  }
  async loadRepairType() {
    const { payload: { data } } = await this.props.autobaseGetRepairType();

    this.setState({ repairTypeOptions: data.map(defaultSelectListMapper) });
  }
  async loadCars() {
    const { page, path } = this.props;

    const { data } = await this.props.autobaseGetSetCar(
      {},
      { page, path },
    );

    this.setState({
      carListOptions: data.map(({ asuods_id, gov_number, ...other }) => ({
        value: asuods_id,
        label: gov_number,
        rowData: {
          asuods_id,
          gov_number,
          ...other,
        },
      })),
    });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      car_id,
      page,
      path,
    } = this.props;
    const {
      carListOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const ownIsPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const isPermitted = (
      ownIsPermitted
      && (
        isNullOrUndefined(state.company_id)
        || state.can_edit
        || state.company_id === this.props.userCompanyId
      )
    );

    return (
      <Modal id="modal-repair" show onHide={this.props.hideWithoutChanges} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              {IS_CREATING && !car_id &&
                <ExtField
                  id="car_id"
                  type="select"
                  label="Номер транспортного средства"
                  value={state.car_id}
                  error={errors.car_id}
                  options={carListOptions}
                  emptyValue={null}
                  onChange={this.props.handleChange}
                  boundKeys="car_id"
                  clearable={false}
                  disabled={!isPermitted}
                  modalKey={path}
                />
              }
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
              {
                state.fact_date_start && state.fact_date_end &&
                  <ExtField
                    id="status"
                    type="select"
                    label="Итог проведенного ремонта"
                    value={state.status}
                    error={errors.status}
                    options={this.state.statusOptions}
                    emptyValue={null}
                    onChange={this.props.handleChange}
                    boundKeys="status"
                    disabled={!isPermitted}
                    modalKey={path}
                  />
              }
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

export default compose<PropsRepair, OwnRepairProps>(
  connect<StatePropsRepair, DispatchPropsRepair, OwnRepairProps, ReduxState>(
    (state) => ({
      userCompanyId: getSessionState(state).userData.company_id,
    }),
    (dispatch: any, { page, path }) => ({
      autobaseGetSetCar: (...arg) => (
        dispatch(
          autobaseActions.autobaseGetSetCar(...arg),
        )
      ),
      autobaseGetRepairCompany: () => (
        dispatch(
          autobaseActions.autobaseGetSetRepairCompany(
            {},
            { page, path },
          ),
        )
      ),
      autobaseGetRepairType: () => (
        dispatch(
          autobaseActions.autobaseGetSetRepairType(
            {},
            { page, path },
          ),
        )
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
