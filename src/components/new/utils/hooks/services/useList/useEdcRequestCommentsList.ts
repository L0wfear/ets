import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

import { EdcRequestCommentsApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useEdcRequestCommentsList = (id: EdcRequest['id'], page?: string, path?: string) => {
  return useLoadListData<EdcRequestCommentsApi>(`edc_request/${id}/comments`, '',  null, page, path);
};

export default useEdcRequestCommentsList;
