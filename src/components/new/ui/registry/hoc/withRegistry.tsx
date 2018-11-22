import * as React from 'react';
import { connect } from 'react-redux';
import {
  registryAddInitialData,
  registryRemoveData,
} from 'components/new/ui/registry/module/actions-registy';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import {
  TypeConfigData,
  PropsRegistryWrap,
  StateRegistryWrap,
} from 'components/new/ui/registry/hoc/withRegistry.h';
import { ReduxState } from 'redux-main/@types/state';

const withRegistry = (configData: TypeConfigData) => (Component) => (
  hocAll(
    withPreloader({
      page: 'registry',
      typePreloader: 'mainpage',
    }),
    connect<any, any, any, ReduxState>(
      null,
      (dispatch) => ({
        registryAddInitialData: (config: TypeConfigData) => (
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
          <Component />
        );
      }
    },
  )
);

export default withRegistry;
