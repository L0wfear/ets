import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import InsurancePolicyFormWrap from './InsurancePolicyFormWrap.jsx';
import InsurancePolicyTable, { tableMeta } from './InsurancePolicyTable.tsx';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.insurancePolicy}` })
@staticProps({
  entity: 'autobase_insurance_policy_registry',
  listName: 'insurancePolicyList',
  tableComponent: InsurancePolicyTable,
  formComponent: InsurancePolicyFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class InsurancePolicyList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeInsurancePolicy;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('insurancePolicy');
    } else {
      flux.getActions('autobase').getAutobaseListByType('insurancePolicy', { car_id });
    }
    flux.getActions('autobase').getAutobaseListByType('insuranceType');
    flux.getActions('objects').getCars();
  }
}
