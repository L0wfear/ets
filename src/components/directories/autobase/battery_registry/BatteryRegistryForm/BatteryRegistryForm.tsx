import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import batteryRegistryPermissions from 'components/directories/autobase/battery_registry/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { batteryRegistryFormSchema } from 'components/directories/autobase/battery_registry/BatteryRegistryForm/battery-registry-from-schema';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { getDefaultBatteryRegistryElement } from 'components/directories/autobase/battery_registry/BatteryRegistryForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryRegistryProps,
  PropsBatteryRegistry,
  StateBatteryRegistry,
  StatePropsBatteryRegistry,
  DispatchPropsBatteryRegistry,
  PropsBatteryRegistryWithForm,
} from 'components/directories/autobase/battery_registry/BatteryRegistryForm/@types/BatteryRegistry.h';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import BatteryToVehicleBlockComponent from 'components/directories/autobase/battery_registry/BatteryRegistryForm/vehicle-block/BatteryToVehicleBlock';
import { onChangeWithKeys } from 'components/compositions/hoc';

const BatteryVehicleBlock: any = onChangeWithKeys(BatteryToVehicleBlockComponent);

class BatteryRegistryForm extends React.PureComponent<PropsBatteryRegistry, StateBatteryRegistry> {
  state = {
    canSave: true,
    batteryBrandOptions: [],
  };

  componentDidMount() {
    this.loadBatteryBrand();
  }
  async loadBatteryBrand() {
    const { payload: { data } } = await this.props.autobaseGetSetBatteryBrand();

    this.setState({
      batteryBrandOptions: data.map(({ id, name, ...other }) => ({
        value: id,
        label: name,
        batteryBrand: {
          id,
          name,
          ...other,
        },
      })),
    });
  }
  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleChangeBrandId = (name, value, option) => {
    this.props.handleChange({
      [name]: value,
      brand_name: get(option, ['batteryBrand', 'brand_name'], null),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }
  handleBatteryToCarValidity = ({ isValidInput }) => (
    this.setState({ canSave: isValidInput })
  )
  render() {
    const {
      formState: state,
      formErrors: errors,
      isPermitted = false,
      page,
      path,
    } = this.props;
    const {
      batteryBrandOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';

    return (
      <Modal id="modal-battery-registry" show onHide={this.handleHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                id="brand_id"
                type="select"
                label="Марка аккумулятора"
                value={state.brand_id}
                error={errors.brand_id}
                options={batteryBrandOptions}
                emptyValue={null}
                onChange={this.handleChangeBrandId}
                boundKeys="brand_id"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="brand_name"
                type={'string'}
                label={'Изготовитель'}
                value={state.brand_name}
                disabled
                modalKey={page}
              />
              <ExtField
                id="serial_number"
                type="string"
                label={'Серийный номер'}
                value={state.serial_number}
                error={errors.serial_number}
                onChange={this.handleChange}
                boundKeys="serial_number"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="lifetime_months"
                type="string"
                label="Срок службы, мес."
                value={state.lifetime_months}
                error={errors.lifetime_months}
                onChange={this.handleChange}
                boundKeys="lifetime_months"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="released_at"
                type="date"
                label="Дата выпуска"
                date={state.released_at}
                time={false}
                error={errors.released_at}
                onChange={this.handleChange}
                boundKeys="released_at"
                disabled={!isPermitted}
                modalKey={page}
              />
              <ExtField
                id="worked_months"
                type="string"
                label="Количество месяцев наработки"
                value={state.worked_months}
                disabled
                modalKey={page}
              />
              {!IS_CREATING &&
                <Col md={12}>
                  <h4>Транспортное средство, на котором установлен аккумулятор</h4>
                  <BatteryVehicleBlock
                    id="files"
                    onChange={this.handleChange}
                    boundKeys="battery_to_car"
                    inputList={state.battery_to_car || []}
                    onValidation={this.handleBatteryToCarValidity}
                    batteryId={state.id}
                    selectField="customId"
                    modalKey={page}
                  />
                </Col>
              }
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

export default compose<PropsBatteryRegistry, OwnBatteryRegistryProps>(
  connect<StatePropsBatteryRegistry, DispatchPropsBatteryRegistry, OwnBatteryRegistryProps, ReduxState>(
    null,
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseActions.autobaseCreateBatteryRegistry(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          autobaseActions.autobaseUpdateBatteryRegistry(
            formState,
            { page, path },
          ),
        )
      ),
      autobaseGetSetBatteryBrand: () => (
        dispatch(
          autobaseActions.autobaseGetSetBatteryBrand(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsBatteryRegistryWithForm, BatteryRegistry>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultBatteryRegistryElement(props.element);
    },
    schema: batteryRegistryFormSchema,
    permissions: batteryRegistryPermissions,
  }),
)(BatteryRegistryForm);
