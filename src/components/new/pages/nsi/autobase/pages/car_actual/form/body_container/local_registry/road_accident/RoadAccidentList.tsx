import * as React from 'react';
import { get } from 'lodash';

import Registry from 'components/new/ui/registry/components/Registry';
import RoadAccidentFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { CarWrap } from '../../../@types/CarForm';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type OwnProps = {
  selectedCarData?: CarWrap;
};
export type Props = OwnProps & {};

const RoadAccidentList: React.FC<Props> = React.memo(
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
      [car_id, getToConfig],
    );

    return (
      <>
        <Registry registryKey={registryKey} />
        <RoadAccidentFormLazy
          registryKey={registryKey}
          selectedCarData={selectedCarData}
        />
      </>
    );
  },
);

export default withPreloader<OwnProps>({
  page: registryKey,
  typePreloader: 'mainpage',
})(RoadAccidentList);
