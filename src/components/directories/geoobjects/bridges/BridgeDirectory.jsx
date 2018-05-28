import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import BridgeTable, { tableMeta, renderers } from 'components/directories/geoobjects/bridges/BridgeTable';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal';
import permissions from 'components/directories/geoobjects/bridges/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'bridges' })
@staticProps({
  path: 'gormost',
  entity: 'bridges',
  permissions,
  listName: 'bridgessList',
  tableComponent: BridgeTable,
  formComponent: GeoObjectsMapModal,
  formRenderers: renderers,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class BridgeDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('bridges', 'GormostService');
  }
}
