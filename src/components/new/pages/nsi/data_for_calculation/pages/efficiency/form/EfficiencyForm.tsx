import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnEfficiencyProps,
  PropsEfficiency,
  StatePropsEfficiency,
  DispatchPropsEfficiency,
  PropsEfficiencyWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/form/@types/EfficiencyForm';
import { DivNone } from 'global-styled/global-styled';
import efficiencyPermissions from '../_config-data/permissions';
import { efficiencyFormSchema } from './schema';
import { Efficiency } from 'redux-main/reducers/modules/efficiency/@types/efficiency';
import { getDefaultEfficiencyElement } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionCreateEfficiency, actionUpdateEfficiency } from 'redux-main/reducers/modules/efficiency/actions_efficiency';

const EfficiencyForm: React.FC<PropsEfficiency> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    IS_CREATING,
    isPermitted: isPermittedOwn,
  } = props;

  const isPermitted = isPermittedOwn && false;

  const title = (
    !IS_CREATING
      ? 'Добавление показателя для расчета эффективности'
      : 'Изменение показателя для расчета эффективности'
  );

  return (
    <Modal id="modal-efficiency" show onHide={props.hideWithoutChanges} backdrop="static" bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <ExtField
          type="string"
          label="Технологическая операция"
          error={errors.technical_operation_id}
          disabled={!isPermitted}
          value={state.technical_operation_name}
          boundKeys="technical_operation_name"
        />
        <ExtField
          type="string"
          label="Источник"
          error={errors.source}
          disabled={!isPermitted}
          value={state.source}
          onChange={props.handleChange}
          boundKeys="source"
        />
        <ExtField
          type="string"
          label="Площадная характеристика"
          error={errors.areal_feature_name}
          disabled={!isPermitted}
          value={state.areal_feature_id}
          onChange={props.handleChange}
          boundKeys="areal_feature_id"
        />
        <ExtField
          type="number"
          label="Коэффициент"
          value={state.ratio}
          error={errors.ratio}
          disabled={!isPermitted}
          onChange={props.handleChange}
          boundKeys="ratio"
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

export default compose<PropsEfficiency, OwnEfficiencyProps>(
  connect<StatePropsEfficiency, DispatchPropsEfficiency, OwnEfficiencyProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadMeasureUnit: (...arg) => (
        dispatch(
          actionLoadMeasureUnit(...arg),
        )
      ),
    }),
  ),
  withForm<PropsEfficiencyWithForm, Efficiency>({
    uniqField: 'id',
    createAction: actionCreateEfficiency,
    updateAction: actionUpdateEfficiency,
    mergeElement: (props) => {
      return getDefaultEfficiencyElement(props.element);
    },
    schema: efficiencyFormSchema,
    permissions: efficiencyPermissions,
  }),
)(EfficiencyForm);
