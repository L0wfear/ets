import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import PedestrianTunnelExitsTable, { tableMeta, renderers } from './PedestrianTunnelExitsTable';
import GeoObjectsMapModal from '../GeoObjectsMapModal';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'gormost', entity: 'pedestrian_tunnel_exits' })
@staticProps({
  path: 'gormost',
  entity: 'pedestrian_tunnel_exits',
  listName: 'pedestrian_tunnel_exitssList',
  tableComponent: PedestrianTunnelExitsTable,
  formComponent: GeoObjectsMapModal,
  formRenderers: renderers,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class PedestrianTunnelExitsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pedestrian_tunnel_exits', 'GormostService');
  }
}
