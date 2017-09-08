import { Actions } from 'flummox';
import { CompanyStructureService } from 'api/Services';
import { cloneDeep } from 'lodash';

export default class CompanyStructureActions extends Actions {

  createCompanyElement(data) {
    const payload = { ...data };

    return CompanyStructureService.post(payload, null, 'json');
  }

  updateCompanyElement(data) {
    const payload = cloneDeep(data);
    delete payload.type_display;
    delete payload.legal_person_id;

    return CompanyStructureService.put(payload, null, 'json');
  }

  deleteCompanyElement(id) {
    const payload = {
      id,
    };

    return CompanyStructureService.delete(payload, true, 'json');
  }

  async getCompanyStructure(linear = false, descendants_by_user = false) {
    const payload = {};
    if (linear) payload.linear = 'wft_back??';
    if (descendants_by_user) payload.descendants_by_user = 'wft_back??';

    const data = await CompanyStructureService.get(payload);

    return {
      data,
      linear,
      descendants_by_user,
    };
  }
}
