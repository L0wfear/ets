import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import MaintenanceWorkFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type MaintenanceWorkListStateProps = {};
export type MaintenanceWorkListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type MaintenanceWorkListOwnProps = {};
export type MaintenanceWorkListMergedProps = (
  MaintenanceWorkListStateProps
  & MaintenanceWorkListDispatchProps
  & MaintenanceWorkListOwnProps
);
export type MaintenanceWorkListProps = (
  MaintenanceWorkListMergedProps
);

const MaintenanceWorkList: React.FC<MaintenanceWorkListProps> = (props) => {
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
      <MaintenanceWorkFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<MaintenanceWorkListProps, MaintenanceWorkListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MaintenanceWorkListStateProps, MaintenanceWorkListDispatchProps, MaintenanceWorkListOwnProps, ReduxState>(
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
)(MaintenanceWorkList);
