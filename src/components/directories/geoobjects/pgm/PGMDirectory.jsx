import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import PGMTable, { tableMeta } from './PGMTable.jsx';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';

@connectToStores(['geoObjects', 'session'])
@exportable({ entity: 'geozones/pgm_store' })
@staticProps({
  path: 'geozones',
  entity: 'pgm',
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
