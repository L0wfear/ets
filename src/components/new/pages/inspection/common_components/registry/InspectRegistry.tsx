import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import { BoxContainerRegistry } from './styled';

const InspectionRegistry: React.FC<{ registryKey: string }> = (props) => {
  return (
    <BoxContainerRegistry>
      <Registry registryKey={props.registryKey} />
    </BoxContainerRegistry>
  );
};

export default InspectionRegistry;
