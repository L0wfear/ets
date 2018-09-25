import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import FuelingWaterStationsTable, { tableMeta } from 'components/directories/geoobjects/fueling_water/FuelingWaterStationsTable';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal';
import permissions from 'components/directories/geoobjects/fueling_water/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'fueling_water' })
@staticProps({
  path: 'geozones',
  entity: 'fueling_water',
  permissions,
  listName: 'fuelingWaterStationsList',
  tableComponent: FuelingWaterStationsTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class FuelingWaterStationsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('fueling_water');
  }
}
