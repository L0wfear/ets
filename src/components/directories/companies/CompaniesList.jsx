import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import CompaniesTable from 'components/directories/companies/CompaniesTable';
import CompaniesFormWrap from 'components/directories/companies/CompaniesFormWrap';

@connectToStores(['objects'])
@staticProps({
  entity: 'company',
  listName: 'companies',
  selectField: 'company_id',
  tableComponent: CompaniesTable,
  formComponent: CompaniesFormWrap,
  operations: ['LIST', 'READ', 'UPDATE'],
})
class CompaniesList extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('objects').getCompanies();
  }
}

export default CompaniesList;
