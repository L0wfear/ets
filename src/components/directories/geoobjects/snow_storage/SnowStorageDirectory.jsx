import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import SnowStorageTable, { tableMeta } from 'components/directories/geoobjects/snow_storage/SnowStorageTable';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal';
import permissions from 'components/directories/geoobjects/snow_storage/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ entity: 'geozones/snow_storage' })
@staticProps({
  path: 'geozones',
  entity: 'snow_storage',
  permissions,
  listName: 'snowStoragesList',
  tableComponent: SnowStorageTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class SnowStorageDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('snow_storage');
  }
}
