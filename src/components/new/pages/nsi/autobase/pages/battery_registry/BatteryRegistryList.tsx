import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import BatteryRegistryFormLazy from 'components/new/pages/nsi/autobase/pages/battery_registry/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type BatteryRegistryListStateProps = {};
export type BatteryRegistryListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type BatteryRegistryListOwnProps = {};
export type BatteryRegistryListMergedProps = (
  BatteryRegistryListStateProps
  & BatteryRegistryListDispatchProps
  & BatteryRegistryListOwnProps
);
export type BatteryRegistryListProps = (
  BatteryRegistryListMergedProps
);

const BatteryRegistryList: React.FC<BatteryRegistryListProps> = (props) => {
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
      <BatteryRegistryFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<BatteryRegistryListProps, BatteryRegistryListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<BatteryRegistryListStateProps, BatteryRegistryListDispatchProps, BatteryRegistryListOwnProps, ReduxState>(
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
)(BatteryRegistryList);
