import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import PedestrianTunnelsTable, { tableMeta } from 'components/directories/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsTable';
import GeoObjectsMapModalWrap from 'components/new/pages/nsi/geoobjects/ui/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/pedestrian_tunnels/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'pedestrian_tunnels' })
@staticProps({
  path: 'gormost',
  entity: 'pedestrian_tunnels',
  permissions,
  listName: 'pedestrian_tunnelssList',
  tableComponent: PedestrianTunnelsTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class PedestrianTunnelsDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pedestrian_tunnels', 'GormostService');
  }
}
