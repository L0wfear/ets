import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import ProgramRegistryTable from './ProgramRegistryTable.tsx';
import ProgramRegistryFormWrap from './ProgramRegistryFormWrap';

@connectToStores(['repair', 'session'])
@exportable({ entity: `repair/${REPAIR.programRegistry}` })
@staticProps({
  entity: 'repair_program_registry',
  listName: 'programRegistryList',
  tableComponent: ProgramRegistryTable,
  formComponent: ProgramRegistryFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class ProgramRegistryList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('repair').removeProgramRegistry;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('programRegistry');
  }
}
