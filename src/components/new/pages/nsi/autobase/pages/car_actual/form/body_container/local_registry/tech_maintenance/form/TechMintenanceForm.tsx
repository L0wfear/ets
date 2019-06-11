import * as React from 'react';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  MultiSelectField,
  DataTimeField,
  FileField,
} from 'components/ui/input/fields';

import { DivNone } from 'global-styled/global-styled';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import {
  OwnTechMaintenanceProps,
  PropsTechMaintenance,
  StatePropsTechMaintenance,
  DispatchPropsTechMaintenance,
  PropsTechMaintenanceWithForm,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form/@types/TechMintenanceForm';
import {
  TechMaintenance,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { hasMotohours } from 'utils/functions';
import { ExtField } from 'components/ui/new/field/ExtField';

import { getDefaultTechMaintenanceElement } from './utils';
import { techMaintFormSchema } from './shema';
import techMaintenancePermissions from '../_config-data/permissions';
import { get } from 'lodash';

const TechMaintenanceForm: React.FC<PropsTechMaintenance> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    repairCompanyList,
    techMaintOrderList,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = (
    !IS_CREATING
      ? props.isPermittedToUpdate
      : props.isPermittedToCreate
  );

  React.useEffect(
    () => {
      props.repairCompanyGetAndSetInStore();
    },
    [],
  );

  React.useEffect(
    () => {
      props.techMaintOrderGetAndSetInStore(get(props.selectedCarData, 'special_model_id', null));
    },
    [props.selectedCarData],
  );

  const REPAIR_COMPANIES = React.useMemo(
    () => (
      repairCompanyList.map(defaultSelectListMapper)
    ),
    [repairCompanyList],
  );

  const TECH_MAINT_ORDERS = React.useMemo(
    () => (
      techMaintOrderList.map(({ tech_maintenance_type_name, id, measure_unit_run_name }) => ({
        label: `${tech_maintenance_type_name}, ${measure_unit_run_name}`,
        value: id,
      }))
    ),
    [techMaintOrderList],
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-tech-maint"
      show

      onHide={props.hideWithoutChanges}
     >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="select"
              label="Исполнитель ремонта"
              options={REPAIR_COMPANIES}
              value={state.repair_company_id}
              error={errors.repair_company_id}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="repair_company_id"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <MultiSelectField
              integer
              label="Регламент ТО"
              options={TECH_MAINT_ORDERS}
              value={state.tech_maintenance_order_ids}
              error={errors.tech_maintenance_order_ids}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="tech_maintenance_order_ids"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="string"
              label="Номер документа"
              value={state.number}
              error={errors.number}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="number"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <DataTimeField
              time={false}
              label="Плановая дата начала"
              date={state.plan_date_start}
              error={errors.plan_date_start}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="plan_date_start"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <DataTimeField
              time={false}
              label="Плановая дата окончания"
              date={state.plan_date_end}
              error={errors.plan_date_end}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="plan_date_end"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <DataTimeField
              time={false}
              label="Фактическая дата начала"
              date={state.fact_date_start}
              error={errors.fact_date_start}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="fact_date_start"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <DataTimeField
              time={false}
              label="Фактическая дата окончания"
              date={state.fact_date_end}
              error={errors.fact_date_end}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="fact_date_end"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            {!hasMotohours(state.gov_number) ? (
              <ExtField
                type="number"
                label="Пробег на момент ТО, км"
                error={errors.odometr_fact}
                disabled={!isPermitted}
                value={state.odometr_fact}
                onChange={props.handleChange}
                boundKeys="odometr_fact"
              />
            ) : (
              <DivNone />
            )}
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            {hasMotohours(state.gov_number) ? (
              <ExtField
                type="number"
                label="Счетчик м/ч на момент ТО, м/ч"
                error={errors.motohours_fact}
                disabled={!isPermitted}
                value={state.motohours_fact}
                onChange={props.handleChange}
                boundKeys="motohours_fact"
              />
            ) : (
              <DivNone />
            )}
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="string"
              label="Примечание"
              value={state.note}
              error={errors.note}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="note"
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <FileField
              multiple
              label="Файл"
              value={state.files}
              error={errors.files}
              onChange={props.handleChange}
              boundKeys="files"
              disabled={!isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {isPermitted ? ( // либо обновление, либо создание
          <EtsBootstrap.Button
            disabled={!props.canSave}
            onClick={props.defaultSubmit}>
            Сохранить
          </EtsBootstrap.Button>
        ) : (
          <DivNone />
        )}
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsTechMaintenance, OwnTechMaintenanceProps>(
  connect<StatePropsTechMaintenance, DispatchPropsTechMaintenance, OwnTechMaintenanceProps, ReduxState>(
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
  withForm<PropsTechMaintenanceWithForm, TechMaintenance>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateTechMaintenance,
    updateAction: autobaseActions.autobaseUpdateTechMaintenance,
    mergeElement: (props) => {
      return getDefaultTechMaintenanceElement(props.element);
    },
    schema: techMaintFormSchema,
    permissions: techMaintenancePermissions,
  }),
)(TechMaintenanceForm);
