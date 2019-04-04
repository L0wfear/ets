import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import TechMaintenanceOrderFormLazy from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type TechMaintenanceOrderListStateProps = {};
export type TechMaintenanceOrderListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type TechMaintenanceOrderListOwnProps = {};
export type TechMaintenanceOrderListMergedProps = (
  TechMaintenanceOrderListStateProps
  & TechMaintenanceOrderListDispatchProps
  & TechMaintenanceOrderListOwnProps
);
export type TechMaintenanceOrderListProps = (
  TechMaintenanceOrderListMergedProps
);

const TechMaintenanceOrderList: React.FC<TechMaintenanceOrderListProps> = (props) => {
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
      <TechMaintenanceOrderFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<TechMaintenanceOrderListProps, TechMaintenanceOrderListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<TechMaintenanceOrderListStateProps, TechMaintenanceOrderListDispatchProps, TechMaintenanceOrderListOwnProps, ReduxState>(
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
)(TechMaintenanceOrderList);
