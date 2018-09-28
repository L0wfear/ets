import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import FountainsTable, { tableMeta, renderers } from 'components/directories/geoobjects/pages/fountains/FountainsTable';
import GeoObjectsMapModalWrap from 'components/directories/geoobjects/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/fountains/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'fountains' })
@staticProps({
  path: 'gormost',
  entity: 'fountains',
  permissions,
  listName: 'fountainssList',
  tableComponent: FountainsTable,
  formComponent: GeoObjectsMapModalWrap,
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
