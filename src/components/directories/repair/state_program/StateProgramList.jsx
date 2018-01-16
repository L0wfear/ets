import _ from 'lodash';
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

  async refreshList() {
    await this.context.flux.getActions('repair').getRepairListByType('stateProgram');
    await this.context.flux.getActions('repair').getRepairListByType('stateProgramStatus');
  }

  removeCheckedElements = () => {
    this.defActionFunc();
  };

  async defActionFunc() {
    const {
      checkedElements = {},
    } = this.state;

    if (Object.values(checkedElements).length !== 0) {
      try {
        await (confirmDialog({
          title: 'Внимание',
          body: 'Вы уверены, что хотите удалить выбранный(-ые) элемент(ы) ?',
        }));


        _.forEach(checkedElements, (el) => {
          this.removeElementAction(el.id);
        });

       // global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены');
        this.refreshList();

        this.setState({
          checkedElements: {},
          selectedElement: null,
        });
      } catch (err) {
         console.log(err);
      }
    } else {
      await this.removeElement();
      this.refreshList();
    }
  }
}
