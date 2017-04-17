import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import SnowStorageTable, { tableMeta } from './SnowStorageTable.jsx';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';

@connectToStores(['geoObjects', 'session'])
@exportable({ entity: 'geozones/snow_storage' })
@staticProps({
  path: 'geozones',
  entity: 'snow_storage',
  listName: 'snowStoragesList',
  tableComponent: SnowStorageTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
})
export default class SnowStorageDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('snow_storage');
  }
}
