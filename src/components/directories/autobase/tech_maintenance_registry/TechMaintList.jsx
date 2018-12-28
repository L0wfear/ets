import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import TechMaintFormWrap from 'components/directories/autobase/tech_maintenance_registry/TechMaintFormWrap';
import TechMaintTable from 'components/directories/autobase/tech_maintenance_registry/TechMaintTable';
import permissions from 'components/directories/autobase/tech_maintenance_registry/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.techMaint}` })
@staticProps({
  entity: 'autobase_tech_maintenance',
  permissions,
  listName: 'techMaintList',
  tableComponent: TechMaintTable,
  formComponent: TechMaintFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TechMaintList extends ElementsList {
  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;
    this.removeElementAction = context.flux.getActions('autobase').removeTechMaint.bind(null, car_id === -1 ? {} : { car_id });
  }
  init() {
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
