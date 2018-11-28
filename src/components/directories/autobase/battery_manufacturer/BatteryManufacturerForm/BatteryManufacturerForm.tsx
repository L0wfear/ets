import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import batteryManufacturerPermissions from 'components/directories/autobase/battery_manufacturer/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { batteryManufacturerFormSchema } from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/battery-manufacturer-from-schema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { getDefaultBatteryManufacturerElement } from './utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryManufacturerProps,
  PropsBatteryManufacturer,
  StateBatteryManufacturer,
  StatePropsBatteryManufacturer,
  DispatchPropsBatteryManufacturer,
  PropsBatteryManufacturerWithForm,
} from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/@types/BatteryManufacturer.h';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';

class BatteryManufacturerForm extends React.PureComponent<PropsBatteryManufacturer, StateBatteryManufacturer> {
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }
  render() {
    const {
      formState: state,
      formErrors: errors,
      isPermitted = false,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = IS_CREATING ? 'Изменение записи' : 'Создание записи';

    return (
      <Modal id="modal-spare-part" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Производитель аккумулятора"
                value={state.name}
                error={errors.name}
                disabled={!isPermitted}
                onChange={this.handleChange}
                boundKeys="name"
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted || IS_CREATING // либо обновление, либо создание
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsBatteryManufacturer, OwnBatteryManufacturerProps>(
  connect<StatePropsBatteryManufacturer, DispatchPropsBatteryManufacturer, OwnBatteryManufacturerProps, ReduxState>(
    null,
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseActions.autobaseCreateBatteryManufacturer(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          autobaseActions.autobaseUpdateBatteryManufacturer(
            formState,
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsBatteryManufacturerWithForm, BatteryManufacturer>({
    mergeElement: (props) => {
      return getDefaultBatteryManufacturerElement(props.element);
    },
    schema: batteryManufacturerFormSchema,
    permissions: batteryManufacturerPermissions,
  }),
)(BatteryManufacturerForm);
