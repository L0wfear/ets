import * as React from 'react';
import { get } from 'lodash';

import Registry from 'components/new/ui/registry/components/Registry';
import InsurancePolicyFormLazy from 'components/new/pages/nsi/autobase/pages/insurance_policy/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

type Props = {
  selectedCarData?: CarWrap;
};

const InsurancePolicyList: React.FC<Props> = React.memo(
  (props) => {
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
        <InsurancePolicyFormLazy
          registryKey={registryKey}
          selectedCarData={selectedCarData}
        />
      </Registry>
    );
  },
);

export default InsurancePolicyList;
