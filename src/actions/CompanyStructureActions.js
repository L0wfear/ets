import { Actions } from 'flummox';
import { CompanyStructureService, CompanyService } from 'api/Services';
import _ from 'lodash';

export default class CompanyStructureActions extends Actions {

  createCompanyElement(data) {
    const payload = _.cloneDeep(data);

    return CompanyStructureService.post(payload, null, 'json');
  }

  updateCompanyElement(data) {
    const payload = _.cloneDeep(data);
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

  getCompanyStructure() {
    return CompanyStructureService.get();
  }

  async getLinearCompanyStructure() {
    const payload = {
      linear: true,
    };

    const response = await CompanyStructureService.get(payload);
    return response.result || [];
  }

  async getLinearCompanyStructureForUser() {
    const payload = {
      linear: true,
      descendants_by_user: true,
    };

    const response = await CompanyStructureService.get(payload);
    return response.result || [];
  }

}
