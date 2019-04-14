import * as React from 'react';

import Title from 'components/new/ui/registry/components/data/header/title/Title';
import Buttons from 'components/new/ui/registry/components/data/header/buttons/Buttons';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { connect, DispatchProp } from 'react-redux';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getHeaderData } from '../../../module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { DivNone } from 'global-styled/global-styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import SelectedOdhDtDisabled from './middle/SelectedOdhDtDisabled';
import SelectedOdhDt from './middle/SelectedOdhDt';

type HeaderStateProps = {
  format: OneRegistryData['header']['format'];
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

const getMiddleBlockComponent = (format: OneRegistryData['header']['format']) => {
  switch (format) {
    case 'select_odh/dt(disabled)': return SelectedOdhDtDisabled;
    case 'select_odh/dt': return SelectedOdhDt;
    default: return null;
  }
};

const Header: React.FC<HeaderProps> = React.memo(
  (props) => {
    const MiddleBlock = getMiddleBlockComponent(props.format);

    return (
      <EtsHeaderContainer>
        <Title registryKey={props.registryKey} />
        {
          MiddleBlock
            ? (
              <MiddleBlock registryKey={props.registryKey} />
            )
            : (
              <DivNone />
            )
        }
        <Buttons registryKey={props.registryKey} />
      </EtsHeaderContainer>
    );
  },
);

export default connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    format: getHeaderData(getRegistryState(state), registryKey).format,
  }),
)(Header);
