import * as React from 'react';

import {
  registryKey,
} from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { CarActualRegistryFormContext } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/CarFormContext';
import { get } from 'lodash';
import withForm, { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import batteryRegistryPermissions from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/permissions';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { carActualAddBatteryFormSchema } from './schema';
import { ExtField } from 'components/ui/new/field/ExtField';
import { isNullOrUndefined } from 'util';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getDefaultBatteryRegistryElement } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/utils';
import { EtsButtonsContainer } from '../../../../styled/styled';
import { diffDates } from 'utils/dates';

export type CarActualAddBatteryFormStateProps = {};
export type CarActualAddBatteryFormDispatchProps = {
  // registryProps
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type CarActualAddBatteryFormOwnProps = {
  // form props
  element: any;
  handleHide: () => any;

  page: string;
};
export type CarActualAddBatteryFormMergedProps = (
  CarActualAddBatteryFormStateProps
  & CarActualAddBatteryFormDispatchProps
  & CarActualAddBatteryFormOwnProps
);
export type CarActualAddBatteryFormProps = OutputWithFormProps<
  CarActualAddBatteryFormMergedProps,
  BatteryRegistry,
  [ BatteryRegistry ],
  any
>;

export type CarActualAddBatteryFormState = {
  newBatteryOnCar: {
    car_id: number;
    installed_at: string | null;
    uninstalled_at: string | null;
  },
  originBatteryToCar: BatteryRegistry['battery_to_car'],
};

const CarActualAddBatteryForm: React.FC<CarActualAddBatteryFormProps> = React.memo(
  (props) => {
    // Переписать на useDispatch
    const CarActualRegistryFormValue = React.useContext(CarActualRegistryFormContext);

    const battery_to_car = get(props, 'formState.battery_to_car', []);
    const gov_number = get(CarActualRegistryFormValue, 'currentSelectedCar.gov_number', null);
    const asuods_id = get(CarActualRegistryFormValue, 'currentSelectedCar.asuods_id', null);
    const { formErrors: errors, } = props;

    const [newBatteryOnCar, setNewBatteryOnCar ] = React.useState<CarActualAddBatteryFormState['newBatteryOnCar']>({
      car_id: asuods_id,
      installed_at: null,
      uninstalled_at: null,
    });
    const [originBatteryToCar, setOriginBatteryToCar] = React.useState<CarActualAddBatteryFormState['originBatteryToCar']>([]);

    React.useEffect(() => {
      setOriginBatteryToCar(get(props, 'formState.battery_to_car', []));
    }, []);

    const lastCarBatteryUninstalled = React.useMemo(() => {
      return originBatteryToCar.length
        ? originBatteryToCar.reduce((lastCarBattery, currentCar) => {
          return diffDates(currentCar.uninstalled_at, lastCarBattery) > 0
            ? currentCar
            : lastCarBattery;
        }, originBatteryToCar[0])
        : null;
    }, [originBatteryToCar]);

    const handleBatteryToCarChange = React.useCallback((key, value) => {
      setNewBatteryOnCar({
        ...newBatteryOnCar,
        [key]: value,
      });
    }, [newBatteryOnCar]);

    React.useEffect(() => {
      const intoBatteryToCar = !isNullOrUndefined(battery_to_car.find((elem) => elem.car_id === asuods_id ));
      intoBatteryToCar
        ? props.handleChange('battery_to_car', battery_to_car.map((elem) => elem.car_id === asuods_id ? newBatteryOnCar : elem ))
        : props.handleChange('battery_to_car', [...battery_to_car, newBatteryOnCar]);
    }, [newBatteryOnCar]);

    const installedAtLabel = `Дата монтажа аккумулятора на ТС: ${gov_number}`;
    const uninstalledAtLabel = `Дата демонтажа аккумулятора с ТС: ${get(lastCarBatteryUninstalled, 'gov_number', '-')}`;

    const currentFormErrors = React.useMemo(() => {
      const errorIndex = battery_to_car.findIndex((elem) => elem.car_id === newBatteryOnCar.car_id);
      return errorIndex || errorIndex === 0 ? errors.battery_to_car[errorIndex] : null;
    }, [battery_to_car, errors]);

    return (
      <EtsBootstrap.ModalContainer
        id="modal-duty-mission-reject"
        onHide={props.handleHide}
        show
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{`Добавление аккумулятора на ТС: ${gov_number}`}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} typePreloader="mainpage">
          <ExtField
            id="installed_at"
            type="date"
            label={installedAtLabel}
            date={newBatteryOnCar.installed_at}
            time={false}
            error={currentFormErrors ? currentFormErrors.installed_at : ''}
            onChange={handleBatteryToCarChange}
            boundKeys="installed_at"
            modalKey={props.page}
          />
          {
            lastCarBatteryUninstalled &&
            (
              <ExtField
                id="uninstalled_at"
                type="date"
                label={uninstalledAtLabel}
                date={newBatteryOnCar.uninstalled_at}
                time={false}
                error={currentFormErrors ? currentFormErrors.uninstalled_at : ''}
                onChange={handleBatteryToCarChange}
                boundKeys="uninstalled_at"
                modalKey={props.page}
              />
            )
          }
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsButtonsContainer>
            <EtsBootstrap.Button
              disabled={!props.canSave}
              onClick={props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={props.handleHide}>
              Отменить
            </EtsBootstrap.Button>
          </EtsButtonsContainer>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<CarActualAddBatteryFormProps, CarActualAddBatteryFormOwnProps>(
  withSearch,
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<CarActualAddBatteryFormStateProps, CarActualAddBatteryFormDispatchProps, CarActualAddBatteryFormOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      registryAddInitialData: (...any) => (
        dispatch(
          registryAddInitialData(...any),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
    }),
  ),
  withForm<CarActualAddBatteryFormMergedProps, BatteryRegistry>({
    uniqField: 'id',
    updateAction: autobaseActions.autobaseUpdateBatteryRegistry,
    mergeElement: (props) => {
      return getDefaultBatteryRegistryElement(props.element);
    },
    schema: carActualAddBatteryFormSchema,
    permissions: batteryRegistryPermissions,
  }),
)(CarActualAddBatteryForm);
