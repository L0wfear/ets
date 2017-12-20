import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import ODHTable, { tableMeta } from './ODHTable.tsx';
import OdhFormWrap from './OdhFormWrap.jsx';
import schema from './ODHSchema';

@connectToStores(['geoObjects', 'session'])
@exportable({ path: 'geozones', entity: 'odh' })
@staticProps({
  path: 'geozones',
  entity: 'odh',
  listName: 'odhsList',
  tableComponent: ODHTable,
  formComponent: OdhFormWrap,
  formMeta: tableMeta(),
  operations: ['READ'],
})
export default class ODHDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const linear = true;
    const descendants_by_user = true;

    flux.getActions('geoObjects').getGeozoneByType('odh');
    flux.getActions('companyStructure').getCompanyStructure(linear, descendants_by_user);
  }
}
