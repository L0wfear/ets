import * as React from 'react';
import { getInspectionAutobaseDataRegistryConfig } from './components/registry/config';
import InspectionData from '../../../common_components/data/InspectionData';

const InspectionAutobaseData: React.FC<{ loadingPage: string; }> = (props) => {
  return (
    <InspectionData
      loadingPage={props.loadingPage}
      triggerKey="carpoolId"
      type="autobase"
      getRegistryFunc={getInspectionAutobaseDataRegistryConfig}
    />
  );
};

export default InspectionAutobaseData;
