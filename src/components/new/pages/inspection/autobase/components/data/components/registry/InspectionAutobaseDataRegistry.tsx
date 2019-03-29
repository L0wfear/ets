import * as React from 'react';
import { BoxContainerRegistry } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { InspectionAutobaseDataRegistryProps } from './@types/InspectionAutobaseDataRegistry';
import Registry from 'components/new/ui/registry/components/Registry';

const InspectionAutobaseDataRegistry: React.FC<InspectionAutobaseDataRegistryProps> = (props) => {
  const { registryKey } = props;

  return (
    <BoxContainerRegistry>
      <Registry registryKey={registryKey} />
    </BoxContainerRegistry>
  );
};

export default InspectionAutobaseDataRegistry;
