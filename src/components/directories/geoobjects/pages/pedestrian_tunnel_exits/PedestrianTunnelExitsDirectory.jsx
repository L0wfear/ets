import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import PedestrianTunnelExitsTable, { tableMeta } from 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsTable';
import GeoObjectsMapModalWrap from 'components/new/pages/nsi/geoobjects/ui/form/GeoObjectsMapModalWrap';
import permissions from 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'pedestrian_tunnel_exits' })
@staticProps({
  path: 'gormost',
  entity: 'pedestrian_tunnel_exits',
  permissions,
  listName: 'pedestrian_tunnel_exitssList',
  tableComponent: PedestrianTunnelExitsTable,
  formComponent: GeoObjectsMapModalWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class PedestrianTunnelExitsDirectory extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pedestrian_tunnel_exits', 'GormostService');
  }
}
