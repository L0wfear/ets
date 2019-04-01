import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import NormRegistryFormLazy from 'components/new/pages/nsi/norm_registry/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/norm_registry/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type NormRegistryListStateProps = {};
export type NormRegistryListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type NormRegistryListOwnProps = {};
export type NormRegistryListMergedProps = (
  NormRegistryListStateProps
  & NormRegistryListDispatchProps
  & NormRegistryListOwnProps
);
export type NormRegistryListProps = (
  NormRegistryListMergedProps
);

const NormRegistryList: React.FC<NormRegistryListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(config);

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
      <>
        <Registry registryKey={registryKey} />
        <NormRegistryFormLazy registryKey={registryKey} />
      </>
  );
};

export default compose<NormRegistryListProps, NormRegistryListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<NormRegistryListStateProps, NormRegistryListDispatchProps, NormRegistryListOwnProps, NormRegistryListMergedProps, ReduxState>(
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
    null,
    {
      pure: false,
    },
  ),
)(NormRegistryList);
