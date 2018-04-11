import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';

import CheckableElementsList from 'components/CheckableElementsList.jsx';
import ContractorTable from 'components/directories/repair/contractor/ContractorTable';
import ContractorFormWrap from 'components/directories/repair/contractor/ContractorFormWrap';

@connectToStores(['repair', 'session'])
@exportable({ entity: `repair/${REPAIR.contractor}` })
@staticProps({
  entity: 'repair_contractor',
  listName: 'contractorList',
  formComponent: ContractorFormWrap,
  tableComponent: ContractorTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class ContractorList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('repair').removeСontractor;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('repair').getRepairListByType('contractor');
  }
}
