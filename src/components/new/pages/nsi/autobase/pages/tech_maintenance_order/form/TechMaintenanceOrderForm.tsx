import * as React from 'react';
import memoize from 'memoize-one';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FileField } from 'components/ui/input/fields';

import { DivNone } from 'global-styled/global-styled';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

import {
  SEQUENCE_1_TO_20_SELECT_OPTIONS,
  TIME_MEASURES_SELECT_OPTIONS,
} from 'constants/dictionary';

import { ReduxState } from 'redux-main/@types/state';
import {
  OwnTechMaintOrderProps,
  PropsTechMaintOrder,
  StateTechMaintOrder,
  StatePropsTechMaintOrder,
  DispatchPropsTechMaintOrder,
  PropsTechMaintOrderWithForm,
} from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form/@types/TechMaintenanceOrderForm';
import { TechMaintOrder, TechMaintType, MeasureUnitRun } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getAutobaseState, getSomeUniqState } from 'redux-main/reducers/selectors';
import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { getDefaultTechMaintOrderElement } from './utils';
import { techMaintOrderFormSchema } from './shema';
import techMaintenanceOrderPermissions from '../_config-data/permissions';

class TechMaintenanceOrder extends React.PureComponent<PropsTechMaintOrder, StateTechMaintOrder> {
  componentDidMount() {
    const {
      page,
      path,
    } = this.props;

    this.props.actionGetAndSetInStoreSpecialModel({}, { page, path });

    this.props.techMaintTypeGetAndSetInStore();

    const {
      formState: {
        tech_maintenance_type_id,
      },
    } = this.props;

    if (tech_maintenance_type_id) {
      this.loadMeasureUnitRun(tech_maintenance_type_id);
    }
  }

  loadMeasureUnitRun(tech_maintenance_type_id: TechMaintOrder['tech_maintenance_type_id']) {
    this.props.measureUnitRunGetAndSetInStore(tech_maintenance_type_id);
  }

  makeOptionFromTechMaintTypeList = (
    memoize(
      (techMaintTypeList: TechMaintType[]) => techMaintTypeList.map(defaultSelectListMapper),
    )
  );
  makeOptionFromSpecialModelsList = (
    memoize(
      (specialModelList: SpecialModel[]) => specialModelList.map(defaultSelectListMapper),
    )
  );
  makeOptionFromMeasureUnitRunList = (
    memoize(
      (measureUnitRunList: MeasureUnitRun[]) => measureUnitRunList.map(defaultSelectListMapper),
    )
  );

