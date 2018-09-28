import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import SSPTable, { tableMeta } from 'components/directories/geoobjects/pages/ssp/SSPTable';
import GeoObjectsMapModalWrap from 'components/directories/geoobjects/form/GeoObjectsMapModalWrap';
import schema from 'components/directories/geoobjects/pages/ssp/schema';
import permissions from 'components/directories/geoobjects/pages/ssp/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'ssp' })
@staticProps({
  path: 'geozones',
  permissions,
  entity: 'ssp',
  schema,
  listName: 'sspsList',
  tableComponent: SSPTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
})
export default class SSPDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('ssp');
  }
}
