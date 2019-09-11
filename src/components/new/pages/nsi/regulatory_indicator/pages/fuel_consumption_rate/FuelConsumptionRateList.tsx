import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import FuelRatesFormLazy from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type OwnProps = {};
export type Props = OwnProps & {};

const FuelRatesList: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(
          registryAddInitialData(getToConfig()),
        );
        return () => {
          dispatch(
            registryRemoveData(registryKey),
          );
        };
      },
      [getToConfig],
    );

    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <FuelRatesFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withPreloader<OwnProps>({
  page: registryKey,
  typePreloader: 'mainpage',
})(FuelRatesList);
