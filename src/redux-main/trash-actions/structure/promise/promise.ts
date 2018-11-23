import { CompanyStructureService } from 'api/Services';

export const loadCompanyStructure = (outerPayload) => {
  const payload: any = {};
  if (outerPayload.linear) {
    payload.linear = true;
  }
  if (outerPayload.descendants_by_user) {
    payload.descendants_by_user = true;
  }

  return CompanyStructureService
    .get(payload)
    .then(({ result }) => ({
      company_structure_list: result,
    }))
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        company_structure_list: [],
      };
    });
};
