import { Store } from 'flummox';

export default class CompanyStructureStore extends Store {

  constructor(flux) {
    super();

    const autobasesActions = flux.getActions('companyStructure');
    this.register(autobasesActions.getLinearCompanyStructureForUser, this.handleGetList);

    this.state = { companyStructureList: [] };
  }

  handleGetList(res) {
    this.setState({ 'companyStructureList': res });
  }
}
