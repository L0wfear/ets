import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';
import { connect, DispatchProp } from 'react-redux';
import { getRootRegistry, getHeaderData } from '../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from '../module/registry';
import TemplateRegistry from 'components/new/ui/template/registry/TemplateRegistry';

type RegistryStateProps = {
  hasData: boolean;
  title: OneRegistryData['header']['title'];
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
    React.useLayoutEffect(
      () => {
        const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
        if (document) {
          document.title = `${etsName} ${props.title}`;
        }

        return () => {
          if (document) {
            document.title = etsName;
          }
        };
      },
    );
    return (
      props.hasData
        ? (
          <Data registryKey={props.registryKey} />
        )
        : (
          <TemplateRegistry/>
        )
    );
  },
);

export default connect<RegistryStateProps, RegistryDispatchProps, RegistryOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    hasData: Boolean(getRootRegistry(getRegistryState(state), registryKey, true)),
    title: getHeaderData(getRegistryState(state), registryKey).title,
  }),
)(Registry);
