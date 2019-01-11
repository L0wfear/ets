import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import FuelingWaterStationsTable, { tableMeta } from 'components/directories/geoobjects/pages/fueling_water/FuelingWaterStationsTable';
import GeoObjectsMapModalWrap from 'components/new/pages/nsi/geoobjects/ui/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/fueling_water/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'fueling_water' })
@staticProps({
  path: 'geozones',
  entity: 'fueling_water',
  permissions,
  listName: 'fuelingWaterStationsList',
  tableComponent: FuelingWaterStationsTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class FuelingWaterStationsDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('fueling_water');
  }
}
