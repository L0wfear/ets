import { connectToStores, staticProps, exportable } from 'utils/decorators';

import ElementsList from 'components/ElementsList';
import DtFormWrap from 'components/directories/geoobjects/pages/dt/DtFormWrap';
import DTTable, { tableMeta } from 'components/directories/geoobjects/pages/dt/DTTable';
import schema from 'components/directories/geoobjects/pages/dt/DTSchema';
import permissions from 'components/directories/geoobjects/pages/dt/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'dt' })
@staticProps({
  path: 'geozones',
  entity: 'dt',
  permissions,
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
