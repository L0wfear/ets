import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import ProgramRegistryFormLazy from 'components/new/pages/program_registry/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/program_registry/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type ProgramRegistryListStateProps = {};
export type ProgramRegistryListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type ProgramRegistryListOwnProps = {};
export type ProgramRegistryListMergedProps = (
  ProgramRegistryListStateProps
  & ProgramRegistryListDispatchProps
  & ProgramRegistryListOwnProps
);
export type ProgramRegistryListProps = (
  ProgramRegistryListMergedProps
);

const ProgramRegistryList: React.FC<ProgramRegistryListProps> = (props) => {
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
      <ProgramRegistryFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<ProgramRegistryListProps, ProgramRegistryListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ProgramRegistryListStateProps, ProgramRegistryListDispatchProps, ProgramRegistryListOwnProps, ReduxState>(
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
)(ProgramRegistryList);
