import { CompanyStructureService } from 'api/Services';
import {
  keyBy,
  get,
} from 'lodash';

/* ------------- COMPANY_STRUCTURE ------------- */
export const getCompanyStructure = (payload = {}) => (
  CompanyStructureService.get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line:no-console
    })
    .then((ans) => {
      const data = get(ans, ['result'], []);
      return {
        data,
        dataIndex: keyBy(data, 'id'),
      };
    })
);
export const getCompanyStructureLinear = (payload = {}) => (
  getCompanyStructure({ linear: true, ...payload })
);
export const getCompanyStructureDescendantsByUser = (payload = {}) => (
  getCompanyStructure({ descendants_by_user: true, linear: true, ...payload })
);

export const promiseCreateCompanyStructure = (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return CompanyStructureService.post(
    payload,
    false,
    'json',
  );
};
export const promiseUpdateCompanyStructure = (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return CompanyStructureService.put(
    payload,
    false,
    'json',
  );
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
