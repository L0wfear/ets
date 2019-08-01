import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import BatteryRegistryFormLazy from 'components/new/pages/nsi/autobase/pages/battery_registry/form';
import { CarActualRegistryFormContext } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/CarFormContext';
import { get } from 'lodash';

export type CarActualAddBatteryRegistryFormStateProps = {};
export type CarActualAddBatteryRegistryFormDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type CarActualAddBatteryRegistryFormOwnProps = {
  // form props
  element: any;
  handleHide: () => any;

  page: string;
};
export type CarActualAddBatteryRegistryFormMergedProps = (
  CarActualAddBatteryRegistryFormStateProps
  & CarActualAddBatteryRegistryFormDispatchProps
  & CarActualAddBatteryRegistryFormOwnProps
);
export type CarActualAddBatteryRegistryFormProps = (
  CarActualAddBatteryRegistryFormMergedProps
);

const CarActualAddBatteryRegistryForm: React.FC<CarActualAddBatteryRegistryFormProps> = (props) => {
  // Переписать на useDispatch
  const CarActualRegistryFormValue = React.useContext(CarActualRegistryFormContext);
  const company_id = get(CarActualRegistryFormValue, 'currentSelectedCar.company_id', null);

  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(null, company_id));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  const handleHideForm = React.useCallback(
    (isSubmitted) => {
      if (isSubmitted) {
        props.handleHide();
      }
    },
    [props.handleHide],
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-car-actual-add-battery"
      onHide={props.handleHide}
      show
      bsSize="large"
     >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{`Добавить запись`}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={props.page} typePreloader="mainpage">
        <Registry registryKey={registryKey} />
        <BatteryRegistryFormLazy registryKey={registryKey} handleHide={handleHideForm} />
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button onClick={props.handleHide}>Закрыть</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<CarActualAddBatteryRegistryFormProps, CarActualAddBatteryRegistryFormOwnProps>(
  withSearch,
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<CarActualAddBatteryRegistryFormStateProps, CarActualAddBatteryRegistryFormDispatchProps, CarActualAddBatteryRegistryFormOwnProps, ReduxState>(
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
)(CarActualAddBatteryRegistryForm);