  handleTechMaintTypeChange = (key: string, tech_maintenance_type_id: TechMaintOrder['tech_maintenance_type_id']) => {
    if (tech_maintenance_type_id !== this.props.formState.tech_maintenance_type_id) {
      if (tech_maintenance_type_id) {
        this.loadMeasureUnitRun(tech_maintenance_type_id);
      }
      this.props.handleChange({
        tech_maintenance_type_id,
        measure_unit_run_id: null,
      });
    }
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;
    const {
      tech_maintenance_type_id,
    } = state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const TECH_MAINT_TYPE = this.makeOptionFromTechMaintTypeList(this.props.techMaintTypeList);
    const VEHICLE_MODELS = this.makeOptionFromSpecialModelsList(this.props.specialModelList);
    const MEASURE_UNITS_RUN = this.makeOptionFromMeasureUnitRunList(this.props.measureUnitRunList);

    return (
      <EtsBootstrap.ModalContainer id="modal-tech-maint-order" show onHide={this.props.hideWithoutChanges} backdrop="static">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="tech_maintenance_type_id"
                type="select"
                label="Тип ТО"
                options={TECH_MAINT_TYPE}
                value={state.tech_maintenance_type_id}
                error={errors.tech_maintenance_type_id}
                disabled={!isPermitted}
                onChange={this.handleTechMaintTypeChange}
                boundKeys="tech_maintenance_type_id"
                clearable={false}
                modalKey={path}
              />
              <ExtField
                id="measure_unit_run_id"
                type="select"
                label="Пробег измеряется"
                options={MEASURE_UNITS_RUN}
                value={state.measure_unit_run_id}
                error={errors.measure_unit_run_id}
                disabled={!isPermitted || !tech_maintenance_type_id}
                onChange={this.props.handleChange}
                clearable={false}
                boundKeys="measure_unit_run_id"
                modalKey={path}
              />
              {
                !state.is_periodic
                  ? (
                    <ExtField
                      id="sequence"
                      type="select"
                      label="Последовательность ТО"
                      options={SEQUENCE_1_TO_20_SELECT_OPTIONS}
                      value={state.sequence}
                      error={errors.sequence}
                      disabled={!isPermitted}
                      onChange={this.props.handleChange}
                      clearable={false}
                      boundKeys="sequence"
                      modalKey={path}
                    />
                  )
                  : (
                    <DivNone />
                  )
              }
              <ExtField
                id="description"
                type="string"
                label="Описание"
                value={state.description}
                error={errors.description}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="description"
                modalKey={path}
              />
              <ExtField
                id="car_model_id"
                type="select"
                label="Модель ТС"
                options={VEHICLE_MODELS}
                value={state.car_model_id}
                error={errors.car_model_id}
                disabled={!isPermitted}
                clearable={false}
                onChange={this.props.handleChange}
                boundKeys="car_model_id"
                modalKey={path}
              />
              <ExtField
                id="is_periodic"
                type="boolean"
                label="Признак периодического ТО"
                value={state.is_periodic}
                disabled={!isPermitted}
                onChange={this.props.handleChangeBoolean}
                boundKeys="is_periodic"
                modalKey={path}
              />
              <ExtField
                id="interval_probeg"
                type="number"
                label="Интервал до следующего ТО (по пробегу)"
                error={errors.interval_probeg}
                disabled={!isPermitted}
                value={state.interval_probeg}
                onChange={this.props.handleChange}
                boundKeys="interval_probeg"
                modalKey={path}
              />
              <ExtField
                id="interval_time"
                type="number"
                label="Интервал до следующего ТО (по времени)"
                error={errors.interval_time}
                disabled={!isPermitted}
                value={state.interval_time}
                onChange={this.props.handleChange}
                boundKeys="interval_time"
                modalKey={path}
              />
              <ExtField
                id="interval_time_type"
                type="select"
                label="Время измеряется"
                options={TIME_MEASURES_SELECT_OPTIONS}
                value={state.interval_time_type}
                error={errors.interval_time_type}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="interval_time_type"
                modalKey={path}
              />
              <FileField
                id="file"
                label="Файл"
                multiple
                value={state.files}
                error={errors.files}
                onChange={this.props.handleChange}
                boundKeys="files"
                disabled={!isPermitted}
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

export default compose<PropsTechMaintOrder, OwnTechMaintOrderProps>(
  connect<StatePropsTechMaintOrder, DispatchPropsTechMaintOrder, OwnTechMaintOrderProps, ReduxState>(
    (state) => ({
      techMaintTypeList: getAutobaseState(state).techMaintTypeList,
      measureUnitRunList: getAutobaseState(state).measureUnitRunList,
      specialModelList: getSomeUniqState(state).specialModelList,
    }),
    (dispatch: any, { page, path }) => ({
      techMaintTypeGetAndSetInStore: () => (
        dispatch(
          autobaseActions.techMaintTypeGetAndSetInStore(
            {},
            { page, path },
          ),
        )
      ),
      measureUnitRunGetAndSetInStore: (tech_maintenance_type_id) => (
        dispatch(
          autobaseActions.measureUnitRunGetAndSetInStore(
            { tech_maintenance_type_id },
            { page, path },
          ),
        )
      ),
      actionGetAndSetInStoreSpecialModel: (...arg) => (
        dispatch(
          someUniqActions.actionGetAndSetInStoreSpecialModel(...arg),
        )
      ),
    }),
  ),
  withForm<PropsTechMaintOrderWithForm, TechMaintOrder>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateTechMaintOrder,
    updateAction: autobaseActions.autobaseUpdateTechMaintOrder,
    mergeElement: (props) => {
      return getDefaultTechMaintOrderElement(props.element);
    },
    schema: techMaintOrderFormSchema,
    permissions: techMaintenanceOrderPermissions,
  }),
)(TechMaintenanceOrder);
