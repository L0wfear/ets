import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TechInspectionFormWrap from './TechInspectionFormWrap';
import TechInspectionTable, { tableMeta } from './TechInspectionTable';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.techInspection}` })
@staticProps({
  entity: 'autobase_tech_inspection',
  listName: 'insurancePolicyList',
  tableComponent: TechInspectionTable,
  formComponent: TechInspectionFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TechInspectionList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeTechInspection;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id } = this.props;

    flux.getActions('autobase').getAutobaseListByType('techInspection', { car_id });
  }
}
