import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import SSPTable, { tableMeta } from 'components/directories/geoobjects/ssp/SSPTable.jsx';
import GeoObjectsMapModal from 'components/directories/geoobjects/GeoObjectsMapModal.jsx';
import schema from 'components/directories/geoobjects/ssp/schema';
import permissions from 'components/directories/geoobjects/ssp/config-data/permissions';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'ssp' })
@staticProps({
  path: 'geozones',
  permissions,
  entity: 'ssp',
  schema,
  listName: 'sspsList',
  tableComponent: SSPTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
})
export default class SSPDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('ssp');
  }
}
