import * as React from 'react';
import { connect } from 'react-redux';
import {
  registryAddInitialData,
  registryRemoveData,
} from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import {
  TypeConfigData,
  PropsRegistryWrap,
  StateRegistryWrap,
} from 'components/new/ui/registry/hoc/withRegistry.h';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'redux';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const withRegistry = <F extends any>(configData: TypeConfigData<F>) => (Component) => (
  compose(
    withPreloader({
      page: configData.registryKey,
      typePreloader: 'mainpage',
    }),
    withSearch,
    connect<any, any, any, ReduxState>(
      null,
      (dispatch: any) => ({
        registryAddInitialData: (config: TypeConfigData<F>) => (
          dispatch(
            registryAddInitialData(config),
          )
        ),
        registryRemoveData: (registryKey) => (
          dispatch(
            registryRemoveData(registryKey),
          )
        ),
      }),
    ),
  )(
    class RegistryWrap extends React.Component<PropsRegistryWrap, StateRegistryWrap> {
      componentDidMount() {
        this.props.registryAddInitialData(configData);
      }

      componentWillUnmount() {
        this.props.registryRemoveData(configData.registryKey);
      }

      render() {
        return (
          <>
            <Component />
          </>
        );
      }
    },
  )
);

export default withRegistry;
