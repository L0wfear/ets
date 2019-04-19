import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import StateProgramFormLazy from 'components/new/pages/nsi/repair/pages/state_program/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/repair/pages/state_program/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type StateProgramListStateProps = {};
export type StateProgramListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type StateProgramListOwnProps = {};
export type StateProgramListMergedProps = (
  StateProgramListStateProps
  & StateProgramListDispatchProps
  & StateProgramListOwnProps
);
export type StateProgramListProps = (
  StateProgramListMergedProps
) & WithSearchProps;

const StateProgramList: React.FC<StateProgramListProps> = (props) => {
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
      <StateProgramFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<StateProgramListProps, StateProgramListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<StateProgramListStateProps, StateProgramListDispatchProps, StateProgramListOwnProps, ReduxState>(
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
)(StateProgramList);
