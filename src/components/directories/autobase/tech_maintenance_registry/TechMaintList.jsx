import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TechMaintFormWrap from './TechMaintFormWrap';
import TechMaintTable from './TechMaintTable';

@connectToStores(['autobase', 'session', 'objects'])
@exportable({ entity: `autobase/${AUTOBASE.techMaint}` })
@staticProps({
  entity: 'autobase_tech_maintenance_registry',
  listName: 'techMaintList',
  tableComponent: TechMaintTable,
  formComponent: TechMaintFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TechMaintList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeTechMaint;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('techMaint');
    } else {
      flux.getActions('autobase').getAutobaseListByType('techMaint', { car_id });
      this.exportPayload = { car_id };
    }
  }
}
