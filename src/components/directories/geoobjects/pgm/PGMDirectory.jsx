import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import PGMTable, { tableMeta } from 'components/directories/geoobjects/pgm/PGMTable';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal';
import permissions from 'components/directories/geoobjects/pgm/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ entity: 'geozones/pgm_store' })
@staticProps({
  path: 'geozones',
  entity: 'pgm',
  permissions,
  listName: 'pgmsList',
  tableComponent: PGMTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
})
export default class PGMDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pgm_store');
  }
}
