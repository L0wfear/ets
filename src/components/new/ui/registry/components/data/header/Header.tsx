import * as React from 'react';

import Title from 'components/new/ui/registry/components/data/header/title/Title';
import Buttons from 'components/new/ui/registry/components/data/header/buttons/Buttons';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';

type PropsHeader = {
  registryKey: string;
};

const Header: React.FC<PropsHeader> = (props) => {
  return (
    <EtsHeaderContainer>
      <Title registryKey={props.registryKey} />
      <Buttons registryKey={props.registryKey} />
    </EtsHeaderContainer>
  );
};

export default React.memo(Header);
