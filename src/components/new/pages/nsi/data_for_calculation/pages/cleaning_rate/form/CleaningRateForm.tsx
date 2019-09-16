import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsCleaningRate,
  PropsCleaningRateWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/@types/CleaningRateForm';
import { cleaningRateFormSchema } from './schema';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { actionCreateCleaningRate, actionUpdateCleaningRate } from 'redux-main/reducers/modules/cleaning_rate/actions_cleaning_rate';
import useTechnicalOperationOptions from './use/useTechnicalOperationOptions';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';
import cleaningRatePermissions from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/permissions';
import { getCleaningRateProperties, getDefaultCleaningRateElement } from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/utils';

const CleaningRateForm: React.FC<PropsCleaningRate> = React.memo(
  (props) => {
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

    const measureUnitOptions = useMeasureUnitOptions(null, props);

    const {
      technicalOperationOptions,
    } = useTechnicalOperationOptions(
      props,
    );

    const PROPERTIES = getCleaningRateProperties(state.type);

    return (
      <EtsBootstrap.ModalContainer id="modal-cleaning-rate" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
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
        <EtsBootstrap.ModalFooter>
          {
            isPermitted && (
              <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
            )
          }
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsCleaningRate, PropsCleaningRateWithForm>(
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
