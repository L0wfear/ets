import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import FuelRatesFormLazy from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type FuelRatesListStateProps = {};
export type FuelRatesListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type FuelRatesListOwnProps = {};
export type FuelRatesListMergedProps = (
  FuelRatesListStateProps
  & FuelRatesListDispatchProps
  & FuelRatesListOwnProps
);
export type FuelRatesListProps = (
  FuelRatesListMergedProps
);

const FuelRatesList: React.FC<FuelRatesListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig());
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <FuelRatesFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<FuelRatesListProps, FuelRatesListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<FuelRatesListStateProps, FuelRatesListDispatchProps, FuelRatesListOwnProps, ReduxState>(
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
)(FuelRatesList);
