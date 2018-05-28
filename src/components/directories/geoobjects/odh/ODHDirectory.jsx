import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import ODHTable, { tableMeta } from 'components/directories/geoobjects/odh/ODHTable.tsx';
import OdhFormWrap from 'components/directories/geoobjects/odh/OdhFormWrap.jsx';
import permissions from 'components/directories/geoobjects/odh/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'odh' })
@staticProps({
  path: 'geozones',
  permissions,
  entity: 'odh',
  listName: 'odhsList',
  tableComponent: ODHTable,
  formComponent: OdhFormWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class ODHDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const linear = true;
    const descendants_by_user = true;

    flux.getActions('geoObjects').getGeozoneByType('odh');
    flux.getActions('companyStructure').getCompanyStructure(linear, descendants_by_user);
  }
}
