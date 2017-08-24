import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import FountainsTable, { tableMeta, renderers } from './FountainsTable';
import GeoObjectsMapModal from '../GeoObjectsMapModal';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'fountains' })
@staticProps({
  path: 'gormost',
  entity: 'fountains',
  listName: 'fountainssList',
  tableComponent: FountainsTable,
  formComponent: GeoObjectsMapModal,
  formRenderers: renderers,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class FountainsTunnelsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('fountains', 'GormostService');
  }
}
