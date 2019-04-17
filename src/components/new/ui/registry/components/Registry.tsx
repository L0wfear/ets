import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';

type PropsRegistry = {
  registryKey: string;
};

const Registry: React.FC<PropsRegistry> = (props) => {
  const {
    registryKey,
  } = props;

  return (
    <Data registryKey={registryKey} />
  );
};

export default React.memo(Registry);
