import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import InsurancePolicyFormWrap from './InsurancePolicyFormWrap.jsx';
import InsurancePolicyTable from './InsurancePolicyTable.tsx';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.insurancePolicy}` })
@staticProps({
  entity: 'autobase_insurance_policy',
  listName: 'insurancePolicyList',
  tableComponent: InsurancePolicyTable,
  formComponent: InsurancePolicyFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class InsurancePolicyList extends ElementsList {
  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;
    this.removeElementAction = context.flux.getActions('autobase').removeInsurancePolicy.bind(null, car_id === -1 ? {} : { car_id });
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('insurancePolicy');
      flux.getActions('objects').getCars();
    } else {
      flux.getActions('autobase').getAutobaseListByType('insurancePolicy', { car_id });
      this.exportPayload = { car_id };
    }
  }
}
