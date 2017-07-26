import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import InsurancePolicyFormWrap from './InsurancePolicyFormWrap.jsx';
import InsurancePolicyTable, { tableMeta } from './InsurancePolicyTable';

@connectToStores(['autobase', 'session'])
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
    const { car_id = -1 } = this.props;

    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('insurancePolicy', { car_id });
    flux.getActions('autobase').getAutobaseListByType('insuranceType');
  }
}
