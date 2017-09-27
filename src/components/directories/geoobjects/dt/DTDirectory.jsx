import { connectToStores, staticProps, exportable } from 'utils/decorators';

import ElementsList from 'components/ElementsList.jsx';
import DtFormWrap from './DtFormWrap.jsx';
import DTTable, { tableMeta } from './DTTable.tsx';
import schema from './DTSchema';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'dt' })
@staticProps({
  path: 'geozones',
  entity: 'dt',
  schema,
  listName: 'dtsList',
  tableComponent: DTTable,
  formComponent: DtFormWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class DTDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const linear = true;
    const descendants_by_user = true;

    flux.getActions('geoObjects').getGeozoneByType('dt');
    flux.getActions('companyStructure').getCompanyStructure(linear, descendants_by_user);
  }
}
