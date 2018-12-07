import * as queryString from 'query-string';

import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import permissions from 'components/directories/autobase/cars/config-data/permissions';

import CarFormWrap from 'components/directories/autobase/cars/CarFormWrap';
import CarsTable from 'components/directories/autobase/cars/CarsTable';

@connectToStores(['objects', 'session'])
@exportable({ entity: 'car_actual' })
@staticProps({
  entity: 'car',
  permissions,
  listName: 'carsList',
  selectField: 'asuods_id',
  tableComponent: CarsTable,
  formComponent: CarFormWrap,
  operations: ['LIST', 'READ', 'UPDATE'],
})
class CarsList extends ElementsList {
  constructor() {
    super();
    this.preventUrlFilters = true;
  }

  async init() {
    const { flux } = this.context;

    const {
      location: {
        search,
      },
    } = this.props;

    const searchObject = queryString.parse(search);

    await flux.getActions('objects').getTypes();
    await flux.getActions('objects').getSensorTypes();

    const cars = await flux.getActions('objects').getCars();

    if (searchObject.asuods_id) {
      const asuods_id = parseInt(searchObject.asuods_id, 10);
      const selectedElement = cars.result.find(car => car.asuods_id === asuods_id);

      if (selectedElement) {
        this.setState({
          selectedElement,
          showForm: true,
        });
      }
    }
    if (searchObject) {
      this.props.history.replace(this.props.location.pathname, {});
    }
  }
}

export default CarsList;
