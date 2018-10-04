import CarpoolTable, { tableMeta } from 'components/directories/geoobjects/pages/carpool/CarpoolTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModalWrap from 'components/directories/geoobjects/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/carpool/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'carpool' })
@staticProps({
  path: 'geozones',
  entity: 'carpool',
  permissions,
  listName: 'carpoolsList',
  tableComponent: CarpoolTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class CarpoolDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('carpool');
  }
}
