import * as React from 'react';
import { getInspectionPgmBaseDataRegistryConfig } from './components/registry/config';
import InspectionData from '../../../common_components/data/InspectionData';

type OwnProps = {
  loadingPage: string;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const InspectionPgmBaseData: React.FC<OwnProps> = (props) => {
  return (
    <InspectionData
      loadingPage={props.loadingPage}
      triggerKey="pgmBaseId"
      type="pgm_base"
      getRegistryFunc={getInspectionPgmBaseDataRegistryConfig}
      setRefresh={props.setRefresh}
      refresh={props.refresh}
    />
  );
};

export default InspectionPgmBaseData;
