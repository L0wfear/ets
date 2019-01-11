import DangerZonesTable, { tableMeta, renderers } from 'components/directories/geoobjects/pages/danger_zones/DangerZonesTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModalWrap from 'components/new/pages/nsi/geoobjects/ui/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/danger_zones/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'danger_zone' })
@staticProps({
  path: 'geozones',
  entity: 'danger_zone',
  permissions,
  listName: 'dangerZonesList',
  tableComponent: DangerZonesTable,
  formComponent: GeoObjectsMapModalWrap,
  formRenderers: renderers,
  formMeta: tableMeta(),
})
export default class DangerZonesDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('danger_zone');
  }
}
