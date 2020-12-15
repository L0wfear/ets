import * as React from 'react';
import { getInspectionAutobaseDataRegistryConfig } from './components/registry/config';
import InspectionData from '../../../common_components/data/InspectionData';

type OwnProps = {
  loadingPage: string;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const InspectionAutobaseData: React.FC<OwnProps> = (props) => {
  return (
    <InspectionData
      loadingPage={props.loadingPage}
      triggerKey="carpoolId"
      type="autobase"
      getRegistryFunc={getInspectionAutobaseDataRegistryConfig}
      refresh={props.refresh}
      setRefresh={props.setRefresh}
    />
  );
};

export default InspectionAutobaseData;
