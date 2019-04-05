import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryManufacturerProps,
  PropsBatteryManufacturer,
  StatePropsBatteryManufacturer,
  DispatchPropsBatteryManufacturer,
  PropsBatteryManufacturerWithForm,
} from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/form/@types/BatteryManufacturerForm';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { getDefaultBatteryManufacturerElement } from './utils';
import { batteryManufacturerFormSchema } from './schema';
import batteryManufacturerPermissions from '../_config-data/permissions';

const BatteryManufacturerForm: React.FC<PropsBatteryManufacturer> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

  return (
    <Modal id="modal-battery-manufacturer" show onHide={props.hideWithoutChanges} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
            <ExtField
              id={name}
              type="string"
              label="Производитель аккумулятора"
              value={state.name}
              error={errors.name}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="name"
              modalKey={page}
            />
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
      {
        isPermitted // либо обновление, либо создание
        ? (
          <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
        )
        : (
          <DivNone />
        )
      }
      </Modal.Footer>
    </Modal>
  );
};

export default compose<PropsBatteryManufacturer, OwnBatteryManufacturerProps>(
  connect<StatePropsBatteryManufacturer, DispatchPropsBatteryManufacturer, OwnBatteryManufacturerProps, ReduxState>(
    null,
  ),
  withForm<PropsBatteryManufacturerWithForm, BatteryManufacturer>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateBatteryManufacturer,
    updateAction: autobaseActions.autobaseUpdateBatteryManufacturer,
    mergeElement: (props) => {
      return getDefaultBatteryManufacturerElement(props.element);
    },
    schema: batteryManufacturerFormSchema,
    permissions: batteryManufacturerPermissions,
  }),
)(BatteryManufacturerForm);
