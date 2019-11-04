import { CompanyStructureService } from 'api/Services';
import {
  keyBy,
  get,
} from 'lodash';
import { CompanyStructure, CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

/* ------------- COMPANY_STRUCTURE ------------- */
export const getCompanyStructure = async <F extends any = CompanyStructure>(payload = {}) => {
  let response = null;

  try {
    response = await CompanyStructureService.get({ ...payload });
  } catch {
    //
  }

  const data: Array<F> = get(response, 'result', []);
  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

export const getCompanyStructureLinear = (payload = {}) => (
  getCompanyStructure<CompanyStructureLinear>({ linear: true, ...payload })
);
export const getCompanyStructureDescendantsByUser = (payload = {}) => (
  getCompanyStructure<CompanyStructureLinear>({ descendants_by_user: true, linear: true, ...payload })
);

export const promiseCreateCompanyStructure = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  await CompanyStructureService.post(
    payload,
    false,
    'json',
  );

  return {
    ...ownPayload,
  };
};
export const promiseUpdateCompanyStructure = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  await CompanyStructureService.put(
    payload,
    false,
    'json',
  );

  return {
    ...ownPayload,
  };
};
export const promiseDeleteCompanyStructure = (id) => {
  return CompanyStructureService.delete(
    { id },
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};
