import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryBrandProps,
  PropsBatteryBrand,
  StatePropsBatteryBrand,
  DispatchPropsBatteryBrand,
  PropsBatteryBrandWithForm,
} from 'components/new/pages/nsi/autobase/pages/battery_brand/form/@types/BatteryBrandForm';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { batteryBrandFormSchema } from './schema';
import batteryBrandPermissions from '../_config-data/permissions';
import { getDefaultBatteryBrandElement } from './utils';

const BatteryBrandForm: React.FC<PropsBatteryBrand> = (props) => {
  const [batteryManufacturerOptions, setBatteryManufacturerOptions] = React.useState([]);
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

  React.useEffect(
    () => {
      props.autobaseGetSetBatteryManufacturer().then(
        ({ payload: { data } }) => (
          setBatteryManufacturerOptions(
            data.map(defaultSelectListMapper),
          )
        ),
      );
    },
    [],
  );

  return (
    <Modal id="modal-battery_brand" show onHide={props.hideWithoutChanges} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={6}>
            <ExtField
              id="name"
              type="string"
              label="Марка аккумулятора"
              value={state.name}
              error={errors.name}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="name"
              modalKey={page}
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="manufacturer_id"
              type="select"
              label="Производитель аккумулятора"
              options={batteryManufacturerOptions}
              value={state.manufacturer_id}
              error={errors.manufacturer_id}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="manufacturer_id"
              clearable={false}
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

export default compose<PropsBatteryBrand, OwnBatteryBrandProps>(
  connect<StatePropsBatteryBrand, DispatchPropsBatteryBrand, OwnBatteryBrandProps, ReduxState>(
    null,
    (dispatch, { page, path }) => ({
      autobaseGetSetBatteryManufacturer: () => (
        dispatch(
          autobaseActions.autobaseGetSetBatteryManufacturer(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsBatteryBrandWithForm, BatteryBrand>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateBatteryBrand,
    updateAction: autobaseActions.autobaseUpdateBatteryBrand,
    mergeElement: (props) => {
      return getDefaultBatteryBrandElement(props.element);
    },
    schema: batteryBrandFormSchema,
    permissions: batteryBrandPermissions,
  }),
)(BatteryBrandForm);
