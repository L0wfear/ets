import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import BridgeTable, { tableMeta, renderers } from 'components/directories/geoobjects/pages/bridges/BridgeTable';
import GeoObjectsMapModalWrap from 'components/directories/geoobjects/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/bridges/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'bridges' })
@staticProps({
  path: 'gormost',
  entity: 'bridges',
  permissions,
  listName: 'bridgesList',
  tableComponent: BridgeTable,
  formComponent: GeoObjectsMapModalWrap,
  formRenderers: renderers,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class BridgeDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('bridges', 'GormostService');
  }
}
