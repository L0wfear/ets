import * as React from 'react';
import { get } from 'lodash';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from './_config-data/registry-config';

import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type Props = {
  selectedCarData?: Car;
};
const TachographList: React.FC<Props> = React.memo(
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
      [],
    );

    return (
      <Registry registryKey={registryKey}/>
    );
  },
);

export default TachographList;