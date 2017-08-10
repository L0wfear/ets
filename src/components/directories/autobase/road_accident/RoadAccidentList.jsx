import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import RoadAccidentFormWrap from './RoadAccidentFormWrap';
import RoadAccidentTable from './RoadAccidentTable';

@connectToStores(['autobase', 'employees', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.roadAccidentRegistry}` })
@staticProps({
  entity: 'autobase_road_accident',
  listName: 'roadAccidentRegistryList',
  tableComponent: RoadAccidentTable,
  formComponent: RoadAccidentFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class RoadAccidentList extends ElementsList {
  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;
    this.removeElementAction = context.flux.getActions('autobase').removeRoadAccident.bind(null, car_id === -1 ? {} : { car_id });
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('roadAccidentRegistry');
    } else {
      flux.getActions('autobase').getAutobaseListByType('roadAccidentRegistry', { car_id });
      this.exportPayload = { car_id };
    }
    flux.getActions('employees').getDrivers();
    flux.getActions('autobase').getAutobaseListByType('roadAccidentCause');
  }
}
