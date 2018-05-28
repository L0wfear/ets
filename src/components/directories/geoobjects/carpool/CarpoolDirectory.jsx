import CarpoolTable, { tableMeta } from 'components/directories/geoobjects/carpool/CarpoolTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal.jsx';
import permissions from 'components/directories/geoobjects/carpool/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'carpool' })
@staticProps({
  path: 'geozones',
  entity: 'carpool',
  permissions,
  listName: 'carpoolsList',
  tableComponent: CarpoolTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class CarpoolDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('carpool');
  }
}
