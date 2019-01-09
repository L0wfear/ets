import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import ODHTable, { tableMeta } from 'components/directories/geoobjects/pages/odh/ODHTable';
import OdhFormWrap from 'components/directories/geoobjects/pages/odh/OdhFormWrap';
import permissions from 'components/directories/geoobjects/pages/odh/config-data/permissions';

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
class ODHDirectory extends ElementsList {
  init() {
    const { flux } = this.context;

    flux.getActions('geoObjects').getGeozoneByType('odh');
  }
}

export default ODHDirectory;
