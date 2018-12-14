import { CompanyStructureService } from 'api/Services';
import { get } from 'lodash';

/* ------------- COMPANY_STRUCTURE ------------- */
export const companyStructureLoadCompanyStructure = (payload = {}) => (
  CompanyStructureService.get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);

      return {
        result: [],
      };
    })
    .then((ans) => ({
      data: get(ans, ['result'], []),
    }))
);
export const companyStructureLoadCompanyStructureLineat = (payload = {}) => (
  companyStructureLoadCompanyStructure({ linear: true, ...payload })
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
