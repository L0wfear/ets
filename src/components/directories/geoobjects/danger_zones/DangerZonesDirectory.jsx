import DangerZonesTable, { tableMeta } from 'components/directories/geoobjects/danger_zones/DangerZonesTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal.jsx';
import permissions from 'components/directories/geoobjects/danger_zones/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'danger_zone' })
@staticProps({
  path: 'geozones',
  entity: 'danger_zone',
  permissions,
  listName: 'dangerZonesList',
  tableComponent: DangerZonesTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
})
export default class DangerZonesDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('danger_zone');
  }
}
