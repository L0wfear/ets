import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import CheckableElementsList from 'components/CheckableElementsList.jsx'
import StateProgramTable from './StateProgramTable.tsx';
import StateProgramFormWrap from './StateProgramFormWrap';

@connectToStores(['repair', 'session'])
@exportable({ entity: `repair/${REPAIR.stateProgram}` })
@staticProps({
  entity: 'repair_state_program',
  listName: 'stateProgramList',
  formComponent: StateProgramFormWrap,
  tableComponent: StateProgramTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class StateProgramList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('repair').removeStateProgram;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('stateProgram');
    flux.getActions('repair').getRepairListByType('stateProgramStatus');
  }
}
