import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import ProgramRegistryTable from './ProgramRegistryTable.tsx';
import ProgramRegistryFormWrap from './ProgramRegistryFormWrap';


const statusForCancelRemove = [
  'draft',
  'rejected',
];

@connectToStores(['repair', 'session'])
@exportable({ entity: `repair/${REPAIR.programRegistry}` })
@staticProps({
  entity: 'repair_program',
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

  /**
   * @override
   */
  removeElement() {
    if (this.state.selectedElement === null) {
      return;
    }

    const id = this.state.selectedElement[this.selectField];
    if (!statusForCancelRemove.includes(this.state.selectedElement.status)) {
      global.NOTIFICATION_SYSTEM.notify('Удаление запрещено (см. статус)', 'error');
      return;
    }

    confirmDialog({
      title: 'Внимание',
      body: 'Вы уверены, что хотите удалить выбранный элемент?',
    })
    .then(() => {
      this.removeElementAction(id);
      this.setState({ selectedElement: null });
    })
    .catch(() => {});
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    flux.getActions('repair').getRepairListByType('programRegistry');
  }
}
