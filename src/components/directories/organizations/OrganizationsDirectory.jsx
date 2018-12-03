import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import OrganizationsTable from 'components/directories/organizations/OrganizationsTable';
import OrganizationsFormWrap from 'components/directories/organizations/OrganizationsFormWrap';
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
  init() {
    const { flux } = this.context;
    flux.getActions('objects').getOrganizations();
  }
}
