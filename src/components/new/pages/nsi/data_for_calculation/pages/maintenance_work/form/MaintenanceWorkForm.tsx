import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnMaintenanceWorkProps,
  PropsMaintenanceWork,
  StatePropsMaintenanceWork,
  DispatchPropsMaintenanceWork,
  PropsMaintenanceWorkWithForm,
} from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/@types/MaintenanceWorkForm';
import { DivNone } from 'global-styled/global-styled';
import maintenanceWorkPermissions from '../_config-data/permissions';
import { maintenanceWorkFormSchema } from './schema';
import { MaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/@types/maintenanceWork';
import { getDefaultMaintenanceWorkElement } from './utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import useMeasureUnitOperationOptions from './use/useMeasureUnitOptions';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionCreateMaintenanceWork, actionUpdateMaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/actions_maintenance_work';

const MaintenanceWorkForm: React.FC<PropsMaintenanceWork> = (props) => {
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
      ? 'Изменение расходного материала'
      : 'Добавление расходного материала'
  );

  const {
    measureUnitOptions,
  } = useMeasureUnitOperationOptions(
    props.actionLoadMeasureUnit,
    page, path,
  );

  return (
    <Modal id="modal-maintenance_work" show onHide={props.hideWithoutChanges} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <ExtField
          type="string"
          label="Наименование"
          value={state.name}
          error={errors.name}
          onChange={props.handleChange}
          boundKeys="name"
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

export default compose<PropsMaintenanceWork, OwnMaintenanceWorkProps>(
  connect<StatePropsMaintenanceWork, DispatchPropsMaintenanceWork, OwnMaintenanceWorkProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadMeasureUnit: (...arg) => (
        dispatch(
          actionLoadMeasureUnit(...arg),
        )
      ),
    }),
  ),
  withForm<PropsMaintenanceWorkWithForm, MaintenanceWork>({
    uniqField: 'id',
    createAction: actionCreateMaintenanceWork,
    updateAction: actionUpdateMaintenanceWork,
    mergeElement: (props) => {
      return getDefaultMaintenanceWorkElement(props.element);
    },
    schema: maintenanceWorkFormSchema,
    permissions: maintenanceWorkPermissions,
  }),
)(MaintenanceWorkForm);
