import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import CarTypesTable from 'components/directories/autobase/car_types/CarTypesTable';
import permissions from 'components/directories/autobase/car_types/config-data/permissions';

@connectToStores(['objects'])
@exportable({ entity: 'types' })
@staticProps({
  entity: 'type',
  permissions,
  listName: 'typesList',
  tableComponent: CarTypesTable,
})
export default class CarTypesDirectory extends ElementsList {

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypes();
  }

}
