import * as React from 'react';
import { getInspectionPgmBaseDataRegistryConfig } from './components/registry/config';
import InspectionData from '../../../common_components/data/InspectionData';

const InspectionPgmBaseData: React.FC<{ loadingPage: string }> = (props) => {
  return (
    <InspectionData
      loadingPage={props.loadingPage}
      triggerKey="pgmBaseId"
      type="pgm_base"
      getRegistryFunc={getInspectionPgmBaseDataRegistryConfig}
    />
  );
};

export default InspectionPgmBaseData;
