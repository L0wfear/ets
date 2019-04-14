import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnCleaningRateProps,
  PropsCleaningRate,
  StatePropsCleaningRate,
  DispatchPropsCleaningRate,
  PropsCleaningRateWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/@types/CleaningRateForm';
import { DivNone } from 'global-styled/global-styled';
import cleaningRatePermissions from '../_config-data/permissions';
import { cleaningRateFormSchema } from './schema';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { getDefaultCleaningRateElement, getCleaningRateProperties } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import useMeasureUnitOperationOptions from './use/useMeasureUnitOptions';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionCreateCleaningRate, actionUpdateCleaningRate } from 'redux-main/reducers/modules/cleaning_rate/actions_cleaning_rate';
import { actionGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import useTechnicalOperationOptions from './use/useTechnicalOperationOptions';

const CleaningRateForm: React.FC<PropsCleaningRate> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    IS_CREATING,
    isPermitted,
  } = props;

  const title = (
    !IS_CREATING
      ? 'Изменение показателя для расчета'
      : 'Добавление показателя для расчета'
  );

  const {
    measureUnitOptions,
  } = useMeasureUnitOperationOptions(
    props.actionLoadMeasureUnit,
    page, path,
  );

  const {
    technicalOperationOptions,
  } = useTechnicalOperationOptions(
    props.actionGetTechnicalOperationRegistry,
    page, path,
  );

  const PROPERTIES = getCleaningRateProperties(state.type);

  return (
    <Modal id="modal-cleaning-rate" show onHide={props.hideWithoutChanges} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <ExtField
          type="select"
          label="Технологическая операция"
          value={state.technical_operation_id}
          error={errors.technical_operation_id}
          options={technicalOperationOptions}
          onChange={props.handleChange}
          disabled={!isPermitted}
          boundKeys="technical_operation_id"
        />
        <ExtField
          type="select"
          label="Площадная характеристика"
          value={state.property}
          error={errors.property}
          options={PROPERTIES}
          onChange={props.handleChange}
          boundKeys="property"
          disabled={!isPermitted}
        />
        <ExtField
          type="string"
          label="Коэффициент"
          value={state.value}
          error={errors.value}
          onChange={props.handleChange}
          boundKeys="value"
          disabled={!isPermitted}
        />
        <ExtField
          type="select"
          label="Единица измерения"
          options={measureUnitOptions}
          value={state.measure_unit_id}
          error={errors.measure_unit_id}
          onChange={props.handleChange}
          boundKeys="measure_unit_id"
          disabled={!isPermitted}
        />
      </ModalBodyPreloader>
      <Modal.Footer>
        <div>
          {
            isPermitted // либо обновление, либо создание
            ? (
              <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
            )
            : (
              <DivNone />
            )
          }
          <Button onClick={props.hideWithoutChanges}>Отменить</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default compose<PropsCleaningRate, OwnCleaningRateProps>(
  connect<StatePropsCleaningRate, DispatchPropsCleaningRate, OwnCleaningRateProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetTechnicalOperationRegistry: (...arg) => (
        dispatch(
          actionGetTechnicalOperationRegistry(...arg),
        )
      ),
      actionLoadMeasureUnit: (...arg) => (
        dispatch(
          actionLoadMeasureUnit(...arg),
        )
      ),
    }),
  ),
  withForm<PropsCleaningRateWithForm, CleaningRate>({
    uniqField: 'id',
    createAction: actionCreateCleaningRate,
    updateAction: actionUpdateCleaningRate,
    mergeElement: (props) => {
      return getDefaultCleaningRateElement(props.element);
    },
    schema: cleaningRateFormSchema,
    permissions: cleaningRatePermissions,
  }),
)(CleaningRateForm);
