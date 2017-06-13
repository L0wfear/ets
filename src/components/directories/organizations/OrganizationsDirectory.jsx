import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import OrganizationsTable from './OrganizationsTable.jsx';
import OrganizationsFormWrap from './OrganizationsFormWrap';
@connectToStores(['objects'])
@staticProps({
  entity: 'companies',
  listName: 'companyList',
  selectField: 'company_id',
  tableComponent: OrganizationsTable,
  formComponent: OrganizationsFormWrap,
  operations: ['LIST', 'READ', 'UPDATE'],
})
export default class OrganizationsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('companyStructure').getCompanyList();
  }
}
