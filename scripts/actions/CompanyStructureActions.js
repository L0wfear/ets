import { Actions } from 'flummox';
import { CompanyStructureService } from 'api/Services';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';

export default class CompanyStructureActions extends Actions {

  createCompanyElement(data) {
    const payload = _.cloneDeep(data);

    return CompanyStructureService.post(payload, false);
  }

  updateCompanyElement(data) {
    const payload = _.cloneDeep(data);
    delete payload.type_display;
    delete payload.legal_person_id;

    return CompanyStructureService.put(payload, false);
  }

  deleteCompanyElement(id) {
    const payload = {
      id
    };

    return CompanyStructureService.delete(payload, false);
  }

  getCompanyStructure() {
    return CompanyStructureService.get();
  }

  async getPlainCompanyStructure() {
    const payload = {
      linear: true,
    };

    let response = await CompanyStructureService.get(payload);
    return response.result || [];
  }

}
