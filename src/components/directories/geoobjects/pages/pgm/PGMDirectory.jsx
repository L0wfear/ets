import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import PGMTable, { tableMeta } from 'components/directories/geoobjects/pages/pgm/PGMTable';
import GeoObjectsMapModalWrap from 'components/directories/geoobjects/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/pgm/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ entity: 'geozones/pgm_store' })
@staticProps({
  path: 'geozones',
  entity: 'pgm',
  permissions,
  listName: 'pgmsList',
  tableComponent: PGMTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
})
export default class PGMDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pgm_store');
  }
}
