import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/administration/services/_config-data/registry-config';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import { HandleThunkActionCreator } from 'react-redux';

import ServicesFormLazy from 'components/new/pages/administration/services/form';

export type ServicesListStateProps = {};
export type ServicesListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type ServicesListOwnProps = {};
export type ServicesListMergedProps = (
  ServicesListStateProps
  & ServicesListDispatchProps
  & ServicesListOwnProps
);
export type ServicesListProps = (
  ServicesListMergedProps
);

const ServicesList: React.FC<ServicesListProps> = (props) => {
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
        <ServicesFormLazy registryKey={registryKey} />
      </>
  );
};

export default compose<ServicesListProps, ServicesListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ServicesListStateProps, ServicesListDispatchProps, ServicesListOwnProps, ReduxState>(
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
)(ServicesList);
