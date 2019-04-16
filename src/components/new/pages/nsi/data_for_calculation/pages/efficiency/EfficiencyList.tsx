import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import EfficiencyFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type EfficiencyListStateProps = {};
export type EfficiencyListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type EfficiencyListOwnProps = {};
export type EfficiencyListMergedProps = (
  EfficiencyListStateProps
  & EfficiencyListDispatchProps
  & EfficiencyListOwnProps
);
export type EfficiencyListProps = (
  EfficiencyListMergedProps
);

const EfficiencyList: React.FC<EfficiencyListProps> = (props) => {
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
      <EfficiencyFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<EfficiencyListProps, EfficiencyListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<EfficiencyListStateProps, EfficiencyListDispatchProps, EfficiencyListOwnProps, ReduxState>(
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
)(EfficiencyList);
