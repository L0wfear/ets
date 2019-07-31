import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import BatteryBrandFormLazy from 'components/new/pages/nsi/autobase/pages/battery_brand/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type BatteryBrandListStateProps = {};
export type BatteryBrandListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type BatteryBrandListOwnProps = {};
export type BatteryBrandListMergedProps = (
  BatteryBrandListStateProps
  & BatteryBrandListDispatchProps
  & BatteryBrandListOwnProps
);
export type BatteryBrandListProps = (
  BatteryBrandListMergedProps
);

const BatteryBrandList: React.FC<BatteryBrandListProps> = (props) => {
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
      <BatteryBrandFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<BatteryBrandListProps, BatteryBrandListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<BatteryBrandListStateProps, BatteryBrandListDispatchProps, BatteryBrandListOwnProps, ReduxState>(
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
)(BatteryBrandList);
