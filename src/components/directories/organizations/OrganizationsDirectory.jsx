import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import OrganizationsTable from './OrganizationsTable';
import OrganizationsFormWrap from './OrganizationsFormWrap';
@connectToStores(['objects'])
@staticProps({
  entity: 'company',
  listName: 'organizations',
  selectField: 'company_id',
  tableComponent: OrganizationsTable,
  formComponent: OrganizationsFormWrap,
  operations: ['LIST', 'READ', 'UPDATE'],
})
export default class OrganizationsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getOrganizations();
  }
}
