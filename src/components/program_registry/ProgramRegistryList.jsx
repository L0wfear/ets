import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import ProgramRegistryTable from 'components/program_registry/ProgramRegistryTable.tsx';
import ProgramRegistrySwitch from 'components/program_registry/ProgramRegistrySwitch.tsx';

@connectToStores(['repair', 'session'])
@exportable({ entity: `repair/${REPAIR.programRegistry}` })
@staticProps({
  entity: 'repair_program',
  listName: 'programRegistryList',
  tableComponent: ProgramRegistryTable,
  formComponent: ProgramRegistrySwitch,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
  selectField: 'version_id',
})
export default class ProgramRegistryList extends CheckableElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('repair').removeProgramRegistry;
  }

  /**
   * @override
   */
  selectElement = ({ props }) => {
    const DOUBLECLICK_TIMEOUT = 300;
    function onDoubleClick() {
      return this.setState({
        showForm: true,
      });
    }

    // TODO реализовать вызов ошибки в случае пустого айдишника
    const id = props && props.data ? props.data[this.selectField] : null;

    if (props.fromKey) {
      const selectedElement = find(this.state.elementsList, el => el[this.selectField] === id);
      if (selectedElement) {
        this.setState({ selectedElement });
      }
      return;
    }

    this.clicks += 1;

    if (this.clicks === 1) {
      const selectedElement = this.state.elementsList.find(el => el[this.selectField] === id);
      this.setState({ selectedElement });
      setTimeout(() => {
        // В случае если за DOUBLECLICK_TIMEOUT (мс) кликнули по одному и тому же элементу больше 1 раза
        if (this.clicks !== 1) {
          if (this.state.selectedElement && id === this.state.selectedElement[this.selectField] && this.state.readPermission) {
            onDoubleClick.call(this);
          }
        }
        this.clicks = 0;
      }, DOUBLECLICK_TIMEOUT);
    }
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('programRegistry');
  }
}
