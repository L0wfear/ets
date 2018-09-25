import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import RepairCompanyTable from 'components/directories/autobase/repair_company/RepairCompanyTable';
import RepairCompanyFormWrap from 'components/directories/autobase/repair_company/RepairCompanyFormWrap';
import permissions from 'components/directories/autobase/repair_company/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.repairCompany}` })
@staticProps({
  entity: 'autobase_company',
  permissions,
  listName: 'repairCompanyList',
  formComponent: RepairCompanyFormWrap,
  tableComponent: RepairCompanyTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class RepairCompanyList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeRepairCompany;
  }
  componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('repairCompany');
  }
}
