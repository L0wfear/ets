import { Actions } from 'flummox';
import { CompanyStructureService } from 'api/Services';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';

export default class CompanyStructureActions extends Actions {

  createCompanyElement(data) {
    const payload = _.cloneDeep(data);

    return CompanyStructureService.post(payload);
  }

  updateCompanyElement() {

  }

  deleteCompanyElement() {

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
