import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { ReduxState } from 'redux-main/@types/state';

type HeaderStateProps = {
  title: OneRegistryData['header']['title'];
};
type HeaderDispatchProps = DispatchProp;
type HeaderOwnProps = {
  registryKey: string;
};
type HeaderMergedProps = (
  HeaderStateProps
  & HeaderDispatchProps
  & HeaderOwnProps
);
type HeaderProps = HeaderMergedProps;

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <EtsHeaderTitle>
      {props.title}
    </EtsHeaderTitle>
  );
};

export default connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    title: getHeaderData(state.registry, registryKey).title,
  }),
)(Header);
