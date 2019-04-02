import * as React from 'react';

import Title from 'components/new/ui/registry/components/data/header/title/Title';
import Buttons from 'components/new/ui/registry/components/data/header/buttons/Buttons';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';

type PropsHeader = {
  registryKey: string;
  components?: any;
};

type StateHeader = {
};

class Header extends React.PureComponent<PropsHeader, StateHeader> {
  render() {
    return (
      <EtsHeaderContainer>
        <Title registryKey={this.props.registryKey} />
        <Buttons registryKey={this.props.registryKey} />
      </EtsHeaderContainer>
    );
  }
}

export default Header;
