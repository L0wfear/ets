import { Store } from 'flummox';

export default class CompanyStructureStore extends Store {

  constructor(flux) {
    super();

    this.register(flux.getActions('companyStructure').getCompanyStructure, this.handleGetList);

    this.state = { companyStructureList: [] };
  }

  handleGetList(res) {
    this.setState({ 'companyStructureList': res.data.result });
  }
}
