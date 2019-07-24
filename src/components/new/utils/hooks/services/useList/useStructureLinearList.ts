import * as React from 'react';

import { CompanyStructureLinearApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useStructureLinearList = (page: string, path: string) => {
  const payload = React.useMemo<CompanyStructureLinearApi['payload']>(
    () => ({
      linear: true,
    }),
    [],
  );
  return useLoadListData<CompanyStructureLinearApi>('company_structure', '', payload, page, path);
};

export default useStructureLinearList;
