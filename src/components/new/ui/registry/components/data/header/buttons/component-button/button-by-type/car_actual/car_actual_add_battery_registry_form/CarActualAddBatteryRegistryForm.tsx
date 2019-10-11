import * as React from 'react';
import { get } from 'lodash';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import BatteryRegistryFormLazy from 'components/new/pages/nsi/autobase/pages/battery_registry/form';
import { CarActualRegistryFormContext } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/CarFormContext';
import * as registryAddButtonConfig from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_batteries_on_car/_config-data/registry-config';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  // form props
  element: any;
  handleHide: () => any;

  page: string;
};
type Props = (
  OwnProps
);

const CarActualAddBatteryRegistryForm: React.FC<Props> = (props) => {
  // Переписать на useDispatch
  const CarActualRegistryFormValue = React.useContext(CarActualRegistryFormContext);
  const company_id = get(CarActualRegistryFormValue, 'currentSelectedCar.company_id', null);

  const dispatch = etsUseDispatch();
  React.useEffect(
    () => {
      dispatch(registryAddInitialData(getToConfig(null, company_id)));
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [],
  );

  const handleHideForm = React.useCallback(
    (isSubmitted) => {
      if (isSubmitted) {
        dispatch(registryLoadDataByKey(registryAddButtonConfig.registryKey));
        props.handleHide();
      }
    },
    [props.handleHide, props.page],
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
        <Registry registryKey={registryKey}>
          <BatteryRegistryFormLazy registryKey={registryKey} handleHide={handleHideForm} />
        </Registry>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button onClick={props.handleHide}>Закрыть</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default CarActualAddBatteryRegistryForm;
