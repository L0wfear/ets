import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TechInspectionTable, { tableMeta } from './TechInspectionTable.jsx';
import TechInspectionFormWrap from './TechInspectionFormWrap';

// TODO permission
@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.techInspection}` })
@staticProps({
  entity: AUTOBASE.techInspection,
  listName: 'techInspectionList',
  formComponent: TechInspectionTable,
  tableComponent: TechInspectionFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class techInspection extends ElementsList {
  componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('techInspection');

    this.removeElementAction = flux.getActions('autobase').removeTechInspection;
  }
}
