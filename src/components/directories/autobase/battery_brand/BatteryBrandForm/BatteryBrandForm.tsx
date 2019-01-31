import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import batteryBrandPermissions from 'components/directories/autobase/battery_brand/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { batteryBrandFormSchema } from 'components/directories/autobase/battery_brand/BatteryBrandForm/battery-brand-from-schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultBatteryBrandElement } from 'components/directories/autobase/battery_brand/BatteryBrandForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryBrandProps,
  PropsBatteryBrand,
  StateBatteryBrand,
  StatePropsBatteryBrand,
  DispatchPropsBatteryBrand,
  PropsBatteryBrandWithForm,
} from 'components/directories/autobase/battery_brand/BatteryBrandForm/@types/BatteryBrand.h';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';

class BatteryBrandForm extends React.PureComponent<PropsBatteryBrand, StateBatteryBrand> {
  state = {
    batteryManufacturerOptions: [],
  };

  componentDidMount() {
    this.loadBatteryManufacturer();
  }
  async loadBatteryManufacturer() {
    const { payload: { data } } = await this.props.autobaseGetSetBatteryManufacturer();

    this.setState({ batteryManufacturerOptions: data.map(defaultSelectListMapper) });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;
    const {
      batteryManufacturerOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-battery-brand" show onHide={this.props.hideWithoutChanges} backdrop="static">
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
