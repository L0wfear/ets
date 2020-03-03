import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  FileField,
} from 'components/old/ui/input/fields';

import { DivNone } from 'global-styled/global-styled';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';

import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import {
  OwnTechMaintenanceProps,
  PropsTechMaintenance,
  StatePropsTechMaintenance,
  PropsTechMaintenanceWithForm,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form/@types/TechMintenanceForm';
import {
  TechMaintenance,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { hasMotohours } from 'utils/functions';
import ExtField from 'components/@next/@ui/renderFields/Field';

import { getDefaultTechMaintenanceElement } from './utils';
import { techMaintFormSchema } from './shema';
import techMaintenancePermissions from '../_config-data/permissions';
import { autobaseCreateTechMaintenance, autobaseUpdateTechMaintenance } from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint/actions';
import { repairCompanyGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/actions';
import { techMaintOrderGetAndSetInStore } from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_order/actions';

const TechMaintenanceForm: React.FC<PropsTechMaintenance> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    repairCompanyList,
    techMaintOrderList,
    selectedCarData,

    IS_CREATING,
    isPermitted,
  } = props;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';

  React.useEffect(
    () => {
      props.dispatch(
        repairCompanyGetAndSetInStore(
          {},
          props,
        ),
      );
    },
    [],
  );

  React.useEffect(
    () => {
      props.dispatch(
        techMaintOrderGetAndSetInStore(
          { car_model_id: get(props.selectedCarData, 'special_model_id', null) },
          props,
        ),
      );
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

  const gov_number = state.gov_number ? state.gov_number : get(selectedCarData, 'gov_number');

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
            <ExtField
              type="select"
              multi={true}
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
            <ExtField
              type={'date'}
              makeGoodFormat
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
            <ExtField
              type={'date'}
              makeGoodFormat
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
            <ExtField
              type={'date'}
              makeGoodFormat
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
            <ExtField
              type={'date'}
              makeGoodFormat
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
            {!hasMotohours(gov_number) ? (
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
            {hasMotohours(gov_number) ? (
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
  connect<StatePropsTechMaintenance, {}, OwnTechMaintenanceProps, ReduxState>(
    (state) => ({
      repairCompanyList: getAutobaseState(state).repairCompanyList,
      techMaintOrderList: getAutobaseState(state).techMaintOrderList,
    }),
  ),
  withForm<PropsTechMaintenanceWithForm, TechMaintenance>({
    uniqField: 'id',
    createAction: autobaseCreateTechMaintenance,
    updateAction: autobaseUpdateTechMaintenance,
    mergeElement: (props) => {
      return getDefaultTechMaintenanceElement(props.element);
    },
    schema: techMaintFormSchema,
    permissions: techMaintenancePermissions,
  }),
)(TechMaintenanceForm);
