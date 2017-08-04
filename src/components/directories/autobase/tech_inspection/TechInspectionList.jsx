import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TechInspectionFormWrap from './TechInspectionFormWrap';
import TechInspectionTable, { tableMeta } from './TechInspectionTable.tsx';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.techInspection}` })
@staticProps({
  entity: 'autobase_tech_inspection',
  listName: 'techInspectionList',
  tableComponent: TechInspectionTable,
  formComponent: TechInspectionFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TechInspectionList extends ElementsList {
  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;
    this.removeElementAction = context.flux.getActions('autobase').removeTechInspection.bind(null, car_id === -1 ? {} : { car_id });
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('techInspection');
    } else {
      flux.getActions('autobase').getAutobaseListByType('techInspection', { car_id });
      this.exportPayload = { car_id };
    }
    flux.getActions('objects').getCars();
  }
}
