import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import FuelOperationsFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type FuelOperationsListStateProps = {};
export type FuelOperationsListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type FuelOperationsListOwnProps = {};
export type FuelOperationsListMergedProps = (
  FuelOperationsListStateProps
  & FuelOperationsListDispatchProps
  & FuelOperationsListOwnProps
);
export type FuelOperationsListProps = (
  FuelOperationsListMergedProps
);

const FuelOperationsList: React.FC<FuelOperationsListProps> = (props) => {
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
      <FuelOperationsFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<FuelOperationsListProps, FuelOperationsListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<FuelOperationsListStateProps, FuelOperationsListDispatchProps, FuelOperationsListOwnProps, ReduxState>(
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
)(FuelOperationsList);
