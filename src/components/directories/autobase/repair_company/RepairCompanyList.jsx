import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import RepairCompanyTable from './RepairCompanyTable';
import RepairCompanyFormWrap from './RepairCompanyFormWrap';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.repairCompany}` })
@staticProps({
  entity: 'autobase_repair_company',
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
