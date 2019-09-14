import * as React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnBatteryRegistryProps,
  PropsBatteryRegistry,
  StateBatteryRegistry,
  PropsBatteryRegistryWithForm,
} from 'components/new/pages/nsi/autobase/pages/battery_registry/form/@types/BatteryRegistryForm';
import { BatteryRegistry, BatteryOnCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import BatteryToVehicleBlockComponent from 'components/new/pages/nsi/autobase/pages/battery_registry/form/vehicle-block/BatteryToVehicleBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { getDefaultBatteryRegistryElement } from './utils';
import { batteryRegistryFormSchema } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/schema';
import batteryRegistryPermissions from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/permissions';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { uniqKeyForParams } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_batteries_on_car/_config-data/registry-config';
import { autobaseGetSetBatteryBrand } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/actions';
import { autobaseCreateBatteryRegistry, autobaseUpdateBatteryRegistry } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/actions';

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
      data,
    } = await this.props.dispatch(
      autobaseGetSetBatteryBrand(
        {},
        this.props,
      ),
    );

    this.setState({
      batteryBrandOptions: data.map((rowData) => ({
        value: rowData.id,
        label: rowData.name,
        batteryBrand: rowData,
      })),
    });
  }

  handleChangeBrandId = (name, value, option) => {
    this.props.handleChange({
      [name]: value,
      brand_name: get(option, 'batteryBrand.name', null),
    });
  };

  handleBatteryToCarValidity = ({ isValidInput }) =>
    this.setState({ canSave: isValidInput });
  render() {
    const { formState: state, formErrors: errors, page, path } = this.props;
    const { batteryBrandOptions } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isGivenAway = state.status === 'given_away' ? false : true;
    const isPermitted = !IS_CREATING
      ? (this.props.isPermittedToUpdate && isGivenAway)
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
                  id="manufacturer_name"
                  type={'string'}
                  label={'Изготовитель'}
                  value={state.manufacturer_name}
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
          {
            isPermitted && ( // либо обновление, либо создание
              <EtsBootstrap.Button
                disabled={!this.props.canSave}
                onClick={this.props.defaultSubmit}>
                Сохранить
              </EtsBootstrap.Button>
          )
        }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsBatteryRegistry, OwnBatteryRegistryProps>(
  withForm<PropsBatteryRegistryWithForm, BatteryRegistry>({
    uniqField: 'id',
    createAction: autobaseCreateBatteryRegistry,
    updateAction: autobaseUpdateBatteryRegistry,
    mergeElement: (props) => {
      return getDefaultBatteryRegistryElement(props.element);
    },
    schema: batteryRegistryFormSchema,
    permissions: batteryRegistryPermissions,
  }),
)(BatteryRegistryForm);
