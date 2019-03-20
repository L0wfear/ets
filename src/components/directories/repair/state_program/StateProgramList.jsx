// import _ from 'lodash';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import CheckableElementsList from 'components/CheckableElementsList';
import StateProgramTable from 'components/directories/repair/state_program/StateProgramTable';
import StateProgramFormWrap from 'components/directories/repair/state_program/StateProgramFormWrap';
import permissions from 'components/directories/repair/state_program/config-data/permissions';
import { compose } from 'recompose';
import { getSessionState } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';

@connectToStores(['repair'])
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
    this.removeElementAction = context.flux.getActions(
      'repair',
    ).removeStateProgram;
  }

  init() {
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('stateProgram');
    flux.getActions('repair').getRepairListByType('stateProgramStatus');
  }
}

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(StateProgramList);
