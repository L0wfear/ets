import * as React from 'react';
import memoize from 'memoize-one';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';

import {
  MultiSelectField,
  DataTimeField,
  FileField,
} from 'components/ui/input/fields';

import { DivNone } from 'global-styled/global-styled';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import techMaintPermissions from 'components/directories/autobase/tech_maintenance_registry/config-data/permissions';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { techMaintFormSchema } from 'components/directories/autobase/tech_maintenance_registry/TechMaintForm/tech_maint_shema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { getDefaultTechMaintElement } from 'components/directories/autobase/tech_maintenance_registry/TechMaintForm/utils';

import {
  OwnTechMaintProps,
  PropsTechMaint,
  StateTechMaint,
  StatePropsTechMaint,
  DispatchPropsTechMaint,
  PropsTechMaintWithForm,
} from 'components/directories/autobase/tech_maintenance_registry/TechMaintForm/@types/TechMaintForm.h';
import {
  TechMaint,
  TechMaintOrder,
  RepairCompany,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { hasMotohours } from 'utils/functions';
import { ExtField } from 'components/ui/new/field/ExtField';
import EtsModal from 'components/new/ui/modal/Modal';

class TechMaintForm extends React.PureComponent<
  PropsTechMaint,
  StateTechMaint
> {
  componentDidMount() {
    this.props.techMaintOrderGetAndSetInStore(this.props.car_model_id);
    this.props.repairCompanyGetAndSetInStore();
  }

  makeOptionFromTepairCompanyList = memoize(
    (repairCompanyList: RepairCompany[]) =>
      repairCompanyList.map(defaultSelectListMapper),
  );
  makeOptionFromTechMaintOrderList = memoize(
    (techMaintOrderList: TechMaintOrder[]) =>
      techMaintOrderList.map(({ tech_maintenance_type_name, id }) => ({
        label: tech_maintenance_type_name,
        value: id,
      })),
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      repairCompanyList,
      techMaintOrderList,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    const REPAIR_COMPANIES = this.makeOptionFromTepairCompanyList(
      repairCompanyList,
    );
    const TECH_MAINT_ORDERS = this.makeOptionFromTechMaintOrderList(
      techMaintOrderList,
    );

    return (
      <EtsModal
        id="modal-tech-maint"
        show
        deepLvl={this.props.deepLvl}
        onHide={this.props.hideWithoutChanges}
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Исполнитель ремонта"
                options={REPAIR_COMPANIES}
                value={state.repair_company_id}
                error={errors.repair_company_id}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="repair_company_id"
              />
            </Col>
            <Col md={12}>
              <MultiSelectField
                integer
                label="Регламент ТО"
                options={TECH_MAINT_ORDERS}
                value={state.tech_maintenance_order_ids}
                error={errors.tech_maintenance_order_ids}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="tech_maintenance_order_ids"
              />
            </Col>
            <Col md={12}>
              <ExtField
                type="string"
                label="Номер документа"
                value={state.number}
                error={errors.number}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="number"
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Плановая дата начала"
                date={state.plan_date_start}
                error={errors.plan_date_start}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="plan_date_start"
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Плановая дата окончания"
                date={state.plan_date_end}
                error={errors.plan_date_end}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="plan_date_end"
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Фактическая дата начала"
                date={state.fact_date_start}
                error={errors.fact_date_start}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="fact_date_start"
              />
            </Col>
            <Col md={6}>
              <DataTimeField
                time={false}
                label="Фактическая дата окончания"
                date={state.fact_date_end}
                error={errors.fact_date_end}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="fact_date_end"
              />
            </Col>
            <Col md={12}>
              {!hasMotohours(state.gov_number) ? (
                <ExtField
                  type="number"
                  label="Пробег на момент ТО, км"
                  error={errors.odometr_fact}
                  disabled={!isPermitted}
                  value={state.odometr_fact}
                  onChange={this.props.handleChange}
                  boundKeys="odometr_fact"
                />
              ) : (
                <DivNone />
              )}
            </Col>
            <Col md={12}>
              {hasMotohours(state.gov_number) ? (
                <ExtField
                  type="number"
                  label="Счетчик м/ч на момент ТО, м/ч"
                  error={errors.motohours_fact}
                  disabled={!isPermitted}
                  value={state.motohours_fact}
                  onChange={this.props.handleChange}
                  boundKeys="motohours_fact"
                />
              ) : (
                <DivNone />
              )}
            </Col>
            <Col md={12}>
              <ExtField
                type="string"
                label="Примечание"
                value={state.note}
                error={errors.note}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="note"
              />
            </Col>
            <Col md={12}>
              <FileField
                multiple
                label="Файл"
                value={state.files}
                error={errors.files}
                onChange={this.props.handleChange}
                boundKeys="files"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          {isPermitted ? ( // либо обновление, либо создание
            <Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </Button>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default compose<PropsTechMaint, OwnTechMaintProps>(
  connect<
    StatePropsTechMaint,
    DispatchPropsTechMaint,
    OwnTechMaintProps,
    ReduxState
  >(
    (state) => ({
      repairCompanyList: getAutobaseState(state).repairCompanyList,
      techMaintOrderList: getAutobaseState(state).techMaintOrderList,
    }),
    (dispatch, { page, path }) => ({
      techMaintOrderGetAndSetInStore: (car_model_id) =>
        dispatch(
          autobaseActions.techMaintOrderGetAndSetInStore(
            { car_model_id },
            { page, path },
          ),
        ),
      repairCompanyGetAndSetInStore: () =>
        dispatch(
          autobaseActions.repairCompanyGetAndSetInStore({}, { page, path }),
        ),
    }),
  ),
  withForm<PropsTechMaintWithForm, TechMaint>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateTechMaint,
    updateAction: autobaseActions.autobaseUpdateTechMaint,
    mergeElement: (props) => {
      return getDefaultTechMaintElement(props.element);
    },
    schema: techMaintFormSchema,
    permissions: techMaintPermissions,
  }),
)(TechMaintForm);
