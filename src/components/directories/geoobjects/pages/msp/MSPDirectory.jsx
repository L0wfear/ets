import MSPTable, { tableMeta } from 'components/directories/geoobjects/pages/msp/MSPTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModalWrap from 'components/directories/geoobjects/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/msp/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'msp' })
@staticProps({
  path: 'geozones',
  permissions,
  entity: 'msp',
  listName: 'mspsList',
  tableComponent: MSPTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
})
export default class MSPDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('msp');
  }
}
