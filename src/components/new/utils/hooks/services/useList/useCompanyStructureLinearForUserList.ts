import * as React from 'react';

import { CompanyStructureLinearForUserListApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useCompanyStructureLinearForUserList = (page: string, path: string) => {
  const paylaod = React.useMemo<CompanyStructureLinearForUserListApi['payload']>(
    () => ({
      descendants_by_user: true,
      linear: 1,
    }),
    [],
  );

  return useLoadListData<CompanyStructureLinearForUserListApi>('company_structure', '', paylaod, page, path);
};

export default useCompanyStructureLinearForUserList;
