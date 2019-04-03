import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import BatteryManufacturerFormLazy from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type BatteryManufacturerListStateProps = {};
export type BatteryManufacturerListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type BatteryManufacturerListOwnProps = {};
export type BatteryManufacturerListMergedProps = (
  BatteryManufacturerListStateProps
  & BatteryManufacturerListDispatchProps
  & BatteryManufacturerListOwnProps
);
export type BatteryManufacturerListProps = (
  BatteryManufacturerListMergedProps
);

const BatteryManufacturerList: React.FC<BatteryManufacturerListProps> = (props) => {
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
      <BatteryManufacturerFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<BatteryManufacturerListProps, BatteryManufacturerListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<BatteryManufacturerListStateProps, BatteryManufacturerListDispatchProps, BatteryManufacturerListOwnProps, ReduxState>(
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
)(BatteryManufacturerList);
