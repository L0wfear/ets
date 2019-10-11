import * as React from 'react';
import { get } from 'lodash';

import Registry from 'components/new/ui/registry/components/Registry';
import TechInspectionFormLazy from 'components/new/pages/nsi/autobase/pages/tech_inspection/form';
import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import { CarWrap } from '../car_actual/form/@types/CarForm';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  selectedCarData?: CarWrap;
};

const TechInspectionList: React.FC<Props> = (props) => {
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
      <TechInspectionFormLazy
        registryKey={registryKey}
        selectedCarData={selectedCarData}
        />
    </Registry>
  );
};

export default TechInspectionList;
