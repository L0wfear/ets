import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnBatteryRegistryProps,
  PropsBatteryRegistry,
  StateBatteryRegistry,
  StatePropsBatteryRegistry,
  DispatchPropsBatteryRegistry,
  PropsBatteryRegistryWithForm,
} from 'components/new/pages/nsi/autobase/pages/battery_registry/form/@types/BatteryRegistryForm';
import { BatteryRegistry, BatteryOnCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import BatteryToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/battery_registry/form/vehicle-block/BatteryToVehicleBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { getDefaultBatteryRegistryElement } from './utils';
import { batteryRegistryFormSchema } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/schema';
import batteryRegistryPermissions from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/permissions';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { uniqKeyForParams } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_batteries_on_car/_config-data/registry-config';

const BatteryVehicleBlock: any = onChangeWithKeys(
  BatteryToVehicleBlockComponent,
);

const defaultBatteryOnCarItem: BatteryOnCar = {
  installed_at: null,
  uninstalled_at: null,
  customId: null,
  car_id: null,
  odometr_start: null,
  isHighlighted: false,
  isSelected: false,
};

class BatteryRegistryForm extends React.PureComponent<
  PropsBatteryRegistry,
  StateBatteryRegistry
> {
  state = {
    canSave: true,
    batteryBrandOptions: [],
  };

  componentDidMount() {
    this.loadBatteryBrand();
    this.addNewBatteryOnCar();
  }

  addNewBatteryOnCar = () => {
    const newCarId = getNumberValueFromSerch(this.props.match.params[config.list.data.uniqKeyForParams]);
    const actualBatteriesOnCarId = this.props.match.params[uniqKeyForParams];
    if ( newCarId && actualBatteriesOnCarId === 'create') {
      const customId = this.props.formState.battery_to_car.length + 1;
      this.props.handleChange(
        'battery_to_car',
        [
          {
            ...defaultBatteryOnCarItem,
            car_id: newCarId,
            customId,
          },
          ...this.props.formState.battery_to_car,
        ],
      );
    }
  };

  async loadBatteryBrand() {
    const {
      payload: { data },
    } = await this.props.autobaseGetSetBatteryBrand();

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

  handleChangeBrandId = (name, value, option) => {
    this.props.handleChange({
      [name]: value,
      brand_name: get(option, ['batteryBrand', 'brand_name'], null),
    });
  };

  handleBatteryToCarValidity = ({ isValidInput }) =>
    this.setState({ canSave: isValidInput });
  render() {
    const { formState: state, formErrors: errors, page, path } = this.props;
    const { batteryBrandOptions } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-battery-registry"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
       >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
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
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                  id="brand_name"
                  type={'string'}
                  label={'Изготовитель'}
                  value={state.brand_name}
                  disabled
                  modalKey={page}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                id="serial_number"
                type="string"
                label={'Серийный номер'}
                value={state.serial_number}
                error={errors.serial_number}
                onChange={this.props.handleChange}
                boundKeys="serial_number"
                disabled={!isPermitted}
                modalKey={page}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
              <ExtField
                id="lifetime_months"
                type="string"
                label="Срок службы, мес."
                value={state.lifetime_months}
                error={errors.lifetime_months}
                onChange={this.props.handleChange}
                boundKeys="lifetime_months"
                disabled={!isPermitted}
                modalKey={page}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                id="released_at"
                type="date"
                label="Дата выпуска"
                date={state.released_at}
                time={false}
                error={errors.released_at}
                onChange={this.props.handleChange}
                boundKeys="released_at"
                disabled={!isPermitted}
                modalKey={page}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                id="worked_months"
                type="string"
                label="Количество месяцев наработки"
                value={state.worked_months}
                disabled
                modalKey={page}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <EtsBootstrap.Col md={12}>
                <EtsBootstrap.Row>
                  <BatteryVehicleBlock
                    id="files"
                    onChange={this.props.handleChange}
                    boundKeys="battery_to_car"
                    inputList={state.battery_to_car || []}
                    onValidation={this.handleBatteryToCarValidity}
                    outerValidate
                    errors={errors.battery_to_car}
                    batteryId={state.id}
                    selectField="customId"
                    modalKey={page}
                    page={page}
                    path={path}
                    isPermitted={isPermitted}
                    tableTitle="Транспортное средство, на котором установлен аккумулятор"
                  />
                </EtsBootstrap.Row>
              </EtsBootstrap.Col>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsBatteryRegistry, OwnBatteryRegistryProps>(
  connect<
    StatePropsBatteryRegistry,
    DispatchPropsBatteryRegistry,
    OwnBatteryRegistryProps,
    ReduxState
  >(
    null,
    (dispatch, { page, path }) => ({
      autobaseGetSetBatteryBrand: () =>
        dispatch(
          autobaseActions.autobaseGetSetBatteryBrand({}, { page, path }),
        ),
    }),
  ),
  withSearch,
  withForm<PropsBatteryRegistryWithForm, BatteryRegistry>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateBatteryRegistry,
    updateAction: autobaseActions.autobaseUpdateBatteryRegistry,
    mergeElement: (props) => {
      return getDefaultBatteryRegistryElement(props.element);
    },
    schema: batteryRegistryFormSchema,
    permissions: batteryRegistryPermissions,
  }),
)(BatteryRegistryForm);
