import * as React from 'react';
import { get } from 'lodash';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_batteries_on_car/_config-data/registry-config';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import ActualBatteriesOnCarForm from './form/ActualBatteriesOnCarForm';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

type Props = {
  selectedCarData?: Car;
};
const BatteryRegistryList: React.FC<Props> = (props) => {
  const {
    selectedCarData,
  } = props;

  const car_id = get(selectedCarData, 'asuods_id', null);
  const dispatch = etsUseDispatch();
  React.useEffect(
    () => {
      dispatch(registryAddInitialData(getToConfig(car_id)));
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [car_id],
  );

  return (
    <Registry registryKey={registryKey}>
      <ActualBatteriesOnCarForm registryKey={registryKey} />
    </Registry>
  );
};

export default BatteryRegistryList;
