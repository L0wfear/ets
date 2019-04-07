import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import MaintenanceRateFormLazy from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type MaintenanceRateListStateProps = {};
export type MaintenanceRateListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type MaintenanceRateListOwnProps = {};
export type MaintenanceRateListMergedProps = (
  MaintenanceRateListStateProps
  & MaintenanceRateListDispatchProps
  & MaintenanceRateListOwnProps
);
export type MaintenanceRateListProps = (
  MaintenanceRateListMergedProps
);

const MaintenanceRateList: React.FC<MaintenanceRateListProps> = (props) => {
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
      <MaintenanceRateFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<MaintenanceRateListProps, MaintenanceRateListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MaintenanceRateListStateProps, MaintenanceRateListDispatchProps, MaintenanceRateListOwnProps, ReduxState>(
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
)(MaintenanceRateList);
