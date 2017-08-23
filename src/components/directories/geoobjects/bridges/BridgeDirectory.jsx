import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import BridgeTable, { tableMeta, renderers } from './BridgeTable';
import GeoObjectsMapModal from '../GeoObjectsMapModal';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'bridges' })
@staticProps({
  path: 'gormost',
  entity: 'bridges',
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
