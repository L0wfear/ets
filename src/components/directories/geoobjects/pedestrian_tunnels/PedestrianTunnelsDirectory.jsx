import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import PedestrianTunnelsTable, { tableMeta } from 'components/directories/geoobjects/pedestrian_tunnels/PedestrianTunnelsTable';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal';
import permissions from 'components/directories/geoobjects/pedestrian_tunnels/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'pedestrian_tunnels' })
@staticProps({
  path: 'gormost',
  entity: 'pedestrian_tunnels',
  permissions,
  listName: 'pedestrian_tunnelssList',
  tableComponent: PedestrianTunnelsTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class PedestrianTunnelsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pedestrian_tunnels', 'GormostService');
  }
}
