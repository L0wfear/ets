// import _ from 'lodash';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import CheckableElementsList from 'components/CheckableElementsList';
import StateProgramTable from 'components/directories/repair/state_program/StateProgramTable';
import StateProgramFormWrap from 'components/directories/repair/state_program/StateProgramFormWrap';
import permissions from 'components/directories/repair/state_program/config-data/permissions';

@connectToStores(['repair', 'session'])
@exportable({ entity: `repair/${REPAIR.stateProgram}` })
@staticProps({
  entity: 'repair_state_program',
  permissions,
  listName: 'stateProgramList',
  formComponent: StateProgramFormWrap,
  tableComponent: StateProgramTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class StateProgramList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('repair').removeStateProgram;
  }

  init() {
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('stateProgram');
    flux.getActions('repair').getRepairListByType('stateProgramStatus');
  }
}

export default StateProgramList;
