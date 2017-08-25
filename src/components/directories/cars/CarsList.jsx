import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import CarFormWrap from './CarFormWrap.jsx';
import CarsTable from './CarsTable.tsx';
import schema from './schema';

@connectToStores(['objects', 'session'])
@exportable({ entity: 'car_actual' })
@staticProps({
  entity: 'car',
  listName: 'carsList',
  schema,
  selectField: 'asuods_id',
  tableComponent: CarsTable,
  formComponent: CarFormWrap,
  operations: ['LIST', 'READ', 'UPDATE'],
})
export default class CarsList extends ElementsList {
  constructor() {
    super();
    this.preventUrlFilters = true;
  }
  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    await flux.getActions('objects').getTypes();
    const cars = await flux.getActions('objects').getCars();

    if (this.props.location.query.asuods_id) {
      const asuods_id = parseInt(this.props.location.query.asuods_id, 10);
      const selectedElement = cars.result.find(car => car.asuods_id === asuods_id);

      // NOTE Так надо, потому что открыть форму можно только через стейт родительского класса
      this.setState({
        ...this.state,
        selectedElement,
        showForm: true,
      });
    }
  }
}
