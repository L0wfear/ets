import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';
import { connect, DispatchProp } from 'react-redux';
import { getRootRegistry } from '../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

type RegistryStateProps = {
  hasData: boolean;
};
type RegistryDispatchProps = DispatchProp;
type RegistryOwnProps = {
  registryKey: string;
};

type PropsRegistry = (
  RegistryStateProps
  & RegistryDispatchProps
  & RegistryOwnProps
);

const Registry: React.FC<PropsRegistry> =  React.memo(
  (props) => {
    return (
      props.hasData &&
        <Data registryKey={props.registryKey} />
    );
  },
);

export default connect<RegistryStateProps, RegistryDispatchProps, RegistryOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    hasData: Boolean(getRootRegistry(getRegistryState(state), registryKey, true)),
  }),
)(Registry);
