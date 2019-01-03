import { CompanyStructureService } from 'api/Services';
import {
  keyBy,
  get,
} from 'lodash';

/* ------------- COMPANY_STRUCTURE ------------- */
export const getCompanyStructure = (payload = {}) => (
  CompanyStructureService.get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);
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
export const companyStructureCreateCompanyStructure = (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return CompanyStructureService.post(
    payload,
    false,
    'json',
  );
};
export const companyStructureUpdateCompanyStructure = (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return CompanyStructureService.put(
    payload,
    false,
    'json',
  );
};
export const companyStructureDeleteCompanyStructure = (id) => {
  return CompanyStructureService.path(id).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};
