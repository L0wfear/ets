import MSPTable, { tableMeta } from 'components/directories/geoobjects/msp/MSPTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal.jsx';
import schema from 'components/directories/geoobjects/msp/schema';
import permissions from 'components/directories/geoobjects/msp/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'msp' })
@staticProps({
  path: 'geozones',
  permissions,
  entity: 'msp',
  schema,
  listName: 'mspsList',
  tableComponent: MSPTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
})
export default class MSPDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('msp');
  }
}
