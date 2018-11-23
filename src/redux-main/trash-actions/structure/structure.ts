import { loadCompanyStructure } from 'redux-main/trash-actions/structure/promise/promise';

export const getCompanyStructure: any = (type, outerPayload, meta) => ({
  type,
  payload: loadCompanyStructure(outerPayload),
  meta,
});
